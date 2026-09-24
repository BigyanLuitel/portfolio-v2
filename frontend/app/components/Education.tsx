"use client";

import { motion } from "motion/react";

interface EducationEntry {
  institution: string;
  degree: string;
  period: string;
  description?: string;
}

const EDUCATION: EducationEntry[] = [
  {
    institution: "Orchid International College",
    degree: "BSc.CS (Computer Science)",
    period: "2023 — 2027 (expected)",
    description: "Currently in 6th semester, Kathmandu, Nepal.",
  },
  {
    institution: "Trinity International College",
    degree: "Higher Secondary (+2)",
    period: "2020 — 2022",
    description: "Kathmandu, Nepal.",
  },
  {
    institution: "Tamor Valley Secondary Boarding School",
    degree: "Secondary Education Examination (SEE)",
    period: "Passed out 2019",
    description: "Dhankuta, Nepal.",
  },
];

export default function Education() {
  return (
    <section id="education" className="max-w-3xl mx-auto px-6 py-32">
      <p className="font-body text-sm text-accent tracking-widest uppercase mb-2">
        Background
      </p>
      <h2 className="font-heading text-3xl md:text-4xl font-medium mb-16">
        Education
      </h2>

      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

        <div className="flex flex-col gap-14">
          {EDUCATION.map((entry, index) => (
            <motion.div
              key={entry.institution}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.1,
              }}
              className="relative pl-8"
            >
              <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-accent border-4 border-background" />

              <p className="font-body text-sm text-muted">{entry.period}</p>
              <h3 className="font-heading text-lg font-medium mt-1">
                {entry.institution}
              </h3>
              <p className="font-body text-accent text-sm mt-0.5">
                {entry.degree}
              </p>
              {entry.description && (
                <p className="font-body text-sm text-muted mt-2">
                  {entry.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
