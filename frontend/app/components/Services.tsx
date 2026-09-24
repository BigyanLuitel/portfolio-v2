"use client";

import { motion } from "motion/react";
import { IconType } from "react-icons";
import { FiCpu, FiServer, FiDatabase, FiMessageSquare } from "react-icons/fi";

interface Service {
  icon: IconType;
  title: string;
  description: string;
}

const SERVICES: Service[] = [
  {
    icon: FiMessageSquare,
    title: "Agentic AI Systems",
    description:
      "Tool-calling agents that reason, decide, and act — not just single-shot chat. Built with LangGraph and structured, testable decision logic.",
  },
  {
    icon: FiDatabase,
    title: "RAG Pipelines",
    description:
      "Retrieval-augmented systems for querying documents, databases, or domain-specific data — built from scratch or with LangChain, depending on what the problem needs.",
  },
  {
    icon: FiServer,
    title: "Backend APIs",
    description:
      "FastAPI and Django backends designed around real data models, authentication, and clean separation between what's stored and what's exposed.",
  },
  {
    icon: FiCpu,
    title: "Full-Stack Systems",
    description:
      "End-to-end platforms — from database design through a working frontend — for real use cases like school management or e-commerce.",
  },
];

export default function Services() {
  return (
    <section id="services" className="max-w-4xl mx-auto px-6 py-24">
      <p className="font-body text-sm text-accent tracking-widest uppercase mb-2">
        What I Do
      </p>
      <h2 className="font-heading text-3xl md:text-4xl font-medium mb-12">
        Services
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {SERVICES.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.08,
              }}
              className="border border-border rounded-xl p-6 hover:border-accent/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Icon className="text-accent" size={20} />
              </div>
              <h3 className="font-heading text-lg font-medium mb-2">
                {service.title}
              </h3>
              <p className="font-body text-sm text-muted leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
