"use client";
import React from "react";
import { motion } from "framer-motion";
import styles from "./ResponsibleSurveillance.module.css";

const ROWS = [
  {
    id: "row-1",
    subheadPosition: "left", // subhead on left, card on right
    subheadContent: (
      <>
        <strong>30-day automatic retention.</strong> Incident data and captured
        frames are automatically purged from active storage.
      </>
    ),
    card: {
      category: "06 — VERIFIED BEFORE YOU'RE ALERTED",
      title: "Not every frame is an incident.",
      body: "Argus evaluates consecutive frames before confirming a hazard (1/3 Detected → 2/3 Verified → 3/3 Confirmed). This temporal voting system helps prevent isolated visual anomalies from becoming false alarms.",
    },
  },
  {
    id: "row-2",
    subheadPosition: "right", // card on left, subhead on right
    subheadContent: (
      <>
        <strong>Token-addressed access.</strong> Controlled, zero-trust
        verification to inspect and review stored incident evidence.
      </>
    ),
    card: {
      category: "07 — FROM DETECTION TO DISPATCH",
      title: "When something happens, your team knows.",
      body: "Every confirmed incident includes the hazard, confidence, reasoning, and visual evidence — delivered directly to your team's WhatsApp with an incident snapshot in ~12–25 seconds.",
    },
  },
  {
    id: "row-3",
    subheadPosition: "left", // subhead on left, card on right
    subheadContent: (
      <>
        <strong>Edge-ready deployment.</strong> Designed specifically for
        mission-critical environments where data handling matters.
      </>
    ),
    card: {
      category: "08 — WORKS WITH WHAT YOU ALREADY HAVE",
      title: "No camera replacement required.",
      body: "Argus supports browser cameras for instant testing and inspections, RTSP streams for integration with existing industrial CCTV infrastructure, and edge deployments for production environments.",
    },
  },
];

function CardContent({ card }) {
  return (
    <div className={styles.whiteCard}>
      <div className={styles.cardHeader}>
        <span className={styles.cardCategory}>{card.category}</span>
        <h3 className={styles.cardTitle}>{card.title}</h3>
      </div>

      <div className={styles.cardDivider} />

      <div className={styles.cardBody}>
        <div className={styles.cardInfoLabel}>Info</div>
        <p className={styles.cardParagraph}>{card.body}</p>
      </div>

      <div className={styles.cardBottomRow}>
        <button className={styles.arrowButton} aria-label="Explore details">
          {/* Subtle circular orbit path ring */}
          <svg className={styles.orbitRing} viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>

          {/* Primary Arrow */}
          <svg
            className={`${styles.arrowIcon} ${styles.arrowPrimary}`}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>

          {/* Secondary Arrow: Re-enters smoothly from the opposite side */}
          <svg
            className={`${styles.arrowIcon} ${styles.arrowSecondary}`}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function ResponsibleSurveillance() {
  return (
    <section className={styles.surveillanceSection} id="privacy">
      {/* Header Container */}
      <div className={styles.headerContainer}>
        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={styles.mainHeadline}
        >
          Safety shouldn&apos;t come{" "}
          <span className={styles.mutedText}>at the cost of privacy.</span>
        </motion.h2>
      </div>

      {/* Rows Container: Staggered Subheads Parallel to Clean White Cards */}
      <div className={styles.rowsContainer}>
        {ROWS.map((row) => {
          const isSubheadLeft = row.subheadPosition === "left";

          return (
            <div key={row.id} className={styles.featureRow}>
              {/* Left Column */}
              <motion.div
                className={
                  isSubheadLeft
                    ? `${styles.subheadCol} ${styles.subheadColLeft}`
                    : `${styles.cardCol} ${styles.cardColLeft}`
                }
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              >
                {isSubheadLeft ? (
                  <p className={styles.editorialText}>{row.subheadContent}</p>
                ) : (
                  <CardContent card={row.card} />
                )}
              </motion.div>

              {/* Right Column */}
              <motion.div
                className={
                  isSubheadLeft
                    ? `${styles.cardCol} ${styles.cardColRight}`
                    : `${styles.subheadCol} ${styles.subheadColRight}`
                }
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.75,
                  delay: 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {isSubheadLeft ? (
                  <CardContent card={row.card} />
                ) : (
                  <p className={styles.editorialText}>{row.subheadContent}</p>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
