"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
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
      id: "card-1",
      title: "Not every frame is an incident.",
      body: "Argus evaluates consecutive frames before confirming a hazard (1/3 Detected → 2/3 Verified → 3/3 Confirmed). This temporal voting system helps prevent isolated visual anomalies from becoming false alarms.",
      lead: "Argus doesn't treat a single unusual frame as a confirmed hazard. Every potential incident passes through a temporal verification gate before an alert is dispatched.",
      sections: [
        {
          heading: "How confirmation works",
          items: [
            {
              label: "01 / DETECTED",
              desc: "A potential hazard is identified in the current frame.",
            },
            {
              label: "02 / VERIFIED",
              desc: "The same hazard is detected again in the next consecutive frame.",
            },
            {
              label: "03 / CONFIRMED",
              desc: "The temporal voting threshold is satisfied and the incident is officially logged.",
            },
          ],
        },
        {
          heading: "Why this matters",
          paragraphs: [
            "Cameras constantly capture moments that can look dangerous in isolation — a worker crouching, motion blur, shadows, reflections, or a partially obstructed view. Argus evaluates consecutive frames to distinguish these transient anomalies from persistent hazards.",
          ],
          highlight:
            "2 of 3 consecutive frames must support the hazard before confirmation.",
        },
        {
          heading: "Verification state",
          flow: "1 / 3  →  2 / 3  →  CONFIRMED",
          paragraphs: [
            "Only after confirmation does Argus trigger the incident workflow: evidence capture, incident logging, dashboard update, and WhatsApp dispatch.",
          ],
          highlight:
            "Result: fewer isolated visual anomalies turning into unnecessary alarms.",
        },
      ],
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
      id: "card-2",
      title: "When something happens, your team knows.",
      body: "Every confirmed incident includes the hazard, confidence, reasoning, and visual evidence — delivered directly to your team's WhatsApp with an incident snapshot in ~12–25 seconds.",
      lead: "Argus turns a confirmed visual hazard into an actionable notification. Once an incident clears the verification gate, the system packages the evidence and sends it directly to the people responsible for responding.",
      sections: [
        {
          heading: "What the team receives",
          items: [
            {
              label: "HAZARD",
              desc: "What happened — Fall, Fire/Smoke, No Helmet, Restricted Zone, and more.",
            },
            {
              label: "CONFIDENCE",
              desc: "How strongly the model supports the classification.",
            },
            {
              label: "REASONING",
              desc: "A concise basis explaining why the incident was confirmed.",
            },
            {
              label: "VISUAL EVIDENCE",
              desc: "The captured incident frame attached to the alert.",
            },
          ],
        },
        {
          heading: "From camera to phone",
          flow: "Camera Feed  ↓  Vision Analysis  ↓  Temporal Confirmation  ↓  Incident Logged  ↓  WhatsApp + Snapshot",
          paragraphs: [
            "Typical time to alert: ~12–25 seconds, depending on verification cycles and API round-trip latency.",
            "The same confirmed incident simultaneously updates the dashboard, increments the relevant hazard counters, and enters the audit record.",
          ],
          highlight:
            "The goal isn't another dashboard notification. It's getting the right evidence to the right person while the incident is still actionable.",
        },
      ],
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
      id: "card-3",
      title: "No camera replacement required.",
      body: "Argus supports browser cameras for instant testing and inspections, RTSP streams for integration with existing industrial CCTV infrastructure, and edge deployments for production environments.",
      lead: "Argus is designed to sit on top of the camera infrastructure you already have. Start with a browser camera for testing, connect existing RTSP CCTV feeds for industrial deployment, or move processing to an edge environment when production requirements demand it.",
      sections: [
        {
          heading: "Three ways to run Argus",
          items: [
            {
              label: "BROWSER CAMERA",
              desc: "Use a standard browser-accessible camera for instant demonstrations, inspections, and testing.",
              flow: "Camera → Browser → Argus",
            },
            {
              label: "RTSP STREAM",
              desc: "Connect existing industrial CCTV infrastructure without replacing the cameras already installed across the site.",
              flow: "CCTV → RTSP → Argus",
            },
            {
              label: "EDGE DEPLOYMENT",
              desc: "Run Argus closer to the physical camera infrastructure for production environments where local processing and deployment flexibility matter.",
              flow: "Camera → Edge → Argus",
            },
          ],
        },
        {
          heading: "One intelligence layer. Multiple inputs.",
          paragraphs: [
            "The detection pipeline remains consistent regardless of how the video enters the system: frames are sampled, analyzed against structured safety criteria, temporally verified, and dispatched when confirmed.",
          ],
          highlight:
            "Start with one camera. Scale without rebuilding the surveillance layer.",
        },
      ],
    },
  },
];

function CardContent({ card, onExpand }) {
  return (
    <div
      className={styles.whiteCard}
      onClick={onExpand}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onExpand();
        }
      }}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{card.title}</h3>
      </div>

      <div className={styles.cardDivider} />

      <div className={styles.cardBody}>
        <div className={styles.cardInfoLabel}>Info</div>
        <p className={styles.cardParagraph}>{card.body}</p>
      </div>

      <div className={styles.cardBottomRow}>
        <button
          className={styles.arrowButton}
          aria-label="Explore details"
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
        >
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

const backdropVariants = {
  hidden: {
    backgroundColor: "rgba(12, 12, 16, 0)",
    backdropFilter: "blur(0px)",
    WebkitBackdropFilter: "blur(0px)",
  },
  visible: {
    backgroundColor: "rgba(12, 12, 16, 0.48)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    backgroundColor: "rgba(12, 12, 16, 0)",
    backdropFilter: "blur(0px)",
    WebkitBackdropFilter: "blur(0px)",
    transition: {
      duration: 0.68,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardVariants = {
  hidden: {
    scale: 0.04,
    opacity: 0,
    filter: "blur(18px)",
  },
  visible: {
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.95, // Slower, graceful and cinematic
      ease: [0.16, 1, 0.3, 1], // Ultra smooth, silky easing
    },
  },
  exit: {
    scale: 0.04,
    opacity: 0,
    filter: "blur(16px)",
    transition: {
      duration: 0.72, // Subtly faster than intro, still graceful
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function ResponsibleSurveillance() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedCard) {
      if (window.__lenis) {
        window.__lenis.stop();
      }
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          setSelectedCard(null);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        if (window.__lenis) {
          window.__lenis.start();
        }
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [selectedCard]);

  const modalContent = (
    <AnimatePresence>
      {selectedCard && (
        <motion.div
          className={styles.expandedBackdrop}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={() => setSelectedCard(null)}
        >
          <motion.div
            className={styles.expandedCard}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent="true"
          >
            {/* Left Column: Soft Grey Display Stage with White Text Cards */}
            <div
              className={styles.leftDisplayStage}
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
            >
              {selectedCard.sections &&
                selectedCard.sections.map((sec, idx) => (
                  <div key={idx} className={styles.subCard}>
                    <h3 className={styles.subCardTitle}>{sec.heading}</h3>

                    {sec.items && (
                      <div className={styles.subCardItems}>
                        {sec.items.map((item, i) => (
                          <div key={i} className={styles.subCardItem}>
                            <strong className={styles.itemLabel}>
                              {item.label}
                            </strong>
                            <span className={styles.itemDesc}>
                              {item.desc}
                            </span>
                            {item.flow && (
                              <code className={styles.flowBadge}>
                                {item.flow}
                              </code>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {sec.paragraphs &&
                      sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className={styles.subCardText}>
                          {p}
                        </p>
                      ))}

                    {sec.flow && (
                      <code className={styles.flowBadge}>{sec.flow}</code>
                    )}

                    {sec.highlight && (
                      <p className={styles.subCardHighlight}>
                        {sec.highlight}
                      </p>
                    )}
                  </div>
                ))}
            </div>

            {/* Right Column: Top Close Button & Bottom Title/Lead */}
            <div className={styles.rightInfoStage}>
              <div className={styles.topActionRow}>
                <button
                  className={styles.squareCloseBtn}
                  onClick={() => setSelectedCard(null)}
                  aria-label="Close modal"
                >
                  <svg
                    className={styles.closeCrossIcon}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className={styles.rightBottomContent}>
                <h2 className={styles.modalTitle}>{selectedCard.title}</h2>
                <p className={styles.modalDescription}>
                  {selectedCard.lead || selectedCard.body}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

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
                  <CardContent
                    card={row.card}
                    onExpand={() => setSelectedCard(row.card)}
                  />
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
                  <CardContent
                    card={row.card}
                    onExpand={() => setSelectedCard(row.card)}
                  />
                ) : (
                  <p className={styles.editorialText}>{row.subheadContent}</p>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Single 16:9 Rounded Container Modal in Portal for Full Screen Blur */}
      {mounted && typeof document !== "undefined"
        ? createPortal(modalContent, document.body)
        : null}
    </section>
  );
}
