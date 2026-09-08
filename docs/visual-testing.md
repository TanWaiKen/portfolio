# Running the visual checks

1. Install the project's locked dependencies with `npm ci`.
2. Run `npm run typecheck` and `npm run build`.
3. Start the production server with `npm run start -- --hostname 127.0.0.1 --port 3000`.
4. Run `npm run test:visual` with Playwright available. The script accepts `CODEX_NODE_MODULES` for a preinstalled module directory, `PLAYWRIGHT_CHROMIUM_EXECUTABLE` for an existing Chromium executable, and `QA_URL` for a different local address. Otherwise it resolves the local `playwright` package and its default browser.

The script records real browser interaction, captures desktop/mobile/tablet screenshots, and writes `artifacts/visual-qa/interaction-report.json`. It verifies filters; every project modal; keyboard cycling and restored focus; button states and bounded artwork tilt; experience and recognition disclosures; mascot responses and animation settling; guide navigation, dismissal, and restoration; clipboard behavior; résumé availability; small-screen overflow; reduced-motion behavior; and server-rendered fallbacks without JavaScript.

After the checks, `node scripts/record-walkthrough.cjs` creates clean `desktop-walkthrough.webm` and `mobile-walkthrough.webm` presentations with full-page scrolling and interactions. These run in separate contexts without full-page screenshot calls, preventing screenshot-related viewport resizing from entering the recording. `node scripts/encode-walkthroughs.cjs` uses FFmpeg to export MP4s and video contact sheets for inspection. Screenshots are reviewed visually, including the full-page composition, mobile dialogue sizing, character blending, legibility, and image clipping. `contrast-pairs.json` contains actual rendered opaque foreground/background combinations for the contrast audit; it deliberately avoids treating two decorative background colors as a text pair.

Browser automation uses Chromium with emulated viewport/touch conditions. It does not replace physical-device performance testing or a screen-reader audit. Tests do not send email, submit a contact form, or operate external project demos.

## Painted background checks

Run `node scripts/paint-motion-qa.cjs` with the same Playwright environment variables. This checks actual canvas pixels, ambient texture drift, hero exclusion, fading, pause/resume, live reduced-motion changes, normal links, and touch impressions. The recording is `artifacts/visual-qa/paint-interaction.mp4` (original WebM retained). Full-page screenshots cannot represent a fixed moving background across every scroll position; use the viewport screenshots and recordings for that layer.
