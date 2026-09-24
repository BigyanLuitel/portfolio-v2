"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import TypedText from "./TypedText";

export default function Hero() {
  const [typingDone, setTypingDone] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "center start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  return (
    <section
      ref={sectionRef}
      className="h-screen flex flex-col items-center justify-center text-center px-6"
    >
      <motion.div
        style={{ opacity, y, scale }}
        className="flex flex-col items-center"
      >
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
          className="font-body text-base md:text-lg text-muted mt-5 max-w-md"
        >
          Building backend systems and agentic AI, based in Kathmandu, Nepal.
        </motion.p>
      </motion.div>
    </section>
  );
}
