最新 Lanyard 修复与专项回归说明见 [lanyard-rendering-fix.md](lanyard-rendering-fix.md)。下面保留的是此前整页测试记录。

# Redesign verification

The final production frontend passed 26 portfolio checks and 9 painted-motion checks, plus 3 targeted GLB checks in 148.0.7778.96.

- PASS: Personal identity leads, background precedes projects, and JusAds links to its repository
- PASS: Local GLB loads; 3D card drag/release and keyboard swing work; About photo and panels preserved
- PASS: Raised button hover, press and mascot peek
- PASS: Visible keyboard focus ring
- PASS: All / applications / AI filters show the correct projects
- PASS: Featured artwork responds to pointer and resets on exit and window blur
- PASS: All six project dialogs, destinations, Escape, focus trap and focus restoration
- PASS: Below-fold section reveal reaches visible state
- PASS: Experience details expand and collapse
- PASS: All 11 competition records and 6 certifications remain accessible
- PASS: Character reaction plays once, settles, and prepared responses update
- PASS: Guide navigation, Escape, session dismissal and restoration
- PASS: Copy email works and announces success
- PASS: Contact destination and real résumé PDF
- PASS: Clipboard rejection gives a usable manual fallback
- PASS: Footer back-to-top is unobstructed and clears section navigation state
- PASS: desktop: layout, headings, image loading and accessible names
- PASS: Mobile navigation opens, navigates, and closes
- PASS: Touch project filters and modal close
- PASS: Touch mascot prompts and guide shortcuts
- PASS: mobile: layout, headings, image loading and accessible names
- PASS: tablet: layout, headings, image loading and accessible names
- PASS: narrow-320: layout, headings, image loading and accessible names
- PASS: Reduced motion disables mascot movement and reveals all content
- PASS: Server-rendered content and all project destinations remain available without JavaScript
- PASS: No browser runtime or console errors
- PASS: Hero presses do not paint
- PASS: Paint texture drifts below the hero
- PASS: Press and drag draw real pigment pixels without selecting text
- PASS: Brush marks settle and clear
- PASS: Pause freezes ambient paint and suppresses presses
- PASS: Resume restores paint
- PASS: Live reduced-motion changes disable all paint motion
- PASS: Links remain usable without brush reactions
- PASS: Touch tap leaves an impression without a pointer-blocking overlay
- PASS: Reduced motion is visually still; keyboard activation moves the rendered GLB
- PASS: Emulated touch drag and cancellation release the card
- PASS: Failed model request preserves a real static portrait and page content

Visual review: desktop/mobile/tablet page composition, project dialogues, paint texture and mascot blending, reading sizes, and guide/footer spacing.

Evidence: `artifacts/visual-qa/interaction-report.json`, `render-review.json`, `contrast-report.json`, and `frontend-delivery.json`.

Recordings: `desktop-walkthrough.mp4` and `mobile-walkthrough.mp4`, with original WebM captures preserved.

Limitations: Chromium and emulated devices; no physical-device/screen-reader audit, no outgoing email, and no operation of external project demos. No deployment was performed.
