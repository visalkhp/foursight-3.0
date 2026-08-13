# FOURSIGHT 3.0 — Priority 13

FOURSIGHT 3.0 is a static PWA for six-class Teachable Machine scenario recognition and disaster-decision support.

## Use the app

1. Press **Start camera**, then select **Identify scenario**.
2. Review the AI prediction, predicted cascade, locked context card, and the scenario-specific Potential Hazard.
3. Select **Reveal priorities** to show exactly three concrete actions for the identified scenario.
4. Optionally select and lock the action you would prioritize first.
5. Optionally connect an Arduino Uno. Each identified scenario sends `S1` through `S6`, newline-delimited, at 9600 baud.

## Priority 13 — Potential Hazard + Actionable Priorities

Each locked scenario S1–S6 now has a cascade-derived Potential Hazard and three scenario-specific actionable priorities. The hazard is visible before the **Reveal priorities** button; the actions and the existing Human Priority Selection are shown only after it is selected.

The locked Context Cards, setup page, local save/load of LED-zone mappings, and existing scenario-recognition flow are retained.

## Deploy to GitHub Pages

1. Copy a compatible Teachable Machine TensorFlow.js export into `model/` as described in `model/README.md`.
2. Upload the contents of this package to the repository root.
3. Enable GitHub Pages from the repository root and open the HTTPS URL in Chrome or Edge on desktop.

Relative paths are used throughout, so deployment works from a project subpath.

## Protocol note

The website serial protocol is frozen: 9600 baud, newline-delimited `S1` through `S6` commands (and `D` for default terrain). The Arduino FastLED controller is included unchanged and is not part of the Priority 13 update.
