This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

The current design uses a Georgia display stack and an Arial/Helvetica reading stack, with no remote font request. The page implementation is in `src/components/portfolio/Portfolio.tsx`, its content in `content.ts`, and shared visual tokens/styles in `src/app/portfolio.css`.

## Picture-book redesign

The active site leads with Ken’s identity and portrait, followed by background, experience, projects, achievements, the character playground, and contact. It uses a painted landscape, a small impasto character guide, filterable project notes, accessible experience disclosures, and direct email contact. The hero dynamically loads the local `public/card.glb` with the existing Three.js/Rapier lanyard component and `ken_talk.JPG`. The original aurora and other unused UI primitives remain in source with their credits. The 3D card supports pointer dragging, a keyboard swing button, reduced idle motion, and explicit loading/retry states and WebGL context recovery.

See [the current design decisions](design.md), [art prompts and provenance](docs/art-direction.md), and [the Playwright visual test workflow](docs/visual-testing.md). Run `npm run typecheck`, `npm run build`, and `npm run test:visual` for the relevant checks.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 💐 Credits

Several of the animated UI primitives, including the aurora background, lanyard card, text-pressure effect, logo loop and scroll animations were adapted from **[wthislifehuh/joeee-website-archived](https://github.com/wthislifehuh/joeee-website-archived)** and **[React Bits](https://reactbits.dev/)** (MIT licensed). Huge thanks to those projects; they saved a lot of time and taught plenty.

## 📄 License

[MIT](https://github.com/wthislifehuh/joeee-website-archived/blob/main/LICENSE) © 2026


# Original design analysis (historical, superseded by design.md)
Color Palette:

Deep navy background (#0f0f23 / #1a1a3e)
Pink/magenta accent (#e879f9 / #d946ef)
Card backgrounds with subtle blue tints
White text with subtle opacity variations
Typography:

Poppins font family (distinctive and modern)
Bold display headings
Clean body text
Sections to Build:

Hero - Space background with animated character, typing effect, floating nav dock
About Me - Personal intro with education/skills cards
Experience - Technical skills grid + work experience timeline
Leadership - Cards for leadership roles
Portfolio - Project showcase with images
Guide/Newsletter - Email signup section
Contact - Contact form
Footer - Wave design with navigation links
Special Features:

Floating dock navigation
Star particles background
Typing text animation
Card hover effects
Wavy section dividers
