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

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink selection:bg-accent selection:text-white transition-colors duration-200 overflow-x-hidden">
      <Nav />
      <main className="flex-1">
        <Hero />
        <ProofBar />
        <TracingBeam>
          <SelectedWork />
          <InteractiveLab />
          <ResearchSection />
          <ExperienceSection />
          <TechnicalDepth />
          <EducationSection />
          <ContactSection />
        </TracingBeam>
      </main>
      <Footer />
    </div>
  );
}
