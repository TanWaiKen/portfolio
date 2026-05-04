"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const projects = [
    {
        title: "CrediSecure AI - HMack 2025",
        description: "A zero-trust intelligent vault built with Flutter, powered by Huawei AI and HMS Toolkit. Developed as an innovative application for the Huawei AppGallery.",
        image: "/credisecure.png",
        github: "https://github.com/TanWaiKen",
        demo: "https://youtu.be/CYP-UV9jETk",
        tags: ["Flutter", "Huawei AI", "Zero-Trust Security"],
    },
    {
        title: "KitaHack 2025 - iPocket (Top 10 Finalist)",
        description: "An innovative expense management application developed for KitaHack 2025, reaching the Top 10 Finalists. Features smart tracking and categorization.",
        image: "/ipocket.png",
        github: "https://github.com/luciuswilbert/expenseApp",
        demo: "https://youtu.be/5iZwj2Hx-QU",
        tags: ["KitaHack", "Finance", "React Native"],
    },
    {
        title: "JusAds - Just Marketing AI Platform",
        description: "An AI-powered advertising generation platform with hyper-localized ad generation, human-in-the-loop workflows, and Celery-based media pipelines.",
        image: "/jus_ads.png",
        github: "https://github.com/TanWaiKen",
        demo: "https://youtu.be/_XuWUD7kBkY",
        tags: ["AI", "Video Generation", "FastAPI", "React"],
    },
    {
        title: "Invoice AI Excel Generator (OCR)",
        description: "Developed an AI-powered Optical Character Recognition (OCR) system that automatically extracts data from invoices and generates structured Excel sheets.",
        image: "/excel_update.png",
        github: "https://github.com/TanWaiKen",
        demo: "https://www.linkedin.com/posts/tan-wai-ken-92005b266_invoiceaiexcelgenerator-ai-ocr-activity-7354466995775442944-RYdU?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEElxGgBE_4tl7o1BBwf3jOA6W0hXbP3nyY",
        tags: ["OCR", "AI", "Automation"],
    },
    {
        title: "Yumesession AI (Browser Extension & Desktop)",
        description: "A comprehensive AI productivity session manager with a browser extension and desktop app, built to optimize workflows and assist users.",
        image: "/yumi.jpg",
        github: "https://github.com/DreamerChaserHAH/yumesession-desktop",
        demo: "https://github.com/DreamerChaserHAH/yumesession-browser-extension",
        tags: ["Browser Extension", "Desktop App", "Productivity"],
    },
    {
        title: "VPet AI Summarization - Hacktheletes AIC",
        description: "AI-powered summarization tool integrated with a virtual pet interface. Built for the Hacktheletes AIC competition.",
        image: "/vpet.png",
        github: "https://github.com/TanWaiKen/Vpet-AI-Summarization",
        demo: "https://youtu.be/pKuZcs_UNhM",
        tags: ["AI Summarization", "Virtual Pet", "Hackathon"],
    },
];

export function PortfolioSection() {
    return (
        <section id="portfolio" className="relative py-24 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <p className="text-white/60 text-sm uppercase tracking-widest mb-2">My Recent Projects</p>
                    <h2 className="text-4xl md:text-5xl font-bold gradient-text">Portfolio</h2>
                </div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.title}
                            className="card-glow bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-primary/20 group"
                        >
                            {/* Project Image */}
                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-purple-500/20">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    unoptimized
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                            </div>

                            {/* Project Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                                <p className="text-white/60 text-sm mb-4">{project.description}</p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Links */}
                                <div className="flex gap-3">
                                    <a
                                        href={project.github}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-primary/20 hover:text-primary transition-all text-sm"
                                    >
                                        <FaGithub className="w-4 h-4" />
                                        GitHub
                                    </a>
                                    <a
                                        href={project.demo}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/80 transition-all text-sm"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Live Demo
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
