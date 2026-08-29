"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./FAQ.module.css";

const FAQ_DATA = [
  {
    question: "What hazards does Argus actually catch?",
    answer:
      "Fire and smoke, falls, missing helmets, workers smoking near flammable materials, blocked emergency exits, machinery left running unattended, spills and trip hazards, and people entering restricted zones. Eight in total, watched continuously.",
  },
  {
    question: "Why doesn't it alert the instant something looks wrong?",
    answer:
      "Argus waits for a hazard to show up in two consecutive checks before it alerts anyone — usually a matter of seconds. That short pause is what keeps your team from getting paged over a shadow or someone walking past the camera, so alerts stay something you can trust.",
  },
  {
    question: "Do I need to install cameras or special hardware?",
    answer:
      "No. Argus works with the camera you already have — a laptop, a phone, or an existing site camera. Nothing to wire up or mount.",
  },
  {
    question: "Who gets notified when something happens, and how fast?",
    answer:
      "Your designated safety contact gets a WhatsApp message with the hazard type, a snapshot of the moment it happened, and the time — usually within seconds of confirmation.",
  },
  {
    question: "Is the video footage stored or shared anywhere?",
    answer:
      "Only the specific moment of a confirmed incident is saved, as a single image tied to that alert — not continuous recordings. That image is what your safety team sees when they check the alert.",
  },
  {
    question: "Can other people see our camera feed or incident history?",
    answer:
      "No. Your dashboard link is private, and incidents are only visible to people your team gives access to.",
  },
  {
    question: "What if the internet or camera cuts out?",
    answer:
      "Argus tells you plainly when it can't see or can't reach your camera, rather than showing a frozen picture and pretending everything's fine. You'll know immediately if something needs checking.",
  },
  {
    question: "Does this replace a safety officer?",
    answer:
      "No — think of it as another set of eyes that never blinks. It catches the moment something happens so your safety team can respond faster, not the other way around.",
  },
];

function FAQCard({ question, answer }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (open && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [open]);

  return (
    <div className={styles.faqCard} onClick={() => setOpen((v) => !v)}>
      <div className={styles.faqCardHeader}>
        <p className={styles.faqQuestion}>{question}</p>
        <div
          className={`${styles.faqChevronWrap} ${open ? styles.faqChevronWrapOpen : ""}`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
      <div
        className={`${styles.faqAnswerWrap} ${open ? styles.faqAnswerWrapOpen : ""}`}
        style={{ height: `${height}px` }}
      >
        <div ref={contentRef} className={styles.faqAnswerContent}>
          <p className={styles.faqAnswer}>{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  // Split the data in half for two independent columns
  const midpoint = Math.ceil(FAQ_DATA.length / 2);
  const column1 = FAQ_DATA.slice(0, midpoint);
  const column2 = FAQ_DATA.slice(midpoint);

  return (
    <section className={styles.faqSection} id="faqs">
      <div className={styles.faqInner}>
        <div className={styles.faqHeaderRow}>
          <motion.h2
            className={styles.faqHeadline}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Frequently Asked Questions
          </motion.h2>

          {/* Small expanding button for mobile */}
          <button
            type="button"
            className={styles.mobileExpandBtn}
            onClick={() => setMobileExpanded((v) => !v)}
            aria-expanded={mobileExpanded}
          >
            <span>{mobileExpanded ? "Collapse" : "Expand"}</span>
            <motion.svg
              animate={{ rotate: mobileExpanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </motion.svg>
          </button>
        </div>

        {/* Desktop always renders, Mobile expands/collapses with smooth height transition */}
        <div className={styles.desktopFaqWrap}>
          <div className={styles.faqLayout}>
            <motion.div
              className={styles.faqColumn}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {column1.map((item, i) => (
                <FAQCard key={`col1-${i}`} question={item.question} answer={item.answer} />
              ))}
            </motion.div>
            <motion.div
              className={styles.faqColumn}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {column2.map((item, i) => (
                <FAQCard key={`col2-${i}`} question={item.question} answer={item.answer} />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Mobile Accordion with smooth slow elegant expand/collapse */}
        <div className={styles.mobileFaqWrap}>
          <motion.div
            initial={false}
            animate={{
              height: mobileExpanded ? "auto" : 0,
              opacity: mobileExpanded ? 1 : 0,
            }}
            transition={{
              height: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.45, ease: "easeInOut" },
            }}
            className={styles.mobileFaqMotionWrapper}
          >
            <div className={styles.faqLayout}>
              <div className={styles.faqColumn}>
                {FAQ_DATA.map((item, i) => (
                  <FAQCard key={`mob-${i}`} question={item.question} answer={item.answer} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
