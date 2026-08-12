const STORAGE_KEY = "foursight:led-config:v1";

const ZONES = [
  ["hill", "Hill"],
  ["wooded", "Wooded Area"],
  ["forest", "Forest"],
  ["village", "Village"],
  ["power", "Power"],
  ["hospital", "Hospital"],
  ["river", "River"],
  ["bridge", "Bridge"],
  ["road", "Road"],
  ["farm", "Farm"],
  ["school", "School"]
];

const $ = (id) => document.getElementById(id);
const statusEl = $("saveStatus");

function setStatus(text, tone = "neutral") {
  statusEl.textContent = text;
  statusEl.dataset.tone = tone;
}

function inputsFor(key) {
  return {
    start: $(`${key}Start`),
    end: $(`${key}End`),
    count: $(`${key}Count`),
    error: $(`${key}Error`)
  };
}

function calculateCount(start, end) {
  if (start === "" || end === "") return "—";
  const s = Number(start);
  const e = Number(end);
  if (!Number.isInteger(s) || !Number.isInteger(e) || s < 0 || e > 149 || s > e) return "—";
  return String(e - s + 1);
}

function validateZone(key) {
  const { start, end, error, count } = inputsFor(key);
  const s = start.value.trim();
  const e = end.value.trim();
  error.textContent = "";
  start.removeAttribute("aria-invalid");
  end.removeAttribute("aria-invalid");
  count.textContent = calculateCount(s, e);

  if (s === "" && e === "") return true;
  if (s === "" || e === "") {
    error.textContent = "Enter both Start and End, or leave both blank.";
  } else {
    const startNum = Number(s);
    const endNum = Number(e);
    if (!Number.isInteger(startNum) || !Number.isInteger(endNum)) {
      error.textContent = "LED numbers must be whole numbers.";
    } else if (startNum < 0 || startNum > 149 || endNum < 0 || endNum > 149) {
      error.textContent = "LED numbers must be between 0 and 149.";
    } else if (startNum > endNum) {
      error.textContent = "Start LED cannot be greater than End LED.";
    }
  }

  if (error.textContent) {
    start.setAttribute("aria-invalid", "true");
    end.setAttribute("aria-invalid", "true");
    return false;
  }
  return true;
}

function readConfiguration() {
  const config = {};
  for (const [key] of ZONES) {
    const { start, end } = inputsFor(key);
    config[key] = { start: start.value.trim(), end: end.value.trim() };
  }
  return config;
}

function applyConfiguration(config) {
  for (const [key] of ZONES) {
    const { start, end } = inputsFor(key);
    const value = config?.[key] || {};
    start.value = value.start ?? "";
    end.value = value.end ?? "";
    validateZone(key);
  }
}

function validateAll() {
  return ZONES.every(([key]) => validateZone(key));
}

function saveConfiguration() {
  if (!validateAll()) {
    setStatus("Fix the highlighted LED ranges before saving.", "error");
    return;
  }

  try {
    const payload = {
      version: 1,
      savedAt: new Date().toISOString(),
      zones: readConfiguration()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setStatus("Configuration saved on this device.", "good");
  } catch (error) {
    setStatus(`Could not save configuration: ${error.message}`, "error");
  }
}

function loadConfiguration() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setStatus("No saved configuration found on this device.", "error");
      return;
    }
    const payload = JSON.parse(raw);
    applyConfiguration(payload.zones || payload);
    setStatus("Saved configuration loaded.", "good");
  } catch (error) {
    setStatus(`Could not load configuration: ${error.message}`, "error");
  }
}

function clearConfiguration() {
  for (const [key] of ZONES) {
    const { start, end } = inputsFor(key);
    start.value = "";
    end.value = "";
    validateZone(key);
  }
  setStatus("Fields cleared. The saved configuration is unchanged.", "neutral");
}

for (const [key] of ZONES) {
  const { start, end } = inputsFor(key);
  start.addEventListener("input", () => validateZone(key));
  end.addEventListener("input", () => validateZone(key));
}

$("saveButton").addEventListener("click", saveConfiguration);
$("loadButton").addEventListener("click", loadConfiguration);
$("clearButton").addEventListener("click", clearConfiguration);

// Load the saved values automatically when the Setup Page opens.
try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const payload = JSON.parse(raw);
    applyConfiguration(payload.zones || payload);
    setStatus("Saved configuration loaded automatically.", "good");
  }
} catch {
  setStatus("A saved configuration could not be read.", "error");
}
