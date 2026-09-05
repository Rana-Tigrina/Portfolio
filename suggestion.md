# 🏛️ The Sculpted Architecture: Portfolio Redesign Manifesto
> **Design Philosophy**: Conceived through the lens of an **Italian Industrial Designer** (Massimo Vignelli, Pininfarina, Achille Castiglioni) and a **French Sculptor** (Auguste Rodin, Constantin Brâncuși).  
> **Source Material**: Deep scraping of **[motion.dev](https://motion.dev/)** (Motion v12 / Motion UI) and **[21st.dev](https://21st.dev/)** (Magic UI, Motion Primitives, Fancy Components, Aceternity UI, Kokonut UI).  
> **Target Persona**: Elite Technical Recruiters, Founders, VPs of AI, and Principal AI Systems Peers.  
> **Rule of Engagement**: **NO GIT COMMITS** until individual components are reviewed, tested, and explicitly approved by the author.

---

## 🎭 Part I: The Philosophical Foundations

```
    ITALIAN INDUSTRIAL DESIGN               FRENCH SCULPTURAL TENSION
    (Vignelli / Castiglioni / Pininfarina)  (Auguste Rodin / Constantin Brâncuși)
   ┌─────────────────────────────────────┐ ┌──────────────────────────────────────┐
   │ • Relentless typographic hierarchy  │ │ • Chiseled mass and negative space   │
   │ • Mechanical ergonomics & precision │ │ • Monolithic depth & layered slabs   │
   │ • High-contrast surgical materials  │ │ • Continuous physical momentum       │
   │ • Zero decorative fluff; pure form  │ │ • Light washing over sculpted facets │
   └──────────────────┬──────────────────┘ └──────────────────┬───────────────────┘
                      │                                       │
                      └───────────────────┬───────────────────┘
                                          ▼
                      THE AI SYSTEMS ARCHITECT DOSSIER
                  (Munawwar: IIT Madras · 2 Papers · Production GenAI)
```

### 1. The Italian Designer: Precision, Ergonomics, and Mechanical Truth
- **Typography as Architecture**: We do not decorate with fonts; we build with them. A razor-sharp tension between a timeless Italian editorial serif (humanistic intelligence, research depth) and high-density monospaced telemetry (surgical systems engineering, latency, token economics).
- **Mechanical Tactility**: Every interactive element must feel like a precision instrument—meters that roll on ball bearings, buttons that charge like spring switches, cards with calibrated inertia.
- **Surgical Materiality**: Deep obsidian carbon (`#09090b`), warm archival bone paper (`#f8f9fa` / `#121215`), and razor-thin 1px borders illuminated by surgical cyan (`#06b6d4`) and clinical emerald (`#10b981`).

### 2. The French Sculptor: Mass, Void, and Kinetic Tension
- **The Screen as a Block of Honed Granite**: The web is not flat paper. It is a 3D relief. We chisel away every generic cliché ("purple gradient AI slop", floating bubbles, generic cards) until only tectonic truth remains.
- **Continuous Momentum**: Auguste Rodin said, *"Movement is the transition from one attitude to another."* As the user scrolls, elements do not simply appear—they emerge from negative space, stack with tangible mass, and recede with optical depth.
- **Chiaroscuro (Light & Shadow)**: Thin cybernetic laser trails sweep across beveled card edges; ambient inference auras breathe behind active computational panels.

### 3. The Recruiter & Engineering Leader Psychometric Map
Elite technical decision-makers consume portfolios in three brutal, highly compressed phases:

| Phase | Time Window | What the Recruiter Looks For | The Fatal Trap | Our Sculpted Countermeasure |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1: The Sniff Test** | **0 – 5 sec** | Institutional pedigree, proof of real rigor, absence of "AI wrapper" boilerplate. | Cluttered popups, generic purple gradients, slow loading. | High-prestige hero: IIT Madras B.S. Data Science + 2 Published Papers in first viewport with chiseled status badge. |
| **Phase 2: The Traction Test** | **5 – 15 sec** | Verifiable empirical metrics, real systems, actual production scale. | Unquantified adjectives ("passionate developer", "expert in AI"). | Mechanical odometer rolling up (`>91%` Diagnostic Accuracy, `90%` Dev Time Cut, `3.2x` Latency Reduction). |
| **Phase 3: The Architecture Test** | **15 – 45 sec** | Can this person design complex distributed DAGs, evaluation gates, and RAG pipelines? | Static screenshots, GitHub links that require cloning to understand. | Interactive Lab with token streaming, live DAG beam flow, and draggable code comparison slider. |

> [!IMPORTANT]
> **The Cardinal Rule of Scroll Performance**:  
> **Never scroll-jack.** Never freeze the user's natural scroll momentum. All scroll triggers and scroll-linked effects must be scrubbed smoothly via hardware-accelerated transforms (`transform`, `opacity`) through Motion + Lenis, maintaining a locked 60–120 FPS.

---

## 📜 Part II: Top Scroll-Triggered & Scroll-Linked UI from Motion.dev & 21st.dev

Below is the definitive analysis of scroll-driven interactions scraped from **motion.dev** and **21st.dev**, evaluated for exact aesthetic alignment and technical justification.

---

### 1. The Architect's Manifesto: Word-by-Word Kinetic Scroll Reveal
- **Source**: [Motion.dev Scroll Word Reveal Example](https://motion.dev/examples/react-text-scroll-word-reveal)
- **Mechanics**:
  - Uses `useScroll({ target: sectionRef, offset: ["start start", "end end"] })` inside a pinned `180vh` sticky stage.
  - As the user scrolls down, a 1px calibrated vertical progress needle fills downward while each individual word transitions from `opacity: 0.12` to `opacity: 1.0` with balance text wrapping.
- **Why an Italian Designer Demands This**:
  - It creates a **monumental typographic pause**. Between the rapid-fire telemetry of the Proof Bar and the deep case studies, the viewer is guided to absorb Munawwar's core engineering manifesto at their own reading cadence.
- **The Exact Manifesto Copy**:
  > *"I do not train models to merely predict tokens. I engineer deterministic autonomous architectures that reason through clinical noise, verify their own assertions, and survive production."*
- **Recruiter Impact**: Forces an executive recruiter or VP of Engineering to pause and internalize Munawwar's technical philosophy.

---

### 2. Pinned Case Studies: Sculpted Stacking Slabs (3D Depth Deck)
- **Source**: [Fancy Components: Stacking Cards on 21st.dev](https://21st.dev/@danielpetho/components/stacking-cards)
- **Author**: Daniel Petho (`fancy-components`)
- **Mechanics**:
  - As `#work` scrolls, Case Study 1 pins at `top: 100px`.
  - As the user continues scrolling, Case Study 2 slides up over it.
  - Motion's `useScroll` + `useTransform` smoothly drives Case Study 1 to:
    - `scale: 0.94`
    - `y: -20px`
    - `filter: blur(2px)`
    - `opacity: 0.5`
  - Case Study 3 then stacks over Case Study 2 with a deep shadow falloff.
- **Why a French Sculptor Demands This**:
  - Projects cease to be boring vertical list items. They behave like **heavy stone slabs laid onto a master architect's drafting table**, physically registering their weight in 3D perspective.
- **Recruiter Impact**: Focuses 100% of the recruiter's field of view on **one project at a time**, eliminating visual competition between the clinical NLP project, the agentic QA system, and the gaze dynamics research.

---

### 3. Cybernetic Perimeter Border Trail (Active Edge Tracing)
- **Source**: [Motion Primitives: Border Trail](https://21st.dev/@ibelick/components/border-trail) / [Magic UI: Border Beam](https://21st.dev/@dillionverma/components/border-beam)
- **Author**: Julien Thibeaut (`ibelick`) / Dillion Verma (`magic-ui`)
- **Mechanics**:
  - A 1px glowing laser beam sweeps endlessly along the SVG `rect` perimeter of the card container using CSS `offset-path` or Motion hardware-accelerated coordinates.
  - Glow falloff is dialed to a surgical emerald (`#10b981`) or cyan (`#06b6d4`).
- **Where to Add**:
  - Border of the flagship **Jan Elaaj Clinical Case Study**.
  - Outer frame of the **Interactive Systems Lab**.
- **Sculptural Purpose**: Highlights the tactile bevel of the container like a fine laser cut along a piece of precision-machined titanium.

---

### 4. Interactive Live DAG: Animated Data Packet Beams
- **Source**: [Magic UI: Animated Beam on 21st.dev](https://21st.dev/@dillionverma/components/animated-beam)
- **Author**: Dillion Verma (`magic-ui`)
- **Mechanics**:
  - Smooth Bezier SVG spline curves connecting multi-agent nodes (`User Prompt` → `Query Expander` → `Hybrid ChromaDB Retriever` → `Cross-Encoder Reranker` → `BioClinicalBERT / Gemma` → `Ragas Hallucination Gate`).
  - Animated linear gradient light bursts flow along the curves, demonstrating asynchronous pipeline execution.
- **Where to Add**:
  - Directly replacing static boxes in `src/components/architecture-diagram.tsx` and in the Hero `TracePanel`.
- **Engineering Credibility**: Instantly communicates to staff engineers that Munawwar builds **asynchronous, multi-stage DAGs with automated validation**, not simple wrapper scripts.

---

### 5. In-Place Family Morphing Dialog (`layoutId` Continuity)
- **Source**: [Motion.dev Family Dialog](https://motion.dev/examples/react-family-dialog) / [Motion Primitives Morphing Dialog](https://21st.dev/@ibelick/components/morphing-dialog)
- **Author**: Motion.dev Official / Julien Thibeaut (`ibelick`)
- **Mechanics**:
  - When clicking "Inspect Architecture Schematic" or "View Empirical Benchmarks", the card container physically expands with a shared spring (`layoutId="card-container"`, `stiffness: 300, damping: 30`) into an immersive fullscreen technical breakdown.
  - Zero route reload, zero jarring modal popups. The card **physically unfolds**.
- **Sculptural Purpose**: Continuity of matter. The figure does not vanish and get replaced; it transforms before your eyes.

---

### 6. Apple Intelligence Ambient Inference Aura
- **Source**: [Motion.dev Examples: Apple Intelligence Ripple](https://motion.dev/examples/react-apple-intelligence)
- **Author**: Motion.dev Official
- **Mechanics**:
  - Multi-stop chromatic blur filter (cyan, sapphire, emerald, amber) breathing organically along the inner shadow of the container when the simulator is executing inference or streaming tokens.
- **Where to Add**:
  - Active execution state in `src/components/interactive-lab.tsx`.
  - Hero `TracePanel` during simulated token generation.
- **Psychological Effect**: Imbues the application with the unmistakable polish of frontier 2026 AI software.

---

### 7. Draggable Code Comparison Slider (Naive RAG vs Agentic DAG)
- **Source**: [Magic UI: Code Comparison](https://21st.dev/@dillionverma/components/code-comparison) / [Dice UI Compare Slider](https://21st.dev/@diceui/components/compare-slider)
- **Mechanics**:
  - Split container with an interactive vertical drag handle.
  - **Left Side**: Naive RAG implementation (`top_k=3`, direct prompt injection, high hallucination variance, uncalibrated confidence).
  - **Right Side**: Munawwar's Production Architecture (Self-correcting reflection loop, cross-encoder reranking, RAGAS observability, deterministic schema validation).
- **Where to Add**: Inside `InteractiveLab` or as a toggle tab in the Jan Elaaj case study.
- **Recruiter Impact**: In 10 seconds, any technical interviewer sees that Munawwar solves the exact failure modes of enterprise AI deployments.

---

### 8. Mechanical Swiss Odometer (Sliding Number Ticker)
- **Source**: [Motion Primitives: Sliding Number](https://21st.dev/@ibelick/components/sliding-number)
- **Author**: Julien Thibeaut (`ibelick`)
- **Mechanics**:
  - Triggered via `whileInView` with `viewport={{ once: true, amount: 0.5 }}` in `src/components/proof-bar.tsx`.
  - Each digit is an isolated vertical strip `0-9` that rolls on a spring with calibrated mass (`mass: 0.8, stiffness: 75, damping: 15`).
  - Numbers roll into place: `91%`, `90%`, `3.2x`, `1,200+`.
- **Italian Design Connection**: Evokes the physical counter wheels of an Olivetti mechanical calculator or a dashboard odometer in a vintage Alfa Romeo.

---

### 9. Encrypted Matrix Decryption on Scroll Reveal
- **Source**: [Aceternity UI: Encrypted Text](https://21st.dev/@manuarora700/components/encrypted-text) / [Motion Primitives: Text Scramble](https://21st.dev/@ibelick/components/text-scramble)
- **Mechanics**:
  - As paper cards scroll into view in `src/components/research-section.tsx`, the publication title cycles rapidly through random Greek letters and cryptographic tokens (`λ, ψ, θ, ∑, #, &`) over 600ms before snapping into crisp serif font.
- **Sculptural Purpose**: Form resolving out of noise—a direct metaphor for training neural networks out of raw stochastic entropy.

---

### 10. The Monolithic Curtain Footer Reveal
- **Source**: [Motion.dev Footer Reveal](https://motion.dev/examples/react-footer-reveal)
- **Author**: Matt Perry (`motion.dev`)
- **Mechanics**:
  - The main application `<main>` container has a heavy drop shadow and `z-index: 10`.
  - The `<Footer>` sits sticky underneath at `z-index: 0`.
  - As the user scrolls past the contact section, the main page slides up like an architectural curtain, unveiling the subterranean command console (Munawwar's contact channels, PGP fingerprint, resume PDF, GitHub, and live local time).
- **Sculptural Purpose**: Reveals the subterranean bedrock beneath the architecture.

---

### 11. Floating Dynamic Navigation Dock
- **Source**: [Motion Primitives: Dock](https://21st.dev/@ibelick/components/dock) / [Aceternity Floating Dock](https://21st.dev/@manuarora700/components/floating-dock)
- **Author**: Julien Thibeaut (`ibelick`)
- **Mechanics**:
  - Fixed bottom glass pill dock (`backdrop-blur-md`, subtle border, dark obsidian).
  - Icons magnify organically on mouse proximity with Gaussian spring curves (`useTransform`, `useSpring`).
  - Shortcuts: `[Home, Selected Work, Interactive Lab, Research Papers, Technical Depth, Resume PDF, GitHub, Email]`.
- **Ergonomic Purpose**: Total effortless navigation across any scroll depth on desktop.

---

## 🏗️ Part III: The Complete Page-by-Page Redesign Blueprint

Here is how the sculpted redesign transforms `src/app/page.tsx`:

```
   ┌────────────────────────────────────────────────────────────┐
   │ 1. SCULPTED HERO                                           │
   │    • Line-by-line editorial masked stagger reveal          │
   │    • IIT Madras status pill with live ping                 │
   │    • ContainerScroll with Apple Intelligence inference rim │
   │    • Elastic snapping SVG wire divider                     │
   └─────────────────────────────┬──────────────────────────────┘
                                 │
   ┌─────────────────────────────▼──────────────────────────────┐
   │ 2. PROOF TELEMETRY BAR                                     │
   │    • Scroll-triggered mechanical odometer tickers (91%)    │
   │    • Animated SVG confidence distribution sparklines       │
   └─────────────────────────────┬──────────────────────────────┘
                                 │
   ┌─────────────────────────────▼──────────────────────────────┐
   │ 3. ARCHITECT'S MANIFESTO (NEW)                             │
   │    • Pinned 180vh stage with TextScrollWordReveal          │
   │    • Calibrated vertical progress needle                   │
   │    • High-impact reading pause for executive recruiters    │
   └─────────────────────────────┬──────────────────────────────┘
                                 │
   ┌─────────────────────────────▼──────────────────────────────┐
   │ 4. SELECTED WORK: STACKING DOSSIER SLABS                   │
   │    • Fancy Stacking Cards (depth blur + 3D scale on scroll)│
   │    • Cybernetic perimeter laser trail on flagship card     │
   │    • Family morphing dialog (layoutId) for deep schematics │
   └─────────────────────────────┬──────────────────────────────┘
                                 │
   ┌─────────────────────────────▼──────────────────────────────┐
   │ 5. INTERACTIVE SYSTEMS LAB                                 │
   │    • Real-time token streaming typewriter                  │
   │    • Animated Beam DAG multi-agent data flow               │
   │    • Draggable Code Comparison slider (Naive vs Agentic)   │
   │    • Tactile Hold-to-Confirm action button                 │
   └─────────────────────────────┬──────────────────────────────┘
                                 │
   ┌─────────────────────────────▼──────────────────────────────┐
   │ 6. RESEARCH & PUBLICATIONS: CHISELED MONOLITH              │
   │    • Encrypted text decryption on paper titles             │
   │    • 360° Radar Coordinate Scanner for Gaze Dynamics       │
   │    • In-place BibTeX copy drawer                           │
   └─────────────────────────────┬──────────────────────────────┘
                                 │
   ┌─────────────────────────────▼──────────────────────────────┐
   │ 7. TECHNICAL DEPTH & SYSTEMS FOUNDATIONS                   │
   │    • 3D Interactive Celestial Tag Sphere (Magic UI)        │
   │    • Categorized architectural matrices                    │
   └─────────────────────────────┬──────────────────────────────┘
                                 │
   ┌─────────────────────────────▼──────────────────────────────┐
   │ 8. THE SUBTERRANEAN CURTAIN FOOTER REVEAL                  │
   │    • Under-page sticky slide reveal                        │
   │    • PGP / Direct Email / IIT Madras credential badges     │
   └────────────────────────────────────────────────────────────┘
   ┌────────────────────────────────────────────────────────────┐
   │ 9. GLOBAL FLOATING DYNAMIC DOCK (DESKTOP)                  │
   │    • Magnetic magnification navigation HUD                 │
   └────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Part IV: Drop-in Code Blueprints (Next.js 16 + React 19 + Motion v12)

### Blueprint 1: The Architect's Manifesto (`TextScrollWordReveal`)
File: `src/components/ui/text-scroll-word-reveal.tsx`

```tsx
"use client";

import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "motion/react";
import { Fragment, useRef } from "react";

const STATEMENT =
  "I do not train models to merely predict tokens. I engineer deterministic autonomous architectures that reason through clinical noise, verify their own assertions, and survive production.";

const START_OPACITY = 0.12;
const SPREAD = 0.8;
const WORD_DURATION = 0.2;

interface WordProgressRange {
  start: number;
  end: number;
}

function getWordProgressRange(index: number, count: number): WordProgressRange {
  const start = count <= 1 ? 0 : (index / (count - 1)) * SPREAD;
  return { start, end: Math.min(1, start + WORD_DURATION) };
}

function Word({
  children,
  progress,
  index,
  count,
  reducedMotion,
}: {
  children: string;
  progress: MotionValue<number>;
  index: number;
  count: number;
  reducedMotion: boolean;
}) {
  const range = getWordProgressRange(index, count);
  const opacity = useTransform(progress, (latest) => {
    if (latest <= range.start) return START_OPACITY;
    if (latest >= range.end) return 1;
    const p = (latest - range.start) / (range.end - range.start);
    return START_OPACITY + (1 - START_OPACITY) * p;
  });

  return (
    <motion.span style={reducedMotion ? undefined : { opacity }} className="transition-opacity duration-75">
      {children}
    </motion.span>
  );
}

export function TextScrollWordReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const words = STATEMENT.split(" ");

  return (
    <section ref={sectionRef} className="relative w-full min-h-[170vh] bg-paper text-ink border-b border-line">
      <div className="sticky top-0 w-full min-h-screen flex items-center px-6 md:px-16 overflow-hidden">
        <div className="max-w-4xl mx-auto w-full grid grid-cols-[1px_1fr] gap-8 md:gap-14 items-start">
          {/* Calibrated Needle */}
          <div className="relative w-[1px] h-28 md:h-36 bg-line overflow-hidden">
            <motion.span
              style={{ scaleY: reducedMotion ? 1 : scrollYProgress }}
              className="absolute inset-0 bg-accent origin-top block"
            />
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent mb-6 font-semibold">
              // Systems Engineering Manifesto
            </p>
            <h2 className="font-serif italic text-2xl sm:text-3xl md:text-5xl leading-[1.2] text-ink tracking-tight">
              {words.map((word, index) => (
                <Fragment key={`${word}-${index}`}>
                  <Word
                    progress={scrollYProgress}
                    index={index}
                    count={words.length}
                    reducedMotion={Boolean(reducedMotion)}
                  >
                    {word}
                  </Word>
                  {index < words.length - 1 ? " " : null}
                </Fragment>
              ))}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

### Blueprint 2: Mechanical Sliding Number Odometer
File: `src/components/ui/sliding-number.tsx`

```tsx
"use client";

import { useEffect, useRef } from "react";
import { motion, useSpring, useTransform, useInView } from "motion/react";

export function SlidingNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}
```

---

### Blueprint 3: Cybernetic Perimeter Border Trail
File: `src/components/ui/border-trail.tsx`

```tsx
"use client";

import { motion } from "motion/react";

export function BorderTrail({
  className = "",
  size = 60,
  duration = 8,
}: {
  className?: string;
  size?: number;
  duration?: number;
}) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] ${className}`}>
      <motion.div
        className="absolute aspect-square bg-gradient-to-r from-transparent via-accent to-transparent opacity-75 blur-[1px]"
        style={{ width: size, offsetPath: `rect(0 auto auto 0 round inherit)` }}
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
```

---

### Blueprint 4: Pinned Stacking Cards for Case Studies
File: `src/components/ui/stacking-cards.tsx`

```tsx
"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function StackingCard({
  index,
  total,
  children,
}: {
  index: number;
  total: number;
  children: React.ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  });

  // Calculate subtle depth recession as subsequent cards scroll in
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 - (total - index) * 0.03]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -index * 12]);

  return (
    <div ref={cardRef} className="sticky top-24 mb-12">
      <motion.div style={{ scale, y }} className="origin-top transition-shadow">
        {children}
      </motion.div>
    </div>
  );
}
```

---

### Blueprint 5: Monolithic Curtain Footer Reveal
File: `src/components/ui/curtain-footer.tsx`

```tsx
"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function CurtainFooterLayout({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["end end", "end start"],
  });

  const footerOpacity = useTransform(scrollYProgress, [0, 0.4], [0.4, 1]);

  return (
    <div ref={containerRef} className="relative">
      {/* Main content body acting as a sculpted curtain slab */}
      <div className="relative z-10 bg-paper shadow-2xl pb-12 border-b border-line">
        {children}
      </div>

      {/* Sticky subterranean footer revealed as page rolls up */}
      <motion.div style={{ opacity: footerOpacity }} className="sticky bottom-0 z-0 min-h-[50vh]">
        {footer}
      </motion.div>
    </div>
  );
}
```

---

## 🎯 Prioritization & Implementation Plan

| Phase | Milestone | Included Features | Testing & Verification |
| :--- | :--- | :--- | :--- |
| **Stage 1** | **Telemetry & Micro-Delight** | • Drop-in `SlidingNumber` into `proof-bar.tsx`<br>• Add `BorderTrail` to Jan Elaaj card<br>• Add `EncryptedText` scramble to research paper titles | Verify 60FPS on mobile & desktop. Zero layout shifts. |
| **Stage 2** | **The Sculptural Pause** | • Insert `TextScrollWordReveal` between Proof Bar & Work<br>• Add `HoldToConfirm` button for Resume Download & Lab Run | Scrub scroll up and down; verify word opacity ranges and needle synchronization. |
| **Stage 3** | **Tectonic Work Showcase** | • Refactor `selected-work.tsx` to use `StackingCard` depth deck<br>• Add `layoutId` Morphing Dialog for deep architecture inspector | Verify keyboard accessibility (`Esc` to close) and Lenis smooth scroll compatibility. |
| **Stage 4** | **Live Intelligence & Lab** | • Add `AnimatedBeam` DAG flow in `architecture-diagram.tsx`<br>• Implement Draggable `CodeComparisonSlider` in `interactive-lab.tsx` | Test touch dragging on mobile & mouse dragging on desktop. |
| **Stage 5** | **Subterranean Reveal & Dock** | • Wrap page in `CurtainFooterLayout`<br>• Mount floating dynamic bottom dock on desktop viewports | Test bottom viewport collision and dark/light mode contrast. |

---

> [!CAUTION]
> **Git Protection Active**: As per explicit user instruction, **no changes will be committed to git** until each milestone is reviewed, tested in the local development server, and approved.
