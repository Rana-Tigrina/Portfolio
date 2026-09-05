export interface ProofMetric {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sublabel: string;
  detail: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  category: string;
  badge: string;
  stack: string[];
  problem: string;
  whyItMattered: string;
  architecture: string;
  decision: string;
  decisionReason: string;
  outcome: string;
  links: {
    github?: string;
    demo?: string;
  };
}

export interface Publication {
  id: string;
  title: string;
  venue: string;
  year: string;
  status: "Published" | "Accepted" | "Under Review";
  abstract: string;
  tags: string[];
  bibtex: string;
  link?: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
  stack: string[];
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: string[];
}

export const siteData = {
  personal: {
    name: "Mohammad Munawwar Malook",
    wordmark: "Munawwar",
    initials: "MMM",
    role: "AI/ML & GenAI Engineer",
    secondaryRole: "Applied AI Researcher · Systems Architect",
    summary:
      "Specialized in autonomous multi-agent pipelines, clinical NLP architectures, and production-grade RAG frameworks with automated evaluation harnesses. Proven track record owning systems end-to-end—from research and transformer fine-tuning to low-latency serving.",
    location: "Delhi, India",
    email: "munawwar9022@email.com",
    phone: "+91 93546 26671",
    github: "https://github.com/Rana-Tigrina",
    linkedin: "https://www.linkedin.com/in/munawwar-malook/",
    status: {
      available: true,
      text: "Available for Senior AI/ML & Founding Engineer roles",
    },
  },

  hero: {
    eyebrow: "RESEARCHER → BUILDER → SYSTEMS ENGINEER",
    headline: "I architect AI systems that reason, retrieve, and survive contact with production.",
    subcopy:
      "IIT Madras Data Science graduate with two published research papers in multimodal AI and cognitive dynamics. I build production-grade agentic workflows, deterministic RAG pipelines, and HIPAA-aware clinical NLP models with continuous evaluation harnesses.",
    ctaPrimary: { label: "Explore Case Studies", href: "#work" },
    ctaSecondary: { label: "Research & Publications", href: "#research" },
    ctaLab: { label: "Open Interactive Lab", href: "#lab" },
  },

  proofMetrics: [
    {
      id: "diag-acc",
      value: 91,
      prefix: ">",
      suffix: "%",
      label: "Diagnostic Accuracy",
      sublabel: "Jan Elaaj Clinical System",
      detail:
        "Hybrid BioClinicalBERT + Gemini 3.8 Flash architecture achieving symptom identification accuracy benchmarked on par with licensed psychologists.",
    },
    {
      id: "dev-time",
      value: 90,
      prefix: "",
      suffix: "%",
      label: "Agent Dev Time Saved",
      sublabel: "Qapp.ai Orchestration Platform",
      detail:
        "Shipped a low-code drag-and-drop LLM orchestration framework to production, enabling non-technical teams to configure domain-specific agents.",
    },
    {
      id: "rag-acc",
      value: 87,
      prefix: "",
      suffix: "%",
      label: "RAG Retrieval Accuracy",
      sublabel: "Enterprise Document Intelligence",
      detail:
        "High-throughput enterprise Q&A system leveraging semantic chunking, ChromaDB vector indexing, and automated RAGAS evaluation.",
    },
    {
      id: "cost-red",
      value: 40,
      prefix: "",
      suffix: "%",
      label: "Token Cost Reduction",
      sublabel: "Prompt & Chunking Optimization",
      detail:
        "Engineered chunking strategies and prompt compression that reduced inference token consumption while preserving context fidelity.",
    },
    {
      id: "soap-time",
      value: 65,
      prefix: "",
      suffix: "%",
      label: "Documentation Time Cut",
      sublabel: "WhisperX + Gemma 4 SOAP Pipeline",
      detail:
        "Automated conversion of doctor-patient consultation audio into structured SOAP notes by Gemma 4 and validated by Qwen 3.5 with 90% terminology accuracy.",
    },
    {
      id: "pub-count",
      value: 2,
      prefix: "",
      suffix: " Papers",
      label: "Research Publications",
      sublabel: "Taylor & Francis & ICSCCC",
      detail:
        "Published research in multimodal affective computing and systematic evaluation of AI tools on human cognitive processes.",
    },
  ] as ProofMetric[],

  caseStudies: [
    {
      slug: "healthcare-claims-audit",
      title: "Healthcare Claims Audit Multi-Agent System",
      category: "Multi-Agent System & Healthcare AI",
      badge: "LangGraph Multi-Agent Pipeline",
      stack: ["LangGraph", "Gemini 3.8 Flash", "ChromaDB", "Pydantic v2", "python-dotenv", "Python"],
      problem:
        "Healthcare payers and IPAs lose billions to payment leakage from claims paid incorrectly against un-indexed contract rules. Human auditors only sample a fraction of claims.",
      whyItMattered:
        "Autonomous claims audit requires auditable rule citations, deterministic pre-filtering, and an absolute boundary preventing autonomous outbound letter transmission.",
      architecture:
        "Deterministic LangGraph StateGraph: Contract Reader structures policy rules into ChromaDB -> Claim Extractor parses CMS claims natively (0 LLM calls) -> Deterministic Rule Match filters candidate rules by exact CPT/ICD overlap (auto-approves if no overlap) -> Auditor Agent reasons over narrowed candidates with composite confidence (0.6 LLM + 0.4 retrieval match) -> Routing branches to Appeal Drafter or routes to human review (threshold 0.72).",
      decision:
        "Engineered deterministic candidate matching (exact code overlap) to skip LLM calls on non-conflicting claims, paired with composite confidence scoring (0.72 threshold) and mandatory [DRAFT] markers.",
      decisionReason:
        "Passing irrelevant semantic candidates to an LLM causes confident hallucinations. Deterministic pre-matching eliminates hallucination risk, saves token cost, and guarantees reproducible audit logs.",
      outcome:
        "Executed end-to-end CMS claim audits with verifiable policy citations, auto-drafted appeal letters with mandatory [DRAFT] boundaries, and automated human-in-the-loop fallback.",
      links: {
        github: "https://github.com/Rana-Tigrina",
      },
    },
    {
      slug: "multi-agent-research-mcp",
      title: "Multi-Agent Research Assistant with MCP",
      category: "Agentic Orchestration & Tool Protocols",
      badge: "Stateful LangGraph + MCP",
      stack: ["LangGraph", "Model Context Protocol (MCP)", "Python", "Tool-Calling Agents", "Tavily"],
      problem:
        "Standard LLM question-answering hallucinates citations, cannot iterate when initial retrieval fails, and suffers from proprietary, non-standard tool integration glue code.",
      whyItMattered:
        "Technical and scientific literature research demands grounded evidence, multi-hop reasoning, and self-correction before presenting conclusions to engineers.",
      architecture:
        "Stateful LangGraph featuring dedicated Planner, Retriever, Synthesizer, and Critic nodes. Standardized Model Context Protocol (MCP) servers provide modular tool access (web search, local retrieval, mathematical solvers).",
      decision:
        "Implemented an explicit Reflection & Critic loop that validates citation ground-truth before returning an answer, routing back to Re-Plan upon insufficient evidence.",
      decisionReason:
        "Single-turn agent execution fails on ambiguous queries. Cyclic graph state enables agents to self-evaluate and rectify search strategies autonomously.",
      outcome:
        "Eliminated hallucinated citations across benchmark evaluation suites with transparent, step-by-step reasoning traces and tool-call attribution.",
      links: {
        github: "https://github.com/Rana-Tigrina",
      },
    },
    {
      slug: "production-rag-observability",
      title: "Production RAG Q&A System & Observability Pipeline",
      category: "RAG & LLMOps",
      badge: "RAGAS Gated CI/CD",
      stack: ["LangChain", "ChromaDB", "RAGAS", "LangSmith", "Langfuse", "Docker", "GitHub Actions", "AWS"],
      problem:
        "Enterprise RAG deployments frequently degrade silently as prompt templates, documents, or models change, without regression test coverage.",
      whyItMattered:
        "Customer-facing and domain-specific Q&A cannot tolerate hallucinations or drifting context relevance without continuous telemetry.",
      architecture:
        "Enterprise RAG architecture coupled with LangSmith/Langfuse telemetry and a GitHub Actions automated evaluation suite scoring Faithfulness, Answer Relevance, and Context Precision.",
      decision:
        "Established automated CI/CD gating: PRs are blocked from deployment if RAGAS faithfulness falls below 0.85 or context recall degrades.",
      decisionReason:
        "Eliminates subjective manual evaluation. Ensures prompt updates and chunking modifications are objectively benchmarked prior to production merge.",
      outcome:
        "Achieved 87% query retrieval accuracy and 40% token cost reduction via semantic chunking and automated regression prevention.",
      links: {
        github: "https://github.com/Rana-Tigrina",
      },
    },
    {
      slug: "clinical-documentation-soap",
      title: "Clinical Documentation & SOAP Notes Automation",
      category: "Clinical NLP & Speech AI",
      badge: "WhisperX + Gemma 4",
      stack: ["WhisperX", "Gemma 4", "Qwen 3.5", "FFmpeg", "Librosa", "FastAPI", "Docker"],
      problem:
        "Physicians spend up to 2 hours per day manually documenting patient encounters, leading to severe burnout and clinical documentation delays.",
      whyItMattered:
        "Automating structured SOAP notes (Subjective, Objective, Assessment, Plan) directly from raw doctor-patient audio consultations returns precious time to patient care.",
      architecture:
        "Acoustic preprocessing (Librosa/FFmpeg) -> diarized transcription (WhisperX) -> clinical SOAP note synthesis by Gemma 4 -> medical terminology & dosage validation by Qwen 3.5 -> EHR-ready export.",
      decision:
        "Tuned domain-specific clinical prompt hierarchies on Gemma 4 with secondary verification gating via Qwen 3.5 instead of relying on opaque single-model APIs.",
      decisionReason:
        "Guaranteed HIPAA-compliant local deployability, lower latency, and 90% terminology precision on complex pharmacological and anatomical phrases.",
      outcome:
        "Reduced physician documentation time by 65% while maintaining 90% benchmarked clinical terminology accuracy validated by Qwen 3.5.",
      links: {
        github: "https://github.com/Rana-Tigrina",
      },
    },
  ] as CaseStudy[],

  publications: [
    {
      id: "pub-teletherapy",
      title: "Beyond Words: Multimodal Approach to Teletherapy Using Eye Gaze and Facial Expressions",
      venue: "Taylor & Francis",
      year: "2025",
      status: "Published",
      abstract:
        "Proposed a novel multimodal AI framework integrating computer vision (eye gaze tracking, facial expression analysis) and NLP to assess patient engagement and emotional states in teletherapy. Deployed facial action unit detection to quantify affective rapport in real-time consultations.",
      tags: ["Computer Vision", "Multimodal AI", "Healthcare NLP", "Affective Computing"],
      bibtex: `@article{malook2025beyond,
  title={Beyond Words: Multimodal Approach to Teletherapy Using Eye Gaze and Facial Expressions},
  author={Malook, Mohammad Munawwar},
  journal={Taylor & Francis},
  year={2025},
  publisher={Taylor & Francis}
}`,
    },
    {
      id: "pub-cognitive",
      title: "The Impact of AI Educational Tools on Cognitive Processes: A Systematic Review",
      venue: "4th International Conference on Secure Cyber Computing and Communications (ICSCCC)",
      year: "2026",
      status: "Accepted",
      abstract:
        "Conducted a comprehensive systematic review analyzing the impact of LLMs and generative AI tools on human cognitive workflows, memory retention, critical analysis, and educational paradigms across tertiary learning environments.",
      tags: ["Generative AI", "Cognitive Systems", "Systematic Review", "Human-AI Interaction"],
      bibtex: `@inproceedings{malook2026impact,
  title={The Impact of AI Educational Tools on Cognitive Processes: A Systematic Review},
  author={Malook, Mohammad Munawwar},
  booktitle={4th International Conference on Secure Cyber Computing and Communications (ICSCCC)},
  year={2026}
}`,
    },
    {
      id: "pub-agents-safety",
      title: "Deterministic State Coordination in Autonomous Multi-Agent Healthcare Workflows",
      venue: "In Submission / Under Review",
      year: "2026",
      status: "Under Review",
      abstract:
        "Investigating deterministic state boundaries, reflection loops, and safety constraints in LLM multi-agent systems deployed within regulated clinical diagnosis and audit workflows.",
      tags: ["Multi-Agent Systems", "Safety & Alignment", "LLMOps", "Clinical AI"],
      bibtex: `@article{malook2026deterministic,
  title={Deterministic State Coordination in Autonomous Multi-Agent Healthcare Workflows},
  author={Malook, Mohammad Munawwar},
  journal={Preprint / In Submission},
  year={2026}
}`,
    },
  ] as Publication[],

  experience: [
    {
      company: "Jan Elaaj",
      role: "AI Engineer",
      period: "Dec 2024 – July 2025",
      location: "Delhi, India",
      highlights: [
        "Architected, built, and deployed an end-to-end hybrid clinical diagnostic AI system combining fine-tuned BioClinicalBERT with a Gemini 3.8 Flash reasoning layer, achieving >91% symptom identification accuracy (on par with licensed psychologists).",
        "Designed and implemented multi-turn clinical dialogue management, structured decision support, hypothesis generation, and differential diagnosis workflows from unstructured patient inputs.",
        "Built and integrated a Pinecone-backed RAG pipeline to maintain persistent longitudinal patient memory across multi-session consultations, mirroring EHR-style continuity of care.",
        "Operated as a solo/founding contributor owning the entire AI stack, driving architecture, tooling, containerization, and production serving decisions independently.",
      ],
      stack: ["BioClinicalBERT", "Gemini 3.8 Flash", "Pinecone", "FastAPI", "Docker", "Python"],
    },
    {
      company: "Qapp.ai",
      role: "AI Engineer Intern",
      period: "Jun 2024 – Sep 2024",
      location: "Delhi, India",
      highlights: [
        "Architected a low-code, drag-and-drop LLM orchestration framework and shipped it to production, reducing custom agent development time by 90%.",
        "Built high-performance, low-latency REST APIs powering automated multi-step AI pipelines, including audio/video transcription, computer vision analysis, and AI-driven interview assessment agents.",
        "Deployed open-source LLMs (LLaMA 3.1, Mistral) with self-serve interfaces, enabling non-technical business and clinical users to configure and launch domain-specific agents.",
        "Optimized vector database indexing, chunking strategies, and real-time model inference for production GenAI workloads.",
      ],
      stack: ["LLaMA 3.1", "Mistral", "ChromaDB", "FastAPI", "Vector Search", "Python"],
    },
  ] as ExperienceItem[],

  technicalDepth: [
    {
      category: "GenAI, LLMs & Multi-Agent Frameworks",
      description: "Autonomous orchestration, deterministic routing, and tool-augmented reasoning engines.",
      skills: [
        "LangChain",
        "LangGraph",
        "Model Context Protocol (MCP)",
        "Multi-Agent Orchestration",
        "Tool-Calling Agents",
        "Prompt Engineering",
        "Gemini 3.8 Flash",
        "Gemma 4",
        "Qwen 3.5",
        "Mistral",
        "OpenAI GPT",
        "Hugging Face Transformers",
      ],
    },
    {
      category: "Clinical NLP & Healthcare AI",
      description: "Domain-adapted representations, medical terminology grounding, and HIPAA-aware architectures.",
      skills: [
        "BioClinicalBERT",
        "Whisper / WhisperX",
        "Medical Named Entity Recognition (NER)",
        "Automated SOAP Note Generation",
        "ICD-10 Auto-Coding",
        "FHIR / HL7 Data Standards",
        "HIPAA-aware AI Workflows",
      ],
    },
    {
      category: "LLMOps, Observability & Evaluation",
      description: "Automated regression testing, citation verification, and cost/latency tracking.",
      skills: [
        "LangSmith",
        "Langfuse",
        "RAGAS (Evaluation Harness)",
        "CI/CD (GitHub Actions)",
        "Faithfulness & Precision Scoring",
        "Latency & Cost Tracking Dashboards",
        "Automated Regression Suites",
      ],
    },
    {
      category: "Vector Storage, Cloud & Backend",
      description: "High-throughput vector indexing, containerized microservices, and reliable serving.",
      skills: [
        "Pinecone",
        "Qdrant",
        "ChromaDB",
        "SQLite",
        "FastAPI",
        "Flask",
        "Streamlit",
        "Docker",
        "Kubernetes (Basics)",
        "AWS",
        "Google Cloud Platform (GCP)",
        "PyTorch",
      ],
    },
  ] as SkillCategory[],

  education: [
    {
      institution: "Indian Institute of Technology, Madras (IIT Madras)",
      degree: "Bachelor of Science (B.S.) in Data Science and Applications",
      period: "Graduated Dec 2025",
      grade: "CGPA: 8.5 / 10.0",
      description:
        "Rigorous training in machine learning algorithms, deep learning, statistical modeling, database systems, and distributed computation.",
    },
    {
      institution: "Kendriya Vidyalaya, Delhi",
      degree: "Class XII, CBSE (Senior Secondary)",
      period: "Completed",
      grade: "Score: 91%",
      description: "Focus in Mathematics, Physics, Chemistry, and Computer Science.",
    },
  ],
};
