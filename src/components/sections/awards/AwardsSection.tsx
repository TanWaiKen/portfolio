"use client";

import React, { useState } from 'react';
import { Award, AwardCategory } from './types';
import { AwardTile } from './AwardTile';
import { AwardPreviewCard } from './AwardPreviewCard';

const AWARDS_DATA: Award[] = [
    // GOLD/TOP 3
    {
        id: "award-langhub",
        title: "Top 1 / Champion (Category Winner)",
        issuer: "AWS CendiAwan Hackathon",
        year: "2025",
        category: "Achievements & Competitions",
        impact: "Awarded Top 1 in category for LangHub, an AI-powered dialect preservation and cultural immersion platform."
    },
    {
        id: "award-1",
        title: "Gold / Top 3",
        issuer: "International Inter-Varsity Challenge",
        year: "2024",
        category: "Achievements & Competitions",
        impact: "Secured Gold/Top 3 in the International Inter-Varsity Challenge 2024."
    },
    {
        id: "award-2",
        title: "Gold / Top 3",
        issuer: "Nation Hackathon X Hackathon",
        year: "2025",
        category: "Achievements & Competitions",
        impact: "Secured Gold/Top 3 in the Nation Hackathon X Hackathon 2025."
    },
    // SILVER
    {
        id: "award-3",
        title: "Silver",
        issuer: "Nation IUCEL x KNOVSI",
        year: "2024",
        category: "Achievements & Competitions",
        impact: "Won Silver at Nation IUCEL x KNOVSI 2024."
    },
    // TOP 10
    {
        id: "award-4",
        title: "Top 10 Finalist",
        issuer: "Nation AWS Great AI Hackathon",
        year: "2025",
        category: "Achievements & Competitions",
        impact: "Reached the Top 10 in the Nation AWS Great AI Hackathon 2025."
    },
    {
        id: "award-5",
        title: "Top 10 Finalist",
        issuer: "Nation KITAHACK Hackathon",
        year: "2025",
        category: "Achievements & Competitions",
        impact: "Reached the Top 10 in the Nation KITAHACK Hackathon 2025."
    },
    {
        id: "award-6",
        title: "Top 10 Finalist",
        issuer: "APU Hackthletes Solana Hackfest",
        year: "2024",
        category: "Achievements & Competitions",
        impact: "Reached the Top 10 in the APU Hackthletes Solana Hackfest 2024."
    },
    {
        id: "award-7",
        title: "Top 10 Finalist",
        issuer: "APU Joget NextGen Hack",
        year: "2024",
        category: "Achievements & Competitions",
        impact: "Reached the Top 10 in the APU Joget NextGen Hack 2024."
    },
    // EXCELLENCE/PARTICIPATION
    {
        id: "award-8",
        title: "Excellence Award",
        issuer: "Nation KITAHACK Hackathon",
        year: "2026",
        category: "Achievements & Competitions",
        impact: "Awarded Excellence at the Nation KITAHACK Hackathon 2026."
    },
    {
        id: "award-9",
        title: "Excellence Award",
        issuer: "Microsoft Imagine Cup",
        year: "2026",
        category: "Achievements & Competitions",
        impact: "Awarded Excellence at the International Microsoft Imagine Cup 2026."
    },
    {
        id: "award-10",
        title: "Excellence Award",
        issuer: "Nation Huawei Hackathon",
        year: "2025",
        category: "Achievements & Competitions",
        impact: "Awarded Excellence at the Nation Huawei Hackathon 2025."
    },
    {
        id: "award-11",
        title: "Excellence Award",
        issuer: "IBM TechXchange Hackathon",
        year: "2025",
        category: "Achievements & Competitions",
        impact: "Awarded Excellence at the International IBM TechXchange Hackathon 2025."
    },
    // CERTIFICATIONS & TRAINING
    {
        id: "cert-1",
        title: "MD PDTI Tech Club Intensive Workshop",
        issuer: "MDEC",
        year: "2026",
        category: "Certifications & Training",
        impact: "Completed the intensive tech workshop organized by MDEC."
    },
    {
        id: "cert-2",
        title: "5G Pioneers Program",
        issuer: "Ericsson",
        year: "2024",
        category: "Certifications & Training",
        impact: "Successfully completed the Ericsson 5G Pioneers program."
    },
    {
        id: "cert-3",
        title: "5-Day AI Agents Intensive Course",
        issuer: "Google",
        year: "2024",
        category: "Certifications & Training",
        impact: "Completed the 5-Day AI Agents Intensive Course by Google."
    },
    {
        id: "cert-4",
        title: "Generative AI Foundations",
        issuer: "AWS Academy",
        year: "2024",
        category: "Certifications & Training",
        impact: "Graduate of the AWS Academy Generative AI Foundations program."
    },
    {
        id: "cert-5",
        title: "Build 17 Beginner Projects (Python | JS | C#)",
        issuer: "Udemy",
        year: "2023",
        category: "Certifications & Training",
        impact: "Completed comprehensive project-based programming course."
    },
    {
        id: "cert-6",
        title: "NAv7: Introduction to Networks",
        issuer: "Cisco",
        year: "2023",
        category: "Certifications & Training",
        impact: "Completed NAv7 Introduction to Networks certification by Cisco."
    }
];

const CATEGORIES: AwardCategory[] = [
    "Achievements & Competitions",
    "Certifications & Training"
];

export function AwardsSection() {
    const [activeAward, setActiveAward] = useState<Award | null>(null);

    return (
        <div
            className="w-full relative"
            onMouseLeave={() => {
                // Only clear hover implicitly on desktop
                if (window.matchMedia("(hover: hover)").matches) {
                    setActiveAward(null);
                }
            }}
        >
            {CATEGORIES.map(category => {
                const categoryData = AWARDS_DATA.filter(a => a.category === category);
                if (categoryData.length === 0) return null;

                return (
                    <div key={category} className="mb-16 last:mb-0">
                        <h3 className="uppercase text-[11px] md:text-xs tracking-widest text-neutral-500 mb-6 font-medium">
                            {category}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                            {categoryData.map(award => (
                                <AwardTile
                                    key={award.id}
                                    award={award}
                                    isActive={activeAward?.id === award.id}
                                    onHover={(a) => {
                                        if (window.matchMedia("(hover: hover)").matches) {
                                            setActiveAward(a);
                                        }
                                    }}
                                    onClick={(a) => setActiveAward(a)}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}

            <AwardPreviewCard
                award={activeAward}
                onClose={() => setActiveAward(null)}
            />
        </div>
    );
}
