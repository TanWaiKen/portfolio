export interface ProjectLink {
  label: string;
  href: string;
  icon?: "github" | "demo" | "presentation" | "external";
}

export interface ProjectItem {
  title: string;
  shortName: string;
  category: "Applications" | "AI & automation";
  summary: string;
  description: string;
  image: string;
  github: string;
  demo: string;
  tags: string[];
  featured?: boolean;
  extraLinks?: ProjectLink[];
}

export const projects: ProjectItem[] = [
  {
    title: "CrediSecure AI - HMack 2025",
    shortName: "CrediSecure AI",
    category: "Applications",
    summary:
      "A zero-trust intelligent vault, built with Flutter and Huawei AI for HMack 2025.",
    description:
      "A zero-trust intelligent vault built with Flutter, powered by Huawei AI and HMS Toolkit. Developed as an innovative application for the Huawei AppGallery.",
    image: "/credisecure.png",
    github: "https://github.com/TanWaiKen",
    demo: "https://youtu.be/CYP-UV9jETk",
    tags: ["Flutter", "Huawei AI", "Zero-Trust Security"],
  },
  {
    title: "KitaHack 2025 - iPocket (Top 10 Finalist)",
    shortName: "iPocket",
    category: "Applications",
    summary:
      "An expense companion for tracking and categorising spending. A KitaHack 2025 Top 10 finalist.",
    description:
      "An innovative expense management application developed for KitaHack 2025, reaching the Top 10 Finalists. Features smart tracking and categorization.",
    image: "/ipocket.png",
    github: "https://github.com/luciuswilbert/expenseApp",
    demo: "https://youtu.be/5iZwj2Hx-QU",
    tags: ["KitaHack", "Finance", "React Native"],
  },
  {
    title: "JusAds - AI Advertising Platform",
    shortName: "JusAds",
    category: "AI & automation",
    featured: true,
    summary:
      "An advertising workflow that connects localised generation, human review, and media processing.",
    description:
      "An AI advertising platform for Southeast Asian markets, connecting multimodal generation, compliance review, remediation, and human-approved distribution. LangGraph agents orchestrate generation and review; FastAPI streams progress to a React frontend.",
    image: "/jus_ads.png",
    github: "https://github.com/TanWaiKen/JusAds",
    demo: "https://youtu.be/_XuWUD7kBkY",
    tags: ["LangGraph", "Gemini", "FastAPI", "React"],
  },
  {
    title: "LangHub - Heritage AI (AWS CendiAwan Hackathon)",
    shortName: "LangHub",
    category: "AI & automation",
    summary:
      "An AI-powered dialect preservation and cultural immersion platform. Won Top 1 in category at the AWS CendiAwan Hackathon.",
    description:
      "An AI-powered dialect preservation and cultural immersion platform developed for the AWS CendiAwan Hackathon, winning Top 1 in the category. LangHub bridges generational and cultural gaps through AI-assisted dialect learning across Hokkien, Cantonese, and Hakka, featuring interactive AI tutors, cultural immersion archives, and speech intelligence.",
    image: "/langhub.png",
    github: "https://github.com/TanWaiKen/Langhub",
    demo: "https://drive.google.com/file/d/13PkCrfu7bkd1K8LXPVXusYumGvJ2MVBq/view?pli=1",
    tags: ["AWS CendiAwan", "Top 1 Winner", "Heritage AI", "Dialect Preservation"],
    extraLinks: [
      {
        label: "Final Demo (Video)",
        href: "https://drive.google.com/file/d/13PkCrfu7bkd1K8LXPVXusYumGvJ2MVBq/view?pli=1",
        icon: "demo",
      },
      {
        label: "Canva Presentation",
        href: "https://canva.link/o2tjqb2pvoq0xo9",
        icon: "presentation",
      },
      {
        label: "Preliminary Demo",
        href: "https://drive.google.com/file/d/1tVYfa-gR6zqAE6qbUZF8ye97zxqYJpHt/view",
        icon: "demo",
      },
      {
        label: "GitHub Repository",
        href: "https://github.com/TanWaiKen/Langhub",
        icon: "github",
      },
    ],
  },
  {
    title: "VestraS - Vector DB Pipeline & AI Study Workspace",
    shortName: "VestraS",
    category: "AI & automation",
    summary:
      "An intelligent study workspace and knowledge retrieval engine powered by an end-to-end vector DB pipeline.",
    description:
      "An intelligent student study workspace and document retrieval engine built around an end-to-end vector database pipeline. Features semantic search across lecture notes, AI-curated study material recommendations, multi-modal document organization, and interactive AI document chat (Vestra Chat).",
    image: "/vertras.png",
    github: "https://github.com/luciuswilbert/VestraS/tree/ken/vector-db-pipeline",
    demo: "https://drive.google.com/file/d/1pAd5Dk9VxZXL-bHsOfuYgL5ZF2LSjkfJ/view?usp=sharing",
    tags: ["Vector DB", "RAG Pipeline", "AI Search", "Study Intelligence"],
    extraLinks: [
      {
        label: "Watch Demo",
        href: "https://drive.google.com/file/d/1pAd5Dk9VxZXL-bHsOfuYgL5ZF2LSjkfJ/view?usp=sharing",
        icon: "demo",
      },
      {
        label: "Presentation (Drive)",
        href: "https://drive.google.com/file/d/1C4PYfSg300lUQMPlYvduxR1dHytLUsMm/view?usp=sharing",
        icon: "presentation",
      },
      {
        label: "Canva Slides",
        href: "https://canva.link/cnmd30m2wm0ocfd",
        icon: "presentation",
      },
      {
        label: "Vector Pipeline (GitHub)",
        href: "https://github.com/luciuswilbert/VestraS/tree/ken/vector-db-pipeline",
        icon: "github",
      },
    ],
  },
  {
    title: "Invoice AI Excel Generator (OCR)",
    shortName: "Invoice → Excel",
    category: "AI & automation",
    summary:
      "An OCR workflow that turns invoice data into structured Excel sheets, reducing repetitive data entry.",
    description:
      "Developed an AI-powered Optical Character Recognition (OCR) system that automatically extracts data from invoices and generates structured Excel sheets.",
    image: "/excel_update.png",
    github: "https://github.com/TanWaiKen",
    demo: "https://www.linkedin.com/posts/tan-wai-ken-92005b266_invoiceaiexcelgenerator-ai-ocr-activity-7354466995775442944-RYdU?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEElxGgBE_4tl7o1BBwf3jOA6W0hXbP3nyY",
    tags: ["OCR", "AI", "Automation"],
  },
  {
    title: "Yumesession AI (Browser Extension & Desktop)",
    shortName: "Yumesession AI",
    category: "AI & automation",
    summary:
      "A dual-layer AI productivity suite seamlessly connecting a browser extension for web capture with a desktop application for local AI workflows.",
    description:
      "A dual-layer AI productivity session workspace connecting a browser extension and desktop application. The Chrome extension captures active web context, browser tabs, and research trails, communicating with the companion desktop application which orchestrates AI workflows, local session analytics, and unified knowledge management.",
    image: "/yumi.jpg",
    github: "https://github.com/DreamerChaserHAH/yumesession-desktop",
    demo: "https://github.com/DreamerChaserHAH/yumesession-browser-extension",
    tags: ["Browser Extension", "Desktop App", "Productivity", "AI Workflows"],
    extraLinks: [
      {
        label: "Desktop App (GitHub)",
        href: "https://github.com/DreamerChaserHAH/yumesession-desktop",
        icon: "github",
      },
      {
        label: "Browser Extension (GitHub)",
        href: "https://github.com/DreamerChaserHAH/yumesession-browser-extension",
        icon: "github",
      },
    ],
  },
  {
    title: "VPet AI Summarization - Hacktheletes AIC",
    shortName: "VPet AI",
    category: "AI & automation",
    summary:
      "A virtual pet interface paired with AI summarisation. A playful way to make a practical tool approachable.",
    description:
      "AI-powered summarization tool integrated with a virtual pet interface. Built for the Hacktheletes AIC competition.",
    image: "/vpet.png",
    github: "https://github.com/TanWaiKen/Vpet-AI-Summarization",
    demo: "https://youtu.be/pKuZcs_UNhM",
    tags: ["AI Summarization", "Virtual Pet", "Hackathon"],
  },
];

export const awards = [
  // GOLD/TOP 3
  {
    id: "award-langhub",
    title: "Top 1 / Champion (Category Winner)",
    issuer: "AWS CendiAwan Hackathon",
    year: "2025",
    category: "Achievements & Competitions",
    impact:
      "Awarded Top 1 in category for LangHub, an AI-powered dialect preservation and cultural immersion platform.",
  },
  {
    id: "award-1",
    title: "Gold / Top 3",
    issuer: "International Inter-Varsity Challenge",
    year: "2024",
    category: "Achievements & Competitions",
    impact:
      "Secured Gold/Top 3 in the International Inter-Varsity Challenge 2024.",
  },
  {
    id: "award-2",
    title: "Gold / Top 3",
    issuer: "Nation Hackathon X Hackathon",
    year: "2025",
    category: "Achievements & Competitions",
    impact: "Secured Gold/Top 3 in the Nation Hackathon X Hackathon 2025.",
  },
  // SILVER
  {
    id: "award-3",
    title: "Silver",
    issuer: "Nation IUCEL x KNOVSI",
    year: "2024",
    category: "Achievements & Competitions",
    impact: "Won Silver at Nation IUCEL x KNOVSI 2024.",
  },
  // TOP 10
  {
    id: "award-4",
    title: "Top 10 Finalist",
    issuer: "Nation AWS Great AI Hackathon",
    year: "2025",
    category: "Achievements & Competitions",
    impact: "Reached the Top 10 in the Nation AWS Great AI Hackathon 2025.",
  },
  {
    id: "award-5",
    title: "Top 10 Finalist",
    issuer: "Nation KITAHACK Hackathon",
    year: "2025",
    category: "Achievements & Competitions",
    impact: "Reached the Top 10 in the Nation KITAHACK Hackathon 2025.",
  },
  {
    id: "award-6",
    title: "Top 10 Finalist",
    issuer: "APU Hackthletes Solana Hackfest",
    year: "2024",
    category: "Achievements & Competitions",
    impact: "Reached the Top 10 in the APU Hackthletes Solana Hackfest 2024.",
  },
  {
    id: "award-7",
    title: "Top 10 Finalist",
    issuer: "APU Joget NextGen Hack",
    year: "2024",
    category: "Achievements & Competitions",
    impact: "Reached the Top 10 in the APU Joget NextGen Hack 2024.",
  },
  // EXCELLENCE/PARTICIPATION
  {
    id: "award-8",
    title: "Excellence Award",
    issuer: "Nation KITAHACK Hackathon",
    year: "2026",
    category: "Achievements & Competitions",
    impact: "Awarded Excellence at the Nation KITAHACK Hackathon 2026.",
  },
  {
    id: "award-9",
    title: "Excellence Award",
    issuer: "Microsoft Imagine Cup",
    year: "2026",
    category: "Achievements & Competitions",
    impact:
      "Awarded Excellence at the International Microsoft Imagine Cup 2026.",
  },
  {
    id: "award-10",
    title: "Excellence Award",
    issuer: "Nation Huawei Hackathon",
    year: "2025",
    category: "Achievements & Competitions",
    impact: "Awarded Excellence at the Nation Huawei Hackathon 2025.",
  },
  {
    id: "award-11",
    title: "Excellence Award",
    issuer: "IBM TechXchange Hackathon",
    year: "2025",
    category: "Achievements & Competitions",
    impact:
      "Awarded Excellence at the International IBM TechXchange Hackathon 2025.",
  },
  // CERTIFICATIONS & TRAINING
  {
    id: "cert-1",
    title: "MD PDTI Tech Club Intensive Workshop",
    issuer: "MDEC",
    year: "2026",
    category: "Certifications & Training",
    impact: "Completed the intensive tech workshop organized by MDEC.",
  },
  {
    id: "cert-2",
    title: "5G Pioneers Program",
    issuer: "Ericsson",
    year: "2024",
    category: "Certifications & Training",
    impact: "Successfully completed the Ericsson 5G Pioneers program.",
  },
  {
    id: "cert-3",
    title: "5-Day AI Agents Intensive Course",
    issuer: "Google",
    year: "2024",
    category: "Certifications & Training",
    impact: "Completed the 5-Day AI Agents Intensive Course by Google.",
  },
  {
    id: "cert-4",
    title: "Generative AI Foundations",
    issuer: "AWS Academy",
    year: "2024",
    category: "Certifications & Training",
    impact: "Graduate of the AWS Academy Generative AI Foundations program.",
  },
  {
    id: "cert-5",
    title: "Build 17 Beginner Projects (Python | JS | C#)",
    issuer: "Udemy",
    year: "2023",
    category: "Certifications & Training",
    impact: "Completed comprehensive project-based programming course.",
  },
  {
    id: "cert-6",
    title: "NAv7: Introduction to Networks",
    issuer: "Cisco",
    year: "2023",
    category: "Certifications & Training",
    impact: "Completed NAv7 Introduction to Networks certification by Cisco.",
  },
];
