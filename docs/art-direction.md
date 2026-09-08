# Picture-book art direction

The user's 2026-09-08 steering supersedes the earlier anime mascot concept: smaller, simpler eyes; picture-book proportions; visible thick paint; and painted elements throughout the portfolio. Picasso was referenced as an influence for simplified, slightly asymmetric shapes. The work is an AI-generated interpretation, not an artwork attributed to Picasso.

## Assets

- `public/art/guide.webp`: final painted character, 480px wide. Generated with the built-in image generation tool, then encoded as WebP. Dark navy/teal hair, forest-green sweater and skirt, boots, and cream notebook preserve the character reference.
- `public/art/landscape.webp`: final impasto landscape, 1536px wide. Generated with the built-in tool, then encoded as WebP. Used in the hero, featured-artwork stage, and playground.
- `public/art/*-original.png`: original generated source images, preserved without retouching.
- Existing project screenshots, résumé and owner photograph were retained from the repository. No independent claim about their ownership or the accuracy of portfolio credentials is added.

The final character is on a white ground. CSS multiply blending integrates it into the paper backgrounds. The earlier anime versions and the checkerboard-background output are unused.

## Final character prompt

Reinterpret this girl completely as a sophisticated contemporary children's picture-book character painted in thick gouache and impasto oils. NOT anime, NOT manga, NOT chibi, NO enormous sparkling eyes. Her face has tiny simple dark almond/dot eyes, a sculptural angular little nose, a small understated mouth, subtly asymmetric features inspired by Picasso's playful figurative simplification. Charming warm editorial hand-painted storybook illustration. Keep her recognisable long dark navy hair with muted teal ends, forest-green sweater over ivory collared shirt and dark tie, green pleated skirt, black boots, and a cream notebook. Natural stylized proportions: head about 1/5 total height, not big-headed anime. Full body standing, one hand raised in a quiet wave and other holding notebook. Build shapes with tactile thick loaded paintbrush strokes and palette-knife texture, visible pigment ridges, imperfect edges, matte dusty pigments, forest green and sage with small warm peach accents. Full character centered in a portrait composition with clear padding, isolated on flat uniform pure white #FFFFFF background. No checkerboard, no shadow on ground, no text, no logos, no scenery. Output a production website character illustration.

Reference: the prior generated character, itself based on the character shown in the user-provided screenshot. No social-media interface, third-party logo, or other person from that screenshot is included in the website art.

## Final landscape prompt

A wide horizontal abstract landscape painting to be used as the atmospheric background for an elegant personal engineering portfolio. Contemporary picture book gouache and thick impasto oil paint on warm ivory paper, visible palette-knife marks, chunky layered brush strokes, charming irregular painted edges. A sparse poetic arrangement of softly rolling hills along the LOWER HALF, broad warm peach and buttery cream stroke on the left, dusty sage and dark forest green slopes on the right, tiny muted lavender accents only. Very top half mostly quiet warm off-white paper with subtle grain and lots of negative space for dark webpage headline overlay. Flat abstract organic forms, no realism, a little Picasso-inspired geometry, tasteful editorial art gallery sensibility. No people, no buildings, no text, no letters, no UI, no mockup, no frame, no logos. Matte quiet colors, lively physical brushwork, not an airbrushed digital gradient. Landscape aspect ratio approximately 3:2 or wider.

## Design and test references

Consulted during this redesign:

- [Playwright video recording](https://playwright.dev/docs/videos): save recordings after browser-context closure; explicit viewport and recording dimensions.
- [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): verify text/background pairs; image-ground text also needs visual inspection.
- [Awwwards portfolio index](https://www.awwwards.com/websites/portfolio/): public index consulted for general context. No template or code copied from it.

The existing README retains attribution for legacy React Bits and joeee-website components. Those components are no longer mounted on the redesigned page.

## Portfolio hierarchy revision · 2026-09-08

The user rejected the slogan-led composition. The current page leads with Ken’s name, role and actual portrait, then biography/education and experience before projects. Painted textures and the mascot remain supporting elements. JusAds is presented with its name and engineering workflow. Its public README was read through the GitHub connector: https://github.com/TanWaiKen/JusAds/blob/main/README.md. README capability descriptions are not independently measured outcomes or evidence of individual contribution scope.

The moving background reuses the existing landscape asset without re-encoding or image editing. Canvas draws original procedural brush impressions with palette tokens. The user requested this interactive impasto treatment on 2026-09-08.
