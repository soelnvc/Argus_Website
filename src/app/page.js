import Nav from "@/components/Nav";
import LiquidMetalButton from "@/components/LiquidMetalButton";
import WaveGlow from "@/components/WaveGlow";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.heroContainer}>
        {/* Dynamic undulating wave shader with integrated text masking & film grain */}
        <WaveGlow text="ARGUS" />
        
        {/* Ambient atmospheric edge glow */}
        <div className={styles.ambientEdgeGlow} aria-hidden="true" />

        {/* Header Bar */}
        <header className={styles.header}>
          <a href="#" className={styles.logo} aria-label="Argus Home">
            {/* Argus Eye / Watchman Geometric Vector */}
            <svg
              className={styles.logoIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
              <path d="M2 12c3.5-6 16.5-6 20 0-3.5 6-16.5 6-20 0z" />
            </svg>
            <span className={styles.logoText}>argus</span>
          </a>

          {/* Centered Floating Dock Navbar */}
          <div className={styles.navSlot}>
            <Nav />
          </div>

          {/* Action CTA Button */}
          <div className={styles.ctaSlot}>
            <div style={{ transform: "scale(0.82)", transformOrigin: "right center" }}>
              <LiquidMetalButton label="Launch" />
            </div>
          </div>
        </header>

        {/* Center/Lower Content */}
        <div className={styles.content}>
          <div className={styles.leftContent}>
            <div className={styles.statusRow}>
              <span className={styles.statusDot} />
              <span>Global industrial intelligence</span>
            </div>
            <p className={styles.subtext}>Autonomous Site Guardian • v2.4</p>
          </div>

          <div className={styles.rightContent}>
            <h1 className={styles.pitch}>
              The hundred-eyed watchman for industrial safety &amp; operational resilience.
            </h1>
            <a href="#discover" className={styles.scrollCue}>
              Scroll to explore <span>↓</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
