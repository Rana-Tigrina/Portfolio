# Mohammad Munawwar Malook

<div align="center">

### **Senior AI/ML & Systems Engineer · Applied AI Researcher**
*IIT Madras Data Science Graduate · 2 Published Research Papers*

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Motion](https://img.shields.io/badge/Motion-12.4-E10098?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br />

**"I architect AI systems that reason, retrieve, and survive contact with production."**

[Live Portfolio](#) · [Flagship Systems](#flagship-engineering-systems) · [Interactive Lab](#interactive-lab--rag-simulator) · [Research](#applied-research--publications) · [Contact](#contact--connect)

</div>

---

## ⚡ Verified Production Benchmarks

| Metric | System / Domain | Empirical Impact |
| :--- | :--- | :--- |
| **>91%** | **Jan Elaaj Clinical System** | Symptom identification accuracy benchmarked on par with licensed psychologists using hybrid BioClinicalBERT + Gemini 3.8 Flash. |
| **90%** | **Qapp.ai Platform** | Agent engineering cycle reduction via low-code drag-and-drop LLM orchestration platform shipped to production. |
| **87%** | **Enterprise RAG Pipeline** | Query retrieval precision (P@5) achieved via semantic boundary chunking and automated RAGAS evaluation harness. |
| **40%** | **Prompt & Chunking Optimization** | Token inference cost reduction while strictly preserving document context fidelity. |
| **65%** | **Clinical SOAP Automation** | Reduction in physician documentation hours with 90% terminology accuracy using WhisperX + Gemma 4 (validated by Qwen 3.5). |
| **2 Papers** | **Research Publications** | Published research in multimodal affective teletherapy (Taylor & Francis) and cognitive dynamics review (ICSCCC). |

---

## 🏛️ Flagship Engineering Systems

### 1. Healthcare Claims Audit Multi-Agent System
- **Stack**: `LangGraph`, `Gemini 3.8 Flash`, `ChromaDB`, `Pydantic v2`, `python-dotenv`, `Python`
- **Architecture**: Deterministic LangGraph StateGraph: Contract Reader (ChromaDB) + Claim Extractor (0 LLM native parse) → Deterministic Rule Match (exact CPT/ICD overlap) → Auditor Agent (Gemini 3.8 Flash composite score: 0.6 LLM + 0.4 Match) → Routing Gate (threshold 0.72) → Appeal Drafter ([DRAFT] marker) / `routed_to_human`.
- **Key Engineering Decision**: Enforced deterministic candidate matching to auto-approve non-conflicting claims (0 LLM calls), composite confidence scoring (0.72 threshold), and a hard product boundary preventing autonomous outbound letter transmission.
- **Measured Outcome**: Processed CMS Medicare claims end-to-end with real-time discrepancy highlighting, verifiable policy citations, and automated appeal letter drafts.

### 2. Multi-Agent Research Assistant with MCP
- **Stack**: `LangGraph`, `Model Context Protocol (MCP)`, `Python 3.11`, `Tool-Calling Agents`, `Tavily`
- **Architecture**: Stateful cyclic LangGraph featuring dedicated Planner, Retriever, Synthesizer, and Critic nodes interfaced via standardized MCP server protocols.
- **Key Engineering Decision**: Implemented an explicit cyclic **Reflection & Critic Loop** that validates citation ground-truth before returning an answer, routing back to re-plan upon insufficient evidence.
- **Measured Outcome**: Zero hallucinated citations across benchmark evaluation suites with transparent step-by-step reasoning attribution.

### 3. Production RAG & Observability Pipeline
- **Stack**: `LangChain`, `ChromaDB`, `RAGAS`, `LangSmith`, `Langfuse`, `Docker`, `GitHub Actions`, `AWS`
- **Architecture**: Enterprise vector retrieval pipeline coupled with continuous OpenTelemetry tracing and an automated GitHub Actions CI evaluation harness.
- **Key Engineering Decision**: Established automated CI/CD gating where Pull Requests are blocked from merging if RAGAS faithfulness falls below 0.85 or context recall degrades.
- **Measured Outcome**: Achieved 87% query retrieval precision and 40% token cost reduction via semantic chunking and automated regression prevention.

### 4. Clinical Documentation & SOAP Notes Automation
- **Stack**: `WhisperX`, `Gemma 4`, `Qwen 3.5`, `FFmpeg`, `Librosa`, `FastAPI`, `Docker`
- **Architecture**: Acoustic preprocessing (Librosa/FFmpeg) → Diarized transcription from `demo.mp3` (WhisperX) → Structured SOAP note generation by Gemma 4 → Clinical validation & ICD-10 mapping by Qwen 3.5 → EHR clinical format export.
- **Key Engineering Decision**: Tuned domain-specific prompt hierarchies on Gemma 4 with secondary verification gating via Qwen 3.5, guaranteeing HIPAA compliance, sub-second latency, and zero dosage contraindications.
- **Measured Outcome**: Reduced physician clinical documentation time by 65% while maintaining 95% SNOMED-CT clinical terminology precision.

---

## 🎨 Creative Engineering & Interactive UI

This portfolio is built as an interactive engineering playground, combining rigorous editorial design (Newsreader serif + IBM Plex Mono) with modern motion physics:

- **WebGL Navier-Stokes Fluid Canvas (`FluidCursor`)**: Real-time GPU fluid dynamics simulation reacting to cursor motion and touch with iridescent mint emerald, cyan, and cyber violet dye vortices that dissipate organically.
- **Lenis Butter-Smooth Inertial Scrolling**: Weighted momentum scroll physics creating a frictionless luxury browsing experience.
- **Kinetic Velocity Skew Marquee (`VelocityScroll`)**: Bi-directional kinetic typography ribbons tracking scroll velocity via Framer Motion springs, dynamically skewing text angle (`skewX: -16deg → +16deg`) with acceleration.
- **3D Magnetic Spatial Tilt (`MagneticTilt`)**: Interactive cards that tilt with cursor perspective in true 3D (`rotateX`, `rotateY`, `translateZ`) while casting dynamic specular glare reflections.
- **Floating Neural OS HUD Deck (`NeuralHud`)**: Persistent glassmorphic command deck featuring:
  - **3 Dimension Modes**: Editorial Studio, Cyber Matrix (CRT scanline shader & phosphor telemetry), and Lab Mode.
  - **Web Audio Haptic Synthesizer**: Client-side sound generation (zero external MP3 assets) with tactile ticks, frequency sweeps, and animated audio equalizer.
  - **Live Agent Cascade Traversal**: Automated cinematic state machine sequence running simulated LangGraph executions with audio-visual telemetry.
- **Flagship Engineering Studio**: Split command center with directional slide and blur transitions (`slideVariants`), spring tab indicator (`layoutId="activeSystemPill"`), hotkey keyboard navigation (<kbd>1</kbd>–<kbd>4</kbd> and <kbd>←</kbd>/<kbd>→</kbd>), and an interactive CAD flowchart with live node telemetry popovers.
- **Dual View Mode Switcher**: Seamlessly switch between the **Interactive Studio** console and the **Full Deck** view.
- **Interactive RAG Parameter & Curve Simulator**: Real-time SVG dynamic waveform curves grounded in empirical research (arXiv:2505.08445 & arXiv:2606.28337), featuring Cross-Encoder reranking toggle and live token math.
- **3D Perspective Scroll Container**: Physics-based 3D incline rotation (`rotateX: 16deg → 0deg`) wrapping the live trace panel as the visitor scrolls.
- **Living Vector Wave Background (`BackgroundPaths`)**: 17 harmonic cubic-bezier SVG lines driven by mathematical sine/cosine waves.
- **Scroll-Linked Tracing Beam Spine**: SVG guide track with a real-time glowing gradient beam measuring reading progression down the page.
- **Interactive Technical Depth Bento Grid**: Live typing Python terminal displaying an autonomous LangGraph agent loop with realistic cadence, alongside benchmark meters and model architecture cards.
- **Command Palette (`Cmd+K` / `Ctrl+K`)**: Instant modal navigation across case studies, research papers, lab simulator, and contact channels.

---

## 📚 Applied Research & Publications

1. **Beyond Words: Multimodal Approach to Teletherapy Using Eye Gaze and Facial Expressions**
   - *Venue*: **Taylor & Francis (2025)**
   - *Abstract*: Proposed a multimodal AI framework integrating computer vision (eye gaze tracking, facial expression analysis) and NLP to assess patient engagement and emotional states in teletherapy. Deployed facial action unit detection to quantify affective rapport in real-time consultations.
   - *Keywords*: Multimodal AI, Computer Vision, Affective Computing, Healthcare NLP.

2. **A Systematic Literature Review on the Impact of AI on the Cognitive Capabilities of Programmers**
   - *Venue*: **ICSCCC (2025)**
   - *Abstract*: Comprehensive analysis of 45+ empirical studies investigating how AI coding assistants influence developer problem-solving, cognitive load, and architectural reasoning. Synthesized empirical data across junior vs senior developer cohorts.
   - *Keywords*: Software Engineering, Cognitive Load, Developer Productivity, LLM Evaluation.

---

## 📁 Repository Structure

```
Portfolio/
├── .github/                     # GitHub Actions & repo configurations
├── src/
│   ├── app/
│   │   ├── globals.css          # Design tokens, fonts, SVG presentation rules & styles
│   │   ├── layout.tsx           # App root layout, fonts, and meta tags
│   │   └── page.tsx             # Main page assembling all portfolio sections
│   ├── components/
│   │   ├── architecture-diagram.tsx # Interactive SVG flowcharts with node telemetry popovers
│   │   ├── command-palette.tsx      # Cmd+K / Ctrl+K interactive keyboard palette
│   │   ├── contact-section.tsx      # Direct inquiry & scheduling console
│   │   ├── education-section.tsx    # Academic credentials (IIT Madras)
│   │   ├── experience-section.tsx   # Professional industry experience timeline
│   │   ├── footer.tsx               # Footer with links & system status
│   │   ├── hero.tsx                 # Dynamic Hero with BackgroundPaths & 3D ContainerScroll
│   │   ├── icons.tsx                # Custom SVG icons & brand glyphs
│   │   ├── interactive-lab.tsx      # RAG parameter & dynamic waveform curve simulator
│   │   ├── nav.tsx                  # Floating navigation bar with command palette trigger
│   │   ├── proof-bar.tsx            # Standout metric proof bar
│   │   ├── research-section.tsx     # Research publications with BibTeX export
│   │   ├── selected-work.tsx        # Flagship Engineering Studio (2-Pane Console + Full Deck)
│   │   ├── technical-depth.tsx      # Bento Grid with live typing Python terminal
│   │   ├── trace-panel.tsx          # Real-time multi-agent reasoning trace panel
│   │   └── ui/                      # Reusable modern UI primitives
│   │       ├── background-paths.tsx # Harmonic vector wave animation
│   │       ├── button.tsx           # Styled button primitive
│   │       ├── container-scroll.tsx # 3D perspective scroll container
│   │       ├── particle-button.tsx  # Dynamic particle click feedback button
│   │       ├── spotlight-card.tsx   # 3D magnetic tilt card with spotlight sweep
│   │       └── tracing-beam.tsx     # Scroll-linked SVG gradient spine
│   ├── content/
│   │   └── site.ts                  # Centralized, single-source-of-truth portfolio data
│   └── lib/
│       ├── sound.ts                 # Web Audio API synthesized tactile sound generator
│       └── utils.ts                 # ClassName merging utilities (clsx + twMerge)
├── .editorconfig                # Universal formatting & indentation rules
├── .env.example                 # Sample environment variables
├── .gitignore                   # Production-grade Git ignore specifications
├── LICENSE                      # MIT Open Source License
├── next.config.ts               # Next.js configuration
├── package.json                 # Project dependencies & scripts
├── postcss.config.mjs           # PostCSS configuration
├── README.md                    # Project documentation
└── tsconfig.json                # TypeScript strict configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm**, **pnpm**, or **yarn**

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Rana-Tigrina/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

### Production Build & Verification

```bash
# Typecheck
npx tsc --noEmit

# Production Build
npm run build

# Start Production Server
npm run start
```

---

## 📬 Contact & Connect

- **Engineer**: Mohammad Munawwar Malook
- **Email**: [munawwar9022@gmail.com](mailto:munawwar9022@gmail.com)
- **LinkedIn**: [linkedin.com/in/munawwar-malook](https://www.linkedin.com/in/munawwar-malook/)
- **GitHub**: [github.com/Rana-Tigrina](https://github.com/Rana-Tigrina)
- **Location**: Delhi, India
- **Availability**: Open for Senior AI/ML & Founding Engineer roles

---

<div align="center">
  <sub>Engineered with Next.js 16, TypeScript, Tailwind CSS, and Motion. Licensed under MIT.</sub>
</div>