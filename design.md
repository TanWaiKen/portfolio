# Portfolio Design Specification

Status: implemented redesign, with browser verification recorded in `artifacts/visual-qa/`. The current direction below supersedes conflicting visual choices in the original baseline retained afterward. The source of truth for implemented values is `src/app/portfolio.css`.

## Current direction — picture-book portfolio (2026-09-08)

The user requested an entire-site redesign, a character throughout the portfolio, a composition distinct from the referenced lanyard hero, and real Playwright visual/interaction testing with a full-page video. The painted art direction is a hand-painted picture-book character with small, simplified eyes and thick impasto brushwork, extending that painting language into the background.

### Adopted design decisions

- Retain Next.js, React, and the existing project content. The new page is server-rendered and enhanced by a focused client component; it no longer waits for a mount flag before showing content.
- Use a warm paper palette: paper `#FAF8F1`, ink `#26382E`, forest `#31483B`, sage `#E6E9DC`, peach `#F0D9C6`, and restrained lavender `#E4DEEB` within the artwork. This replaces the white/black/pastel-gradient baseline below.
- Use Georgia for expressive editorial headings and Arial/Helvetica for practical reading. Both are system stacks, so content needs no remote font request. The serif addition is a deliberate revision for the user's picture-book direction.
- Use a real generated impasto landscape in the hero, a cropped painted field behind the featured project, and a faint painted field in the playground. Reading surfaces remain quiet. Shared body type is 16px, with 14–15px supporting text and smaller metadata.
- Replace the borrowed lanyard-led composition, animated aurora, star field, global splash cursor, typing loop, and floating navigation dock on the active page. Retain the legacy component files and their attribution without mounting them.
- Lead with Ken’s name, engineering role, portrait, and résumé/contact paths. Follow the original introduction-first hierarchy: About (including original education, CGPA and languages), Experience & leadership, Selected projects, Achievements & certifications, Playground, Contact. The user rejected the slogan-led gallery composition as insufficiently personal; the painting and mascot support this portfolio structure.
- Present JusAds by its project name, problem, workflow, architecture, demo and actual repository link. Its README was read on 2026-09-08 at https://github.com/TanWaiKen/JusAds/blob/main/README.md. LangGraph, FastAPI, React and Gemini are documented there; no claim of sole authorship, measured business impact, or independently tested compliance accuracy is added.
- Preserve existing claims and external destinations. Generic GitHub profile links are labelled as profiles, video destinations as demos, and the extension repository as a browser extension. These are user-provided portfolio claims, not independently verified outcomes.

### Mascot behavior and boundaries

| Placement | Trigger | Behavior |
| --- | --- | --- |
| Hero action | Hover or keyboard focus | The small character peeks from behind Explore my work; the illustration cannot intercept the link |
| Project notebook | Explicit project click/tap | A native modal shows the real description, technologies, prepared guide note, and external links |
| Playground | Say hello / a question | A brief single rocking reaction and a prepared response; no API, chat subscription, or invented assistant capabilities |
| Floating guide | Explicit click/tap | Shortcuts to Work, About, Contact, and the real résumé PDF |
| Guide dismissal | Hide guide | Hidden for the browser session; Open the little guide in the playground restores it |

The earlier interactive character source could not be located in the repository. This is a newly implemented lightweight guide, not a claim to have connected an unseen character runtime. The final character retains the reference's dark/teal hair, green clothes, notebook, and boots, with smaller eyes and thick brushwork instead of anime features.

The character uses a generated white-ground illustration, blended into the paper with CSS. It is not claimed to be an alpha-transparent sprite or a rigged animation. Clicking Say hello plays one CSS transform reaction; no continuous idle loop runs. Asset prompts and provenance are in `docs/art-direction.md`.

### Interaction and responsive acceptance

- Project filters show 6 total projects, 4 AI/automation projects, or 2 applications.
- All six project modals support keyboard focus cycling, Escape, backdrop/close-button dismissal, scroll containment, and focus restoration to the opener.
- Experience and additional recognition rows are native disclosures. All 11 competition records and 6 certification records remain accessible.
- The header becomes a labelled mobile navigation menu. The small floating guide remains dismissible and occupies less room on mobile.
- Buttons have raised, hover, pressed, and focus states. Only the featured artwork has bounded mouse tilt; it resets on exit, focus loss, and page visibility changes.
- Decorative entrances play once. Content is visible without animation initialization; reduced-motion users see static content. No-JavaScript visitors receive direct links to every project.
- Email uses an explicit `mailto:` destination and a copy action with success/failure feedback. The prior third-party contact form is replaced with a direct email handoff, avoiding an unconfigured submission service. No message is sent automatically.
- Verification must include Chromium desktop, touch mobile, tablet, 320px width, reduced motion, no JavaScript, screenshot review, and recorded desktop/mobile walkthroughs. Typechecking alone is insufficient.

### Verification and scope

Run `npm run typecheck`, `npm run build`, and `npm run test:visual` against the production server. `scripts/visual-qa.cjs` supports `QA_URL`, `CODEX_NODE_MODULES`, and `PLAYWRIGHT_CHROMIUM_EXECUTABLE` for an existing Playwright installation. Generated screenshots, walkthroughs, contrast pairs, and the interaction report are saved under `artifacts/visual-qa/`.

The browser checks establish Chromium/emulated-device behavior, not full assistive-technology conformance or physical-device performance. External project services and inbox delivery are outside the local frontend checks. Deployment has not been requested.

---

The original baseline below remains as design history. The current direction above takes precedence where colors, typography, page composition, first-release scope, or mascot behavior differ.

## 1. Purpose and direction

Create a professional personal portfolio for Tan Wai Ken with generous white space, strong black typography, a soft peach-to-lavender atmosphere, and tactile raised controls. Featured project cards should feel like framed artworks with substantial depth.

The JusAds hero screenshot supplied in the conversation is a reference for restraint, spacing, pastel atmosphere, and the raised white login button. Develop an original composition, content hierarchy, artwork, and identity. The generated Aurora, Sunset, and Emerald images were explorations; none was selected as the final layout.

Design priorities, in order:

1. Make the owner's identity, work, and contact path clear.
2. Keep reading, navigation, and interaction comfortable.
3. Establish a consistent visual identity through typography, spacing, color, and depth.
4. Use selective motion to reinforce the identity.

## 2. Visual foundations

### Color

Use neutral surfaces and dark text. Reserve expressive gradients for the lower hero background and selected artwork. Buttons remain neutral so their function stays clear.

| Token | Starting value | Use |
| --- | --- | --- |
| `--color-page` | `#FFFFFF` | Main page background |
| `--color-surface` | `#FFFFFF` | Buttons and cards |
| `--color-surface-muted` | `#F7F7F9` | Quiet supporting surfaces |
| `--color-ink` | `#171717` | Headings, body text, primary buttons |
| `--color-ink-muted` | `#595961` | Supporting copy |
| `--color-border` | `#DEDEE5` | Neutral component borders |
| `--color-peach` | `#FFD6C7` | Ambient gradient |
| `--color-lavender` | `#E6D9F7` | Ambient gradient |
| `--color-focus` | `#5B42D6` | Keyboard focus indicator |

Blend peach on the lower-left and lavender on the lower-right of the hero, fading smoothly into white above. Use broad soft transitions. Keep text on a stable, readable background; verify contrast against the actual gradient at every breakpoint.

Do not introduce unrelated accent colors per section. Status colors may communicate errors or success, accompanied by text or an icon.

### Typography

Use one clean sans-serif family with a system fallback as the initial direction. Use normal or medium body weights and a strong heading weight. A second display family requires a deliberate design revision rather than isolated use in one section.

| Role | Desktop starting range | Mobile starting range |
| --- | --- | --- |
| Hero heading | 56–72px | 36–44px |
| Section heading | 32–44px | 28–32px |
| Body | 16–18px | 16–18px |
| Navigation and buttons | 14–16px | 14–16px |
| Captions | 12–14px | 12–14px |

Use fluid sizing between breakpoints. Start with heading line-height of 1.05–1.15 and body line-height of 1.5–1.65. Keep paragraphs roughly 60–70 characters wide. Avoid long centered paragraphs, excessive uppercase, and low-contrast decorative text.

### Spacing and shape

Use a shared spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, and 128px.

- Content width: begin around 1200px, centered.
- Horizontal page padding: 20–24px on mobile and 32–48px on desktop.
- Section spacing: 64–80px on mobile and 96–128px on desktop.
- Button corner radius: 8px.
- Standard card corner radius: 16px.
- Featured artwork frame radius: 24px.
- Reuse these radii; do not invent a different radius for every component.

## 3. Depth and lighting

Use a consistent light source from the top-left. Cast shadows downward and slightly right. The shadow strength communicates elevation and importance.

| Level | Use | Starting shadow |
| --- | --- | --- |
| Flat | Text links, page sections | None |
| Control | Raised buttons | `2px 3px 0 rgba(23,23,23,0.72)` |
| Card | Standard interactive cards | `0 8px 24px rgba(30,25,45,0.10)` |
| Artwork | Featured project frame | `12px 28px 64px -12px rgba(45,30,65,0.28), 2px 6px 12px rgba(23,23,23,0.10)` |

These values require visual tuning. Preserve a short, relatively crisp button shadow and a broad, soft artwork shadow. They serve different scales but share the same lighting logic.

Keep sufficient space around artwork shadows. Avoid clipping shadows at section boundaries or allowing them to muddy neighboring content. Do not give every card the featured artwork elevation.

## 4. Buttons and links

The white login button in the reference establishes the tactile control treatment. Adapt its appearance to portfolio actions; do not add authentication unless an actual account feature requires it.

### Variants

- Primary: near-black surface, white text, short raised shadow. Use for the most important action in a section.
- Secondary: white surface, near-black text, fine neutral border, same shadow direction. Suitable for View résumé or a supporting action.
- Text link: no raised container; show a consistent underline or other clear link treatment.

Prefer specific labels such as View projects, View résumé, and Contact me. Use links for destinations and downloads, and buttons for actions. Identify external destinations or file types when useful.

### Shared states

| State | Required treatment |
| --- | --- |
| Default | Clear label, stable dimensions, assigned variant |
| Hover | Lift approximately 2px; extend the shadow slightly |
| Pressed | Move toward the resting plane; contract the shadow |
| Keyboard focus | Visible 2px focus ring with approximately 3px offset |
| Disabled | Distinct unavailable appearance; no lift or press response |
| Loading | Preserve width; communicate progress accessibly; prevent duplicate submission where needed |

Use 44px as the minimum design target for primary interactive control height. Small icons need a generous hit area. Keep the clickable region stable during visual movement so hover does not flicker.

## 5. Page composition

Initial information architecture:

1. Header: personal wordmark or name, Work, About, and Contact navigation.
2. Hero: name or role, concise statement of value, one primary action, and an optional secondary action.
3. Featured work: one prominent artwork-like project presentation with a readable title and explicit project link.
4. Additional projects: consistent cards showing purpose, contribution, and outcome where supported by evidence.
5. About and capabilities: concise information backed by experience or actual work.
6. Contact and footer: direct, usable contact paths.

Use the reference's first-section atmosphere as inspiration. The remaining sections should be designed around portfolio content rather than copied from the reference landing page. Do not fabricate credentials, project outcomes, testimonials, or client logos.

## 6. Motion system

Motion should communicate entrance, elevation, action, and state change. Use a small shared vocabulary.

| Token | Starting duration | Use |
| --- | --- | --- |
| `--motion-fast` | `150ms` | Button and link feedback |
| `--motion-medium` | `250ms` | Card transitions |
| `--motion-slow` | `500ms` | Section entrances |
| `--ease-standard` | `cubic-bezier(0.22, 1, 0.36, 1)` | Shared smooth deceleration |

### Allowed initial effects

- Buttons: approximately 2px lift and a short press response.
- Cards: approximately 4px lift; only the featured artwork may additionally use subtle pointer tilt, capped initially at 2 degrees per axis.
- Section entrances: opacity plus 12–20px upward movement, playing once per page visit when entering view.
- Small related groups: optional 50–70ms stagger, with a short overall sequence that does not delay access to content.

Keep the hero text and key actions immediately available. Content must remain visible if JavaScript or an animation library fails. Reset pointer tilt on exit, focus changes where applicable, and when the window loses focus.

### Avoid in the baseline

- Bouncing typography, repeated text scrambling, and continuously moving body copy.
- Large magnetic button movement or controls that chase the cursor.
- Scroll hijacking, forced scroll speed, and animations that block navigation.
- Replaying entrance effects whenever a visitor scrolls back.
- Combining tilt, glow, zoom, blur, and cursor changes on every card.

The first release should use raised buttons, subtle section reveals, and one interactive artwork card. Keep the ambient gradient static initially.

## 7. Cursor behavior

Preserve the native cursor throughout ordinary navigation and reading. A custom cursor treatment is optional and confined to clickable project artwork.

| Context | Behavior |
| --- | --- |
| Ordinary page space | Native arrow |
| Links and clickable buttons | Native pointer |
| Selectable text and inputs | Native text cursor where appropriate |
| Clickable featured artwork | Optional circular View project indicator |
| Truly draggable content | Grab, changing to grabbing while dragging |

### Custom indicator rules

- Use one circular design, approximately 64–80px wide, with the site's typography and a high-contrast neutral surface.
- Treat the indicator as supplementary: retain an explicit, visible project title or link.
- Prefer an indicator accompanying the native pointer in the first implementation.
- Never hide the native cursor globally. If replacement is introduced later, restrict it to the artwork and ensure restoration on exit or failure.
- Keep any cursor decoration non-interactive with `pointer-events: none` and hidden from assistive technology.
- Track actual pointer position promptly; avoid a long trailing effect that makes the interaction feel delayed.
- Do not cover navigation, text fields, button labels, or essential project information.
- Show Drag only when dragging actually works. Never imply actions that are unavailable.
- Remove the indicator when the pointer leaves the artwork or the browser window, when the document becomes hidden, or when pointer capability changes.

Enable pointer-dependent effects only when appropriate, initially using `(hover: hover) and (pointer: fine)`, with event handling that excludes touch pointers on hybrid devices. Never rely on viewport width alone to infer mouse capability.

## 8. Accessibility and responsive behavior

- All content, project links, and navigation must work without hover or a custom cursor.
- Keyboard navigation needs a logical focus order, visible focus, and no traps.
- Touch layouts keep action labels visible and remove cursor tracking and pointer tilt.
- Respect `prefers-reduced-motion: reduce`: disable decorative tilt, parallax, positional entrance movement, and cursor following. Present content immediately; retain clear non-motion state feedback.
- Aim for WCAG AA text contrast: at least 4.5:1 for normal text and 3:1 for qualifying large text. Check meaningful control boundaries and focus indicators as well.
- Do not convey meaning through color, motion, or cursor shape alone.
- Preserve readable content and usable navigation at browser zoom and narrow widths.
- Stack hero content and artwork naturally on mobile. Reduce shadow extent as needed without changing the overall visual identity.
- Avoid hover-triggered information panels in the first version. If added later, they must also work with focus and touch and be dismissible as appropriate.

## 9. Implementation consistency and performance

Store color, spacing, type, radii, shadow, and motion values as shared CSS custom properties or mapped theme tokens. Build reusable Button, TextLink, ProjectCard, Section, and optional ProjectCursor components.

Use one approach for shared transitions. Check existing project dependencies before adding another animation library. Prefer CSS for simple hover and press states; use JavaScript only for interactions that need it.

- Prefer transform and opacity for motion; avoid repeated layout measurements during pointer movement.
- Read artwork bounds on entry and relevant layout changes, then update visual movement at most once per animation frame.
- Avoid framework state updates on every raw pointer event when direct visual updates suffice.
- Profile large shadow transitions; keep expensive artwork shadows static or use a separate faded shadow layer if necessary.
- Clean up event listeners and animation frames when components unmount.
- Reserve image dimensions to avoid layout shifts; optimize artwork for its actual display size.
- Pause decorative work when it is offscreen or the page is hidden.

## 10. Review and acceptance

Maintain a small component preview page showing button variants and their default, hover, pressed, focused, disabled, and loading states, plus standard and featured cards.

Before accepting the implementation, verify:

- [ ] Typography, spacing, radii, colors, and shadow direction use shared tokens.
- [ ] The hero has a clear identity and action, with restrained peach/lavender atmosphere.
- [ ] White and black buttons share the same tactile behavior.
- [ ] Featured artwork has generous surrounding space and a visible, unclipped shadow.
- [ ] Every interactive effect corresponds to a real action.
- [ ] Project links remain obvious without the custom indicator.
- [ ] Mouse, keyboard, touch, and reduced-motion paths are usable.
- [ ] Content is visible without animation initialization.
- [ ] Small-screen layouts and browser zoom do not obscure content or controls.
- [ ] Pointer exit and page visibility changes leave no stuck cursor or tilted card.
- [ ] Motion remains responsive on a representative mobile device and desktop browser.
- [ ] Project claims, artwork, and attribution have been reviewed before publication.

## 11. Attribution and source context

An original visual redesign does not remove license requirements for retained code or assets. Preserve applicable copyright and permission notices and review the provenance of reused artwork before publishing.

Reference guidance:

- Cursor semantics: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/cursor
- Pointer capability: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/pointer
- Reduced motion: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- Animation from interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- Contrast: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

Update this document when a shared design decision changes. Apply that change across all affected components before introducing exceptions.

## Painted motion and LinkedIn content · 2026-09-08

The user liked the earlier rich landscape and requested mouse-responsive impasto below the hero. Keep the personal hero hierarchy; restore the original slogan as a small bridge into the page. Below the hero, a clipped fixed painted field slowly drifts. Pointer presses and mouse drags leave short-lived bristled pigment impressions; touch gets a tap impression without intercepting normal scrolling. Canvas is decorative and never receives pointer events. Actual content and controls remain above the painting.

The effect uses the existing landscape plus procedural Canvas 2D marks, not a physical fluid simulation. It has no new package dependency. Pause freezes ambient movement and suppresses marks; reduced-motion changes disable both. Hidden pages and offscreen background stop animation work. Canvas resolution is capped at 1.5 device pixel ratio and 28 concurrent marks; marks clear after 2.6 seconds.

LinkedIn source read in the browser: https://www.linkedin.com/in/tan-wai-ken-92005b266/. The user's own JusAds post at https://www.linkedin.com/feed/update/urn:li:activity:7493363353176924160/ supplies the team hackathon origin, subsequent final-year project, and feedback from retail, technical trades and marketing. These are attributed first-person project history, not independently verified outcomes. The profile headline and existing portfolio differ in role/education wording, so no new dates, degree title or current role were inferred from the headline. Add a direct LinkedIn link in About and the source post beside JusAds.

Verification: `scripts/paint-motion-qa.cjs` tests actual canvas pixels, drift, hero exclusion, fading, pause/resume, dynamic reduced motion, link behavior, and touch response. Evidence is in `artifacts/visual-qa/paint-motion-report.json` and `paint-interaction.webm` alongside the full portfolio suite and walkthroughs.

## Surface and brush refinement · 2026-09-08

Removed opaque backgrounds from section headings, contact heading/copy/social links, timeline and recognition lists. Retained complete card surfaces for biography, education, toolbox and projects. Contact uses a broad feathered paper wash rather than separate rectangular strips. Supporting copy uses forest ink for readability over the light painted field.

Brush impressions now use filled, uneven palette-knife shapes with subtle broken highlights and relief. A gesture keeps one pigment; each new gesture cycles the palette. Drag segments follow pointer direction, overlap, and stay in place while fading instead of floating and randomly rotating. Text and controls do not start strokes. Reduced motion, pause, touch scrolling and the bounded mark lifetime remain.

## Hanging portrait and About photo · 2026-09-08

User explicitly requested restoring a hanging lanyard hero photo and adding their own photograph beside About. The initial CSS badge has been replaced, following the user’s supplied recording and explicit direction to use `public/card.glb`. The hero loads that actual model, the local `lanyard.png` strap, and `ken_talk.JPG` photo. Rapier rope/spherical joints connect the metal clip and badge; bounded pointer dragging releases into a physical swing. A keyboard-accessible button applies a small impulse. Reduced motion disables the idle sway; rendering/physics pause outside the viewport and on hidden tabs. The user subsequently requested removing the static fallback image. Loading, failure and context-loss states now use text and a retry control; automatic context restoration keeps the same Canvas mounted. The WebGL component is dynamically loaded with the existing installed dependencies. Touch capture is confined to the card canvas.

About pairs a framed existing photo with the biography; education and language levels are in two compact panels underneath. The reference informs grouping, but the portfolio retains Ken’s own facts without copying another person's degree, rank, scores, or arbitrary language percentages.


## Lanyard rendering lifecycle correction · 2026-09-08

Async Physics/GLTF/environment resources now suspend inside the Canvas. This prevents development-mode resource loading from suspending and tearing down the Canvas itself, which was reproduced as Context Lost in both Playwright and the actual preview. The strap uses the rendered clip transform, bounded exponential smoothing and non-writing transparent depth; a small fixed swing velocity avoids impulse accumulation and canvas clipping. No image fallback remains. Details and current regression evidence are in docs/lanyard-rendering-fix.md.


The moving strap now uses solid, opaque 3D ribbon geometry instead of screen-space MeshLine, with synchronized interpolated joint positions. See the follow-up in docs/lanyard-rendering-fix.md for the revised drag and ribbon-pixel tests.


The hero action is now “Flip the card”: each activation rotates the local card assembly by 180 degrees and holds the other face. It is disabled during a flip or drag. Reduced-motion users get an immediate face change. The physics body remains stable and the solid strap follows the visible clip.
