"use client";

import ScrollStack, { ScrollStackItem } from '@/components/ui/ScrollStack';
import Image from 'next/image';
import { WorkExperienceTimeline } from './experience/WorkExperienceTimeline';
const aiFrameworks = [
  "Hugging Face", "n8n", "AI Agents", "MCP", 
  "Skills", "DeAI", "RAG", "LangChain"
];

const mlAnalytics = [
  "MATLAB", "TextBlob", "Scikit-Learn", "PyTorch", 
  "Pandas", "Roboflow", "XAI"
];

const frameworkSkills = [
  ["React", "Vue.js"],
  ["Node.js", "REST APIs"],
  ["Flutter"],
  ["Firebase", "MongoDB"],
  ["PostgreSQL", "MySQL"],
];

const languages = [
  ["Python", "JavaScript / TS"],
  ["Java", "C++"],
  ["SQL", "Dart / HTML / CSS"],
];

const devOps = [
  ["AWS", "Azure"],
  ["GCP", "Git / CI/CD"],
  ["Docker", "Nginx / Apache"],
];

const workExperience = [
  {
    company: "U Mobile",
    role: "Business System Operation - Intern",
    period: "Jul 2025 - Nov 2025",
    icon: "/umobile_logo.png",
    color: "from-white to-neutral-200",
    highlights: [
      "Assisted in business system operations, monitoring, and maintenance.",
      "Collaborated with cross-functional teams to improve operational efficiency and system reliability.",
    ],
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="relative py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Technical Skills Section */}
        <div className="relative mb-[50vh] z-10">
          {/* Section Header */}
          <div className="sticky top-[15vh] md:top-[20vh] z-20 text-center mb-12 pointer-events-none">
            <p className="text-white/60 text-sm uppercase tracking-widest mb-2 drop-shadow-md">What I have learnt</p>
            <h2 className="text-4xl md:text-5xl font-bold gradient-text drop-shadow-lg">Technical Skills</h2>
          </div>

          {/* Technical Skills */}
          <ScrollStack className="w-full relative" itemDistance={20} stackPosition="35%" scaleEndPosition="35%" pinEndPosition="8vh" useWindowScroll={true}>
            {/* AI Frameworks & Tools */}
            <ScrollStackItem>
              <div className="card-glow bg-card rounded-2xl p-6 border border-primary/30">
                <h3 className="text-xl font-semibold text-white text-center mb-6">AI Frameworks & Tools</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {aiFrameworks.map((skill) => (
                    <p key={skill} className="skill-badge text-white/80">{skill}</p>
                  ))}
                </div>
              </div>
            </ScrollStackItem>

            {/* ML & Analytics Tools */}
            <ScrollStackItem>
              <div className="card-glow bg-card rounded-2xl p-6 border border-primary/30">
                <h3 className="text-xl font-semibold text-white text-center mb-6">ML & Analytics Tools</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {mlAnalytics.map((skill) => (
                    <p key={skill} className="skill-badge text-white/80">{skill}</p>
                  ))}
                </div>
              </div>
            </ScrollStackItem>

            {/* Web & Database */}
            <ScrollStackItem>
              <div className="card-glow bg-card rounded-2xl p-6 border border-primary/30">
                <h3 className="text-xl font-semibold text-white text-center mb-6">Frameworks & Databases</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {frameworkSkills.flat().map((skill) => (
                    <p key={skill} className="skill-badge text-white/80">{skill}</p>
                  ))}
                </div>
              </div>
            </ScrollStackItem>

            {/* Programming Languages */}
            <ScrollStackItem>
              <div className="card-glow bg-card rounded-2xl p-6 border border-primary/30">
                <h3 className="text-xl font-semibold text-white text-center mb-6">Programming Languages</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {languages.flat().map((skill) => (
                    <p key={skill} className="skill-badge text-white/80">{skill}</p>
                  ))}
                </div>
              </div>
            </ScrollStackItem>

            {/* DevOps & System */}
            <ScrollStackItem>
              <div className="card-glow bg-card rounded-2xl p-6 border border-primary/30">
                <h3 className="text-xl font-semibold text-white text-center mb-6">Cloud & DevOps</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {devOps.flat().map((skill) => (
                    <p key={skill} className="skill-badge text-white/80">{skill}</p>
                  ))}
                </div>
              </div>
            </ScrollStackItem>
          </ScrollStack>
        </div>

        {/* Work Experience Section */}
        <div className="relative mb-[10vh] z-10">
          <div className="text-center mb-12 pointer-events-none">
            <p className="text-white/60 text-sm uppercase tracking-widest mb-2 drop-shadow-md">My professional development</p>
            <h2 className="text-4xl md:text-5xl font-bold gradient-text drop-shadow-lg">Work Experience</h2>
          </div>

          <WorkExperienceTimeline experiences={workExperience} />
        </div>
      </div>
    </section>
  );
}
