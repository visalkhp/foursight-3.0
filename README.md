# FOURSIGHT 3.0

FOURSIGHT 3.0 is a static PWA for six-class Teachable Machine scenario recognition. It shows the identified scenario prominently, gives a decision context card, reveals three recommended response priorities, and can signal an Arduino Uno through Web Serial.

## Deploy to GitHub Pages

1. Copy your Teachable Machine TensorFlow.js export to `model/` as described in `model/README.md`.
2. Upload this repository’s contents to a GitHub repository.
3. Enable **Settings → Pages → Deploy from a branch**, selecting the repository root.
4. Open the HTTPS GitHub Pages URL in Chrome or Edge on desktop, and allow camera access.

Relative paths are used throughout, so this works on `https://account.github.io/repository/` without changes.

## Use the app

1. Press **Start camera**.
2. Place a scenario in the square, non-mirrored camera view and select **Identify scenario**.
3. Review the prominently displayed AI prediction and the scenario’s context card.
4. Select **Reveal priorities** to display the three recommended actions.
5. Optionally connect an Arduino Uno. Each identified scenario sends `1\n` through `6\n` at 115200 baud.

## Arduino Uno + FastLED

Open `arduino/FOURSIGHT_UNO_FastLED.ino` in Arduino IDE and install the **FastLED** library. It expects an 8-pixel WS2812B-compatible strip/ring with data on D6. Change `NUM_LEDS` or `LED_PIN` if your hardware differs.

Use an external 5 V supply for multi-LED strips, connect its ground to Arduino GND, put a 330–470 ohm resistor in the data line, and add a 1000 uF capacitor across the LED supply. Do not power a multi-LED strip from the Uno 5 V pin.

## Offline behavior

After the first visit, the service worker caches the PWA shell and same-origin model assets. The first visit needs internet access for TensorFlow.js and Teachable Machine CDN scripts.

## LED Setup

Open `setup.html` to enter the Start and End LED numbers for the 11 locked physical zones. The Setup Page validates LED numbers from 0–149, calculates the LED count, allows overlapping ranges, and saves/loads the mapping in browser `localStorage`.

## Priority 9 / Context Cards

The six Scenario Context Cards shown in the main interface now use the locked physical card text:

1. Strong winds are expected to intensify. Essential services may lose electricity if power lines fail. Emergency teams have 2 hours to prepare.
2. Heavy rainfall has forced authorities to release water from the dam upstream.
3. A group of 40 children from the school are camping in the forest.
4. The water treatment plant has stopped functioning 6 months ago. Many villagers report illness.
5. Roads leading to the hospital are likely to become impassable during the approaching storm.
6. The village reservoir has only one day's water remaining. Farmers are reporting severe crop losses.

Web Serial sends `S1` through `S6` over USB at 9600 baud to match the current FOURSIGHT Arduino controller.
