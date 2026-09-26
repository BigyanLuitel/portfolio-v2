"use client";

import { motion } from "motion/react";
import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="max-w-4xl mx-auto px-6 py-24">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 md:gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mx-auto md:mx-0 w-48 md:w-full"
        >
          <div className="absolute -inset-4 bg-gradient-to-br from-accent/50 to-accent/10 rounded-2xl blur-2xl" />
          <div className="absolute -inset-2 border border-accent/40 rounded-2xl -rotate-2" />
          <div className="relative w-48 h-48 md:w-full md:h-auto md:aspect-square rounded-2xl overflow-hidden border border-border">
            <Image
              src="/profile.jpg"
              alt="Bigyan Luitel"
              fill
              className="object-cover"
              priority={false}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <p className="font-body text-sm text-accent tracking-widest uppercase mb-2">
            About Me
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-medium mb-4">
            Hi, I&apos;m Bigyan Luitel
          </h2>
          <p className="font-body text-base md:text-lg text-muted leading-relaxed mb-6">
            I’m a BSc. CSIT student in Kathmandu, Nepal, building my path toward
            becoming an AI Engineer. I enjoy working at the intersection of
            backend development and applied AI — building RAG systems, agentic
            tool-calling workflows, and AI-powered applications that solve
            practical problems. I’m particularly interested in the engineering
            behind AI systems: how they retrieve information, use tools,
            interact with APIs, and work reliably beyond a simple notebook or
            demo.
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              "📍 Kathmandu, Nepal",
              "🎓 BSc.CSIT, 2027",
              "💼 Open to work",
            ].map((badge) => (
              <span
                key={badge}
                className="text-sm px-3 py-1.5 rounded-full border border-border text-muted"
              >
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
