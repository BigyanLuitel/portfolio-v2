"use client";

import { useState } from "react";
import { motion } from "motion/react";

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="max-w-2xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="font-body text-sm text-accent tracking-widest uppercase mb-2">
          Get In Touch
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-medium mb-4">
          Contact
        </h2>
        <p className="font-body text-muted mb-8">
          Have a project in mind, or just want to connect? Send a message below.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="font-body bg-transparent border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="font-body bg-transparent border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
          />
          <textarea
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            className="font-body bg-transparent border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors resize-none"
          />

          <button
            type="submit"
            disabled={status === "submitting"}
            className="font-body bg-accent text-accent-foreground rounded-lg px-6 py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed w-fit"
          >
            {status === "submitting" ? "Sending..." : "Send Message"}
          </button>

          {status === "success" && (
            <p className="text-sm text-green-500">
              Message sent — thanks for reaching out!
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-500">
              Something went wrong. Please try again, or email directly.
            </p>
          )}
        </form>
      </motion.div>
    </section>
  );
}
