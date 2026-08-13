# FOURSIGHT 3.0 — Priority 14

## Priority 16 — GTM backup

The main page includes a collapsed **Manual Backup** section with S1–S6 buttons. Use it only if GTM or camera recognition fails. GTM remains the primary path. Both GTM predictions and manual selections call the same scenario activation function, which updates the full prediction, hazard, context, priorities and human-decision flow and sends the matching newline-delimited S1–S6 command to Arduino at 9600 baud.

## Final LED architecture

- The Setup Page defines Start/End LEDs for Hill, Wooded Area, Forest, Village, Power, Hospital, River, Bridge, Road, Farm and School.
- **Save Configuration** stores the map in the browser. **Send to Arduino** sends the complete map at 9600 baud and stores it in Arduino EEPROM.
- **Test Zone** lights one selected range. **Default Terrain** sends `D` and restores every zone's normal colour.
- Scenario commands remain newline-delimited `S1` through `S6`.
- S1 animates Power in yellow/amber; S2 renders flood zones bright blue; S3 flickers Forest red/orange; S4 marks contaminated River/Farm/Village red; S5 renders Hill/School landslide brown/red while River/Bridge/Road flood blue; S6 pulses River/Farm/Village orange/amber.
- All unaffected zones remain in their normal terrain colours during every scenario.

## Decision flow

1. Identify a scenario.
2. Review the AI prediction, predicted cascade, and Potential Hazard.
3. Select **Reveal priorities**.
4. Review the three actionable priorities.
5. Review the locked scenario Context Card.
6. Select and lock the human priority.

## Context Card + Human Priority Selection

For every locked scenario S1–S6, the Context Card is deliberately withheld until the decision stage. It appears after the three actionable priorities and immediately before Human Priority Selection, so its extra constraint informs the participant’s choice without appearing before the priority reveal.

The setup page and local LED-range Save/Load remain available. Existing scenario recognition, the Potential Hazard stage, and all six scenario actions are retained.

## Deploy to GitHub Pages

Copy a compatible Teachable Machine export into `model/`, then upload this package’s contents to the repository root and enable GitHub Pages from the root.

## Protocol note

The website serial protocol is frozen: 9600 baud, newline-delimited `S1` through `S6` commands (and `D` for default terrain). The Arduino FastLED controller is included unchanged and is not part of the Priority 14 update.
