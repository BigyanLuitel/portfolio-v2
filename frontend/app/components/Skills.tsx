"use client";

import { motion } from "motion/react";
import {
  SiPython,
  SiFastapi,
  SiDjango,
  SiPostgresql,
  SiRedis,
  SiSqlite,
  SiLangchain,
} from "react-icons/si";
import { IconType } from "react-icons";

interface SkillCategory {
  category: string;
  skills: { name: string; icon?: IconType }[];
}

const SKILLS: SkillCategory[] = [
  {
    category: "AI / LLM",
    skills: [
      { name: "LangChain", icon: SiLangchain },
      { name: "LangGraph" },
      { name: "Groq (LLaMA 3.3 70B)" },
      { name: "OpenAI SDK" },
      { name: "RAG" },
      { name: "Agentic Systems" },
      { name: "Tool Calling" },
      { name: "MCP" },
      { name: "Qdrant" },
      { name: "Redis", icon: SiRedis },
      { name: "Supabase" },
      { name: "SQLAlchemy (async)" },
      { name: "psycopg" },
      { name: "HuggingFace sentence-transformers" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Python", icon: SiPython },
      { name: "FastAPI", icon: SiFastapi },
      { name: "Django", icon: SiDjango },
      { name: "REST APIs" },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "SQLite", icon: SiSqlite },
      { name: "ChromaDB (Vector DB)" },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="max-w-4xl mx-auto px-6 py-24">
      <p className="font-body text-sm text-accent tracking-widest uppercase mb-2">
        Capabilities
      </p>
      <h2 className="font-heading text-3xl md:text-4xl font-medium mb-12">
        Skills
      </h2>

      <div className="flex flex-col gap-10">
        {SKILLS.map((group, groupIndex) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              delay: groupIndex * 0.1,
            }}
          >
            <h3 className="font-heading text-sm text-muted uppercase tracking-wide mb-4">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {group.skills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <span
                    key={skill.name}
                    className="flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-full border border-border hover:border-accent/50 hover:bg-accent/5 transition-colors"
                  >
                    {Icon && <Icon className="text-accent" size={15} />}
                    {skill.name}
                  </span>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
