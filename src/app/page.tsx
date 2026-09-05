import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { ProofBar } from "@/components/proof-bar";
import { SelectedWork } from "@/components/selected-work";
import { InteractiveLab } from "@/components/interactive-lab";
import { ResearchSection } from "@/components/research-section";
import { ExperienceSection } from "@/components/experience-section";
import { TechnicalDepth } from "@/components/technical-depth";
import { EducationSection } from "@/components/education-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { VelocityScroll } from "@/components/ui/velocity-scroll";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink selection:bg-accent selection:text-white transition-colors duration-200 overflow-x-hidden relative">
      <Nav />
      <main className="flex-1">
        <Hero />
        <ProofBar />
        <VelocityScroll
          track1="✦ AUTONOMOUS MULTI-AGENT DAGs ✦ DETERMINISTIC RULE GATES ✦ RAGAS OBSERVABILITY HARNESS ✦ WHISPERX + GEMMA 4 ✦ ZERO-HALLUCINATION AUDITS"
          track2="✦ AFFECTIVE GAZE TRACKING ✦ COGNITIVE WORKLOAD DYNAMICS ✦ GEMINI 3.8 FLASH ✦ CHROMADB EMBEDDINGS ✦ IIT MADRAS DATA SCIENCE"
        />
        <TracingBeam>
          <SelectedWork />
          <InteractiveLab />
          <ResearchSection />
          <ExperienceSection />
          <TechnicalDepth />
          <EducationSection />
          <ContactSection />
        </TracingBeam>
        <VelocityScroll
          track1="✦ EMPIRICAL RAG PARAMETER FRONTIER ✦ CROSS-ENCODER RERANKING ✦ HIPAA DE-IDENTIFICATION ✦ 0.72 COMPOSITE CONFIDENCE"
          track2="✦ ARCHITECTING AI SYSTEMS THAT REASON, RETRIEVE, AND SURVIVE CONTACT WITH PRODUCTION ✦"
          className="border-t border-b-0"
        />
      </main>
      <Footer />
    </div>
  );
}
