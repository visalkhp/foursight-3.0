export const CONFIG=Object.freeze({MODEL_PATH:"./model/",SERIAL_BAUD:9600,EVENT:"foursight:prediction",SCENARIOS:Object.freeze([
  Object.freeze({
    modelLabel:"Scenario 1",
    title:"Powerline failure warning",
    summary:"Strong winds may bring down trees onto nearby power lines, potentially cutting electricity to essential services.",
    context:"Strong winds are expected to intensify. Essential services may lose electricity if power lines fail. Emergency teams have 2 hours to prepare.",
    priorities:Object.freeze([
      "Protect critical power-dependent services.",
      "Prepare emergency teams before conditions worsen.",
      "Keep clear of trees, power lines, and other electrical hazards."
    ])
  }),
  Object.freeze({
    modelLabel:"Scenario 2",
    title:"Flood warning",
    summary:"Heavy rain may cause the river to overflow, flooding surrounding terrain and cutting road access.",
    context:"Heavy rainfall has forced authorities to release water from the dam upstream.",
    priorities:Object.freeze([
      "Move people and essential resources away from areas likely to flood.",
      "Protect access routes and critical infrastructure.",
      "Monitor rising water and follow emergency instructions."
    ])
  }),
  Object.freeze({
    modelLabel:"Scenario 3",
    title:"Forest fire warning",
    summary:"Scorching heat and storm conditions create a risk of rapid forest-fire spread toward the village.",
    context:"A group of 40 children from the school are camping in the forest.",
    priorities:Object.freeze([
      "Locate and protect the children in the forest.",
      "Prepare evacuation routes away from the fire path.",
      "Warn people in the village and restrict access to the forest."
    ])
  }),
  Object.freeze({
    modelLabel:"Scenario 4",
    title:"Water contamination warning",
    summary:"Moderate rain may carry contaminated runoff into the river, affecting farms and village water use.",
    context:"The water treatment plant has stopped functioning 6 months ago. Many villagers report illness.",
    priorities:Object.freeze([
      "Protect people from potentially contaminated water.",
      "Secure a safe alternative water supply.",
      "Prevent contaminated water from being used for drinking or food preparation."
    ])
  }),
  Object.freeze({
    modelLabel:"Scenario 5",
    title:"Landslide + flood warning",
    summary:"Cold storm conditions with heavy rain may trigger a landslide while the river simultaneously overflows and isolates the hospital.",
    context:"Roads leading to the hospital are likely to become impassable during the approaching storm.",
    priorities:Object.freeze([
      "Keep hospital access available for as long as safely possible.",
      "Prepare for simultaneous landslide and flood impacts.",
      "Move people away from unstable slopes and flood-prone routes."
    ])
  }),
  Object.freeze({
    modelLabel:"Scenario 6",
    title:"Drought warning",
    summary:"Scorching heat with no wind and no rain may reduce river levels, stress farmland, and threaten the village water supply.",
    context:"The village reservoir has only one day's water remaining. Farmers are reporting severe crop losses.",
    priorities:Object.freeze([
      "Protect the remaining drinking-water supply.",
      "Prioritize essential water use for the village.",
      "Prepare farmers and the community for prolonged water shortage."
    ])
  })
])});
