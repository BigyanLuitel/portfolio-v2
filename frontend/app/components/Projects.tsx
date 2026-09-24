"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Project, getProjectGradient } from "../lib/api";
import Modal from "./Modal";

export default function Projects({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="max-w-5xl mx-auto px-6 py-24">
      <h2 className="font-heading text-3xl md:text-4xl font-medium mb-10">
        Projects
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.button
            key={project.slug}
            onClick={() => setSelected(project)}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-left border border-border rounded-xl overflow-hidden hover:border-accent/50 transition-colors"
          >
            <div
              className={`h-32 bg-gradient-to-br ${getProjectGradient(index)} flex items-center justify-center`}
            >
              <span className="font-heading text-3xl font-medium text-white/90">
                {project.title
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-heading font-medium">{project.title}</h3>
              <p className="font-body text-sm text-muted mt-1 line-clamp-2">
                {project.summary}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <Modal isOpen={selected !== null} onClose={() => setSelected(null)}>
        {selected && (
          <div className="p-6 flex flex-col gap-4">
            <div>
              <h3 className="font-heading text-xl font-medium">
                {selected.title}
              </h3>
              <p className="font-body text-sm text-muted mt-1">
                {selected.summary}
              </p>
            </div>

            <div className="font-body text-sm flex flex-col gap-3">
              <div>
                <span className="text-muted">Problem: </span>
                {selected.problem}
              </div>
              <div>
                <span className="text-muted">Approach: </span>
                {selected.approach}
              </div>
              {selected.results && (
                <div>
                  <span className="text-muted">Results: </span>
                  {selected.results}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {selected.stack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2 py-1 rounded-full border border-border text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>

            {selected.github_url && (
              <a
                href={selected.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline w-fit"
              >
                View on GitHub →
              </a>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}
