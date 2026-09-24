"use client";

import { motion } from "motion/react";
import { useState } from "react";
import TypedText from "./TypedText";

export default function Hero() {
  const [typingDone, setTypingDone] = useState(false);

  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center px-6">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="font-heading text-5xl md:text-7xl font-medium"
      >
        Bigyan Luitel
      </motion.h1>

      <p className="font-heading text-2xl md:text-3xl text-accent mt-3 min-h-[2.5rem]">
        <TypedText
          text="AI Engineer"
          startDelay={400}
          onComplete={() => setTypingDone(true)}
        />
      </p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={typingDone ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="font-body text-base md:text-lg opacity-70 mt-5 max-w-md"
      >
        Building backend systems and agentic AI, based in Kathmandu, Nepal.
      </motion.p>
    </section>
  );
}
