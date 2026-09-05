import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { ProofBar } from "@/components/proof-bar";
import { TextScrollWordReveal } from "@/components/ui/text-scroll-word-reveal";
import { SelectedWork } from "@/components/selected-work";
import { CodeCompareSlider } from "@/components/ui/code-compare-slider";
import { InteractiveLab } from "@/components/interactive-lab";
import { ResearchSection } from "@/components/research-section";
import { GazeCanvas } from "@/components/ui/gaze-canvas";
import { ExperienceSection } from "@/components/experience-section";
import { TechnicalDepth } from "@/components/technical-depth";
import { EducationSection } from "@/components/education-section";
import { SufiClimax } from "@/components/ui/sufi-climax";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { VelocityScroll } from "@/components/ui/velocity-scroll";
import { FontanaSlash } from "@/components/ui/fontana-slash";
import { CuratorialActHeader } from "@/components/curatorial-act-header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink selection:bg-accent selection:text-white transition-colors duration-200 overflow-x-hidden relative">
      <Nav />
      <main className="flex-1">
        {/* ===================================================================
            ACT I: SALA DEL PROMETEO — The Threshold of Fog (Winter / Friedrich)
            Emotional Arc: Curiosity & The Sublime
            =================================================================== */}
        <section id="act-1" className="pt-6 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
            <CuratorialActHeader
              roomNumber="ACT I"
              roomTitle="SALA DEL PROMETEO"
              wallText="At the edge of the known cosmos, the mind encounters the infinite silence of unweighted space. Here, we do not summon machines to mimic life, but to carve sanctuaries of reason from stochastic tempest."
              season="Winter"
              movement="German Romanticism (Friedrich)"
            />
          </div>
          <Hero />
        </section>

        {/* Lucio Fontana Canvas Slash I */}
        <FontanaSlash actLabel="Concetto Spaziale I — Incision into Entropy" />

        {/* ===================================================================
            ACT II: IL MARTINETTO EMPIRICO — Steel & Proof (Autumn / Kiefer)
            Emotional Arc: Intimacy & Unassailable Rigor
            =================================================================== */}
        <section id="act-2" className="py-8 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <CuratorialActHeader
              roomNumber="ACT II"
              roomTitle="IL MARTINETTO EMPIRICO"
              wallText="Truth is not declared by decree; it is chiseled from lead into gold through empirical trial. When an algorithm touches clinical diagnosis, a decimal point is not a statistic—it is a human pulse."
              season="Autumn"
              movement="Matter & Telemetry (Anselm Kiefer)"
            />
          </div>
          <ProofBar />
          <TextScrollWordReveal />
        </section>

        {/* Velocity Ribbons */}
        <VelocityScroll
          track1="✦ AUTONOMOUS MULTI-AGENT DAGs ✦ DETERMINISTIC RULE GATES ✦ RAGAS OBSERVABILITY HARNESS ✦ WHISPERX + GEMMA 4 ✦ ZERO-HALLUCINATION AUDITS"
          track2="✦ AFFECTIVE GAZE TRACKING ✦ COGNITIVE WORKLOAD DYNAMICS ✦ GEMINI 3.8 FLASH ✦ CHROMADB EMBEDDINGS ✦ IIT MADRAS DATA SCIENCE"
        />

        {/* ===================================================================
            ACT III: LA CATTEDRALE DEI SISTEMI — Architecture (Summer / Seurat)
            Emotional Arc: Awe & Systemic Mastery
            =================================================================== */}
        <section id="act-3" className="relative py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <CuratorialActHeader
              roomNumber="ACT III"
              roomTitle="LA CATTEDRALE DEI SISTEMI"
              wallText="The machine becomes a cathedral of deterministic logic. Where others see black-box magic, the architect sees a directed acyclic graph of state transitions, code filters, and guarded gates."
              season="Summer"
              movement="Divisionist Systems (Georges Seurat)"
            />
          </div>

          <TracingBeam>
            {/* Selected Work & Stacking Cards */}
            <div id="work">
              <SelectedWork />
            </div>

            {/* Draggable Code Comparison Slider */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <CodeCompareSlider />
            </div>

            {/* Interactive Systems Lab */}
            <div id="lab">
              <InteractiveLab />
            </div>
          </TracingBeam>
        </section>

        {/* Lucio Fontana Canvas Slash II */}
        <FontanaSlash actLabel="Concetto Spaziale II — Transcending the Plane" />

        {/* ===================================================================
            ACT IV: LO SGUARDO VULNERABILE — Human Grace & Gaze (Spring / Botticelli)
            Emotional Arc: Empathy & Scientific Compassion
            =================================================================== */}
        <section id="act-4" className="relative py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <CuratorialActHeader
              roomNumber="ACT IV"
              roomTitle="LO SGUARDO VULNERABILE"
              wallText="The eye does not deceive. Where words stumble into silence, the gaze traces the architecture of human distress. Our research bridges the pupil to the processor."
              season="Spring"
              movement="Affective Compassion (Botticelli)"
            />
          </div>

          <div id="research">
            <ResearchSection />
          </div>

          {/* Interactive Saccadic Eye-Tracking & Pupillometry Telemetry Canvas */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <GazeCanvas />
          </div>

          <div id="experience">
            <ExperienceSection />
          </div>

          <div id="skills">
            <TechnicalDepth />
          </div>

          <EducationSection />
        </section>

        {/* ===================================================================
            THE SUFI CLIMAX — Rumi's Sanctuary
            Emotional Arc: Transcendence, Vulnerability & Light
            =================================================================== */}
        <SufiClimax />

        {/* Velocity Ribbon */}
        <VelocityScroll
          track1="✦ EMPIRICAL RAG PARAMETER FRONTIER ✦ CROSS-ENCODER RERANKING ✦ HIPAA DE-IDENTIFICATION ✦ 0.72 COMPOSITE CONFIDENCE"
          track2="✦ ARCHITECTING AI SYSTEMS THAT REASON, RETRIEVE, AND SURVIVE CONTACT WITH PRODUCTION ✦"
          className="border-t border-b-0"
        />

        {/* ===================================================================
            ACT V: LA COMUNIONE FINALE — The Monolith & Communion (Rams & Fontana)
            Emotional Arc: Connection & Lifelong Partnership
            =================================================================== */}
        <section id="act-5" className="relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12">
            <CuratorialActHeader
              roomNumber="ACT V"
              roomTitle="LA COMUNIONE FINALE"
              wallText="Form follows function, but empathy endures. Whether architecting clinical multi-agent DAGs or raising AI infrastructure from zero to production—let us converse."
              movement="Bauhaus & Dieter Rams UX Commandments"
            />
          </div>
          <div id="contact">
            <ContactSection />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
