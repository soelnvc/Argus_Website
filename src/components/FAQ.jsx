"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./FAQ.module.css";

const FAQ_DATA = [
  {
    question: "How does Argus integrate with existing camera systems?",
    answer:
      "Argus works with your existing surveillance infrastructure — no camera replacement required. It supports browser cameras for instant testing, RTSP streams for integration with industrial CCTV, and edge deployment for production environments. Setup typically takes under 30 minutes.",
  },
  {
    question: "What happens when a hazard is detected?",
    answer:
      "When Argus confirms a hazard through its temporal voting system, it delivers an alert directly to your team's WhatsApp. Each alert includes the hazard type, confidence level, reasoning, and a visual snapshot. Typical time from detection to alert is 12–25 seconds.",
  },
];

function FAQCard({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.faqCard} onClick={() => setOpen((v) => !v)}>
      <div className={styles.faqCardHeader}>
        <p className={styles.faqQuestion}>{question}</p>
        <span
          className={`${styles.faqChevron} ${open ? styles.faqChevronOpen : ""}`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
      <div
        className={`${styles.faqAnswerWrap} ${open ? styles.faqAnswerWrapOpen : ""}`}
      >
        <p className={styles.faqAnswer}>{answer}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className={styles.faqSection}>
      <div className={styles.faqInner}>
        <motion.h2
          className={styles.faqHeadline}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.div
          className={styles.faqGrid}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {FAQ_DATA.map((item, i) => (
            <FAQCard key={i} question={item.question} answer={item.answer} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
