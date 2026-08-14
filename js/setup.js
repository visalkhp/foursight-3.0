const STORAGE_KEY = "foursight:led-config:v1";
const BAUD_RATE = 9600;
const MAX_LED_INDEX = 179;
const TOTAL_LEDS = 180;

const ZONES = [
  ["hill", "Hill"], ["wooded", "Wooded Area"], ["forest", "Forest"],
  ["village", "Village"], ["power", "Power"], ["hospital", "Hospital"],
  ["river", "River"], ["bridge", "Bridge"], ["road", "Road"],
  ["farm", "Farm"], ["school", "School"]
];

const DEFAULT_RANGES = {
  hill:{start:0,end:16}, wooded:{start:17,end:33}, forest:{start:34,end:50},
  village:{start:51,end:67}, power:{start:68,end:83}, hospital:{start:84,end:99},
  river:{start:100,end:115}, bridge:{start:116,end:131}, road:{start:132,end:147},
  farm:{start:148,end:163}, school:{start:164,end:179}
};

const $ = id => document.getElementById(id);
const statusEl = $("saveStatus");
const encoder = new TextEncoder();
let port = null;
let writer = null;

function setStatus(text, tone = "neutral") { statusEl.textContent = text; statusEl.dataset.tone = tone; }
function inputsFor(key) { return {start:$(`${key}Start`),end:$(`${key}End`),count:$(`${key}Count`),error:$(`${key}Error`)}; }

function calculateCount(start, end) {
  if (start === "" || end === "") return "—";
  const s = Number(start), e = Number(end);
  return Number.isInteger(s) && Number.isInteger(e) && s >= 0 && e <= MAX_LED_INDEX && s <= e ? String(e-s+1) : "—";
}

function validateZone(key, requireComplete = false) {
  const {start,end,error,count} = inputsFor(key);
  const s = start.value.trim(), e = end.value.trim();
  error.textContent = ""; start.removeAttribute("aria-invalid"); end.removeAttribute("aria-invalid");
  count.textContent = calculateCount(s,e);
  if (s === "" && e === "" && !requireComplete) return true;
  if (s === "" || e === "") error.textContent = "Enter both Start and End.";
  else if (!Number.isInteger(Number(s)) || !Number.isInteger(Number(e))) error.textContent = "LED numbers must be whole numbers.";
  else if (Number(s) < 0 || Number(s) > MAX_LED_INDEX || Number(e) < 0 || Number(e) > MAX_LED_INDEX) error.textContent = `LED numbers must be between 0 and ${MAX_LED_INDEX}.`;
  else if (Number(s) > Number(e)) error.textContent = "Start LED cannot be greater than End LED.";
  if (error.textContent) { start.setAttribute("aria-invalid","true"); end.setAttribute("aria-invalid","true"); return false; }
  return true;
}

function readConfiguration() {
  const config = {};
  for (const [key] of ZONES) { const {start,end}=inputsFor(key); config[key]={start:start.value.trim(),end:end.value.trim()}; }
  return config;
}

function applyConfiguration(config) {
  for (const [key] of ZONES) { const {start,end}=inputsFor(key); const value=config?.[key]||{}; start.value=value.start??""; end.value=value.end??""; validateZone(key); }
}

function validateAll(requireComplete = false) { return ZONES.map(([key])=>validateZone(key,requireComplete)).every(Boolean); }

function saveConfiguration() {
  if (!validateAll(true)) { setStatus("Complete all 11 valid LED ranges before saving.","error"); return false; }
  try {
    localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,savedAt:new Date().toISOString(),zones:readConfiguration()}));
    setStatus("Configuration saved on this device.","good"); return true;
  } catch (error) { setStatus(`Could not save configuration: ${error.message}`,"error"); return false; }
}

function loadConfiguration() {
  try { const raw=localStorage.getItem(STORAGE_KEY); if(!raw){setStatus("No saved configuration found.","error");return;} const payload=JSON.parse(raw); applyConfiguration(payload.zones||payload); setStatus("Saved configuration loaded.","good"); }
  catch(error){setStatus(`Could not load configuration: ${error.message}`,"error");}
}

function clearConfiguration() {
  for(const [key] of ZONES){const {start,end}=inputsFor(key);start.value="";end.value="";validateZone(key);}
  setStatus("Fields cleared. Saved browser and Arduino configurations are unchanged.");
}

async function connectArduino() {
  if (!("serial" in navigator)) { setStatus("Web Serial needs Chrome or Edge on desktop.","error"); return; }
  if (writer) { setStatus("Arduino is already connected.","good"); return; }
  try { port=await navigator.serial.requestPort(); await port.open({baudRate:BAUD_RATE}); writer=port.writable.getWriter(); setStatus("Arduino connected at 9600 baud.","good"); }
  catch(error){setStatus(error.name==="NotFoundError"?"No Arduino was selected.":`Arduino connection failed: ${error.message}`,"error");}
}

async function send(command) {
  if (!writer) { setStatus("Connect Arduino first.","error"); return false; }
  try { await writer.write(encoder.encode(`${command}\n`)); return true; }
  catch(error){writer=null;port=null;setStatus(`Arduino disconnected: ${error.message}`,"error");return false;}
}

async function sendConfiguration() {
  if (!validateAll(true)) { setStatus("Complete all 11 valid LED ranges before sending.","error"); return; }
  const config=readConfiguration(), values=[];
  for(const [key] of ZONES) values.push(config[key].start,config[key].end);
  if(await send(`CFG,${values.join(',')}`)){saveConfiguration();setStatus("Configuration sent and stored in Arduino EEPROM.","good");}
}

async function testZone() {
  const index=Number($("testZoneSelect").value);
  if(await send(`T,${index}`)) setStatus(`${ZONES[index][1]} test sent. Select Default Terrain when finished.`,"good");
}

async function showDefaultTerrain(){if(await send("D"))setStatus("Default terrain restored.","good");}

for(const [key,label] of ZONES){
  const {start,end}=inputsFor(key);
  start.max=String(MAX_LED_INDEX); end.max=String(MAX_LED_INDEX);
  start.addEventListener("input",()=>validateZone(key));end.addEventListener("input",()=>validateZone(key));
  const option=document.createElement("option");option.value=String($("testZoneSelect").options.length);option.textContent=label;$("testZoneSelect").append(option);
}
$("connectSetupButton").addEventListener("click",connectArduino);
$("saveButton").addEventListener("click",saveConfiguration);
$("sendButton").addEventListener("click",sendConfiguration);
$("loadButton").addEventListener("click",loadConfiguration);
$("clearButton").addEventListener("click",clearConfiguration);
$("testZoneButton").addEventListener("click",testZone);
$("setupDefaultButton").addEventListener("click",showDefaultTerrain);

try { const raw=localStorage.getItem(STORAGE_KEY); if(raw){const payload=JSON.parse(raw);applyConfiguration(payload.zones||payload);setStatus("Saved configuration loaded automatically.","good");}else{applyConfiguration(DEFAULT_RANGES);setStatus(`Starter ${TOTAL_LEDS}-LED mapping loaded. Adjust it to match the physical model, then save and send.`);} }
catch{applyConfiguration(DEFAULT_RANGES);setStatus("Starter mapping loaded because saved browser data could not be read.","error");}
