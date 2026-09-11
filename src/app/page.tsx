import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { ProofBar } from "@/components/proof-bar";
import { ExperienceSection } from "@/components/experience-section";
import { SystemsConsole } from "@/components/systems-console";
import { ResearchSection } from "@/components/research-section";
import { TechnicalDepth } from "@/components/technical-depth";
import { EducationSection } from "@/components/education-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { TracingBeam } from "@/components/ui/tracing-beam";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-ink selection:bg-accent selection:text-white transition-colors duration-200 overflow-x-clip relative z-10">
      <Nav />
      <main className="flex-1">
        <Hero />
        <ProofBar />
        <ExperienceSection />
        <SystemsConsole />
        <TracingBeam>
          <ResearchSection />
          <TechnicalDepth />
          <EducationSection />
          <ContactSection />
        </TracingBeam>
      </main>
      <Footer />
    </div>
  );
}
