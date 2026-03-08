import { PositionJD, PsychometricCluster, OnboardingMilestone } from "@/types/positions";

const GEMINI_API_KEY = "AIzaSyDg1aiZweU9mzZNVP73WQYafShsiAQLUq4";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const EOS_IA_JSON_SCHEMA = `{
  "version": 1,
  "purpose": "A compelling 2-3 sentence strategic overview of WHY this role exists and its impact on the business",
  "education": ["Specific degree/qualification requirement 1", "Preferred certification or advanced degree"],
  "experience": ["X+ years of specific experience in Y domain", "Proven track record of Z with measurable outcome"],
  "skills": ["Good-to-have skill or attribute 1", "Role enhancer, not a core gate 2"],
  "responsibilities": ["Led and owned [specific outcome]...", "Architected and delivered [specific system]...", "Partnered with [team] to drive [result]..."],
  "capabilityStack": ["Technical capability 1", "Leadership capability 2", "Domain expertise 3"],
  "nonNegotiables": ["Hard gate — must have 1", "Non-negotiable behavioral requirement 2", "Absolute disqualifier if absent 3"],
  "twelveMonthOutcomes": ["By month 3: [specific measurable outcome]", "By month 6: [specific milestone]", "By month 12: [strategic impact delivered]"],
  "interfaceMap": ["Reports to: [Title]", "Manages: [Team or ICs]", "Collaborates with: [Functions]", "Key external interface: [Stakeholders]"],
  "psychometricClusters": [
    { "name": "Cluster Name", "description": "One sentence describing this psychological pattern", "score": 8 },
    { "name": "Cluster Name 2", "description": "One sentence describing this psychological pattern", "score": 7 }
  ],
  "onboardingScorecard": [
    { "period": "30 Days", "objectives": ["Complete objective 1", "Complete objective 2"] },
    { "period": "90 Days", "objectives": ["Deliver outcome 1", "Establish cadence with team"] },
    { "period": "12 Months", "objectives": ["Major strategic outcome 1", "Performance benchmark 2"] }
  ]
}`;

async function callGeminiAPI(parts: object[]): Promise<PositionJD | null> {
  try {
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.85,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[JD Service] Gemini API Error ${response.status}:`, errorText);
      return null;
    }

    const data = await response.json();
    const rawText: string = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract JSON block from response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.purpose && parsed.responsibilities) {
          return parsed as PositionJD;
        }
      } catch {
        console.error("[JD Service] Failed to parse JSON:", jsonMatch[0]);
      }
    }
    console.error("[JD Service] Could not extract valid JSON from response:", rawText);
    return null;
  } catch (e) {
    console.error("[JD Service] Network or parse error:", e);
    return null;
  }
}

/**
 * Generates a full 12-section EOS_IA Job Description from 4 core inputs.
 * This is the primary AI generation path used when creating a new position.
 */
export async function generateJDFromInputs(
  role: string,
  level: string,
  business: string,
  location: string
): Promise<{ jd: PositionJD; error?: string }> {
  const prompt = `You are an expert People & Talent Architect with 20+ years of experience designing role architectures for Fortune 500 companies.

Your framework: EOS_IA (Execution Operating System — Intelligent Architecture)
Philosophy: Roles are operating systems, not positions. A Job Description is a foundational business instrument, not an HR artifact.

ROLE TO ARCHITECT:
- Role: ${role}
- Position / Level: ${level}
- Business / Department: ${business}
- Location: ${location}

YOUR TASK: Generate a complete, highly specific, 12-section Job Description for this exact role. Every section must be tailored to the specific combination of role, level, business, and location. Do NOT use generic placeholders.

SECTION REQUIREMENTS:
1. purpose: WHY this role exists — its strategic importance and business impact (2-3 compelling sentences)
2. education: Specific qualifications and certifications for THIS exact role and level
3. experience: Specific years, tools, domains, and achievement patterns — measurable outcomes
4. skills: Good-to-have attributes that enhance performance but are not core gates (6-8 items)
5. responsibilities: 6-8 high-impact, action-verb-led outcomes this role OWNS (not tasks, but owned outcomes)
6. capabilityStack: The 5-7 specific technical, operational, and leadership capabilities this role requires at THIS level
7. nonNegotiables: 3-5 absolute hard gates — behavioral, experiential, or ethical. Missing any one disqualifies the candidate.
8. twelveMonthOutcomes: 3-4 specific, measurable outcomes expected at 30/60/90 days and 12 months
9. interfaceMap: Reporting line, direct reports (if any), key internal collaborators, and external stakeholders
10. psychometricClusters: Exactly 5 psychometric patterns most predictive of success in THIS role. Score each /10 based on importance. Include name and 1-sentence description.
11. onboardingScorecard: 3 milestone periods (30 Days, 90 Days, 12 Months) with 2-3 measurable objectives each

CRITICAL RULES:
- Everything must be specific to: ${role} at ${level} level in ${business} based in ${location}
- No generic HR filler language. Every line must be directly useful.
- Psychometric clusters must reflect the REAL psychological demands of THIS role
- Non-negotiables are hard disqualifiers, not preferences
- 12-month outcomes must be measurable, not vague aspirations

OUTPUT FORMAT: Respond ONLY with a valid JSON object exactly matching this schema:
${EOS_IA_JSON_SCHEMA}`;

  const result = await callGeminiAPI([{ text: prompt }]);
  if (result) {
    return { jd: { ...result, version: 1 } };
  }

  // Return error signal instead of silently using fallback
  return {
    jd: buildDynamicFallback(`${level} ${role}`, business, location, 1),
    error: "API_FAILED",
  };
}

/**
 * Generates a full JD from pasted text or uploaded file content.
 */
export async function generateJDContent(
  inputText: string,
  fileData?: { data: string; mimeType: string }
): Promise<PositionJD> {
  const prompt = `You are an expert People & Talent Architect applying the EOS_IA framework.

EOS_IA Philosophy: Roles are operating systems, not positions. Transform the provided job description input into a complete, strategically architected role framework.

${inputText ? `INPUT JD / CONTEXT:\n"${inputText}"\n\n` : ""}YOUR TASK: Extract and architect all 12 sections from the input. Where the input is sparse, intelligently infer what an expert would write for this type of role. Every output must be specific and actionable.

CRITICAL RULES:
- Tailor EVERY section to the specific role described in the input
- No generic placeholder language
- responsibilities: 6-8 owned outcomes, not tasks
- psychometricClusters: 5 patterns scored /10 for THIS exact role type
- nonNegotiables: Real disqualifiers, not preferences
- onboardingScorecard: Measurable milestones at 30, 90 days and 12 months

OUTPUT FORMAT: Respond ONLY with a valid JSON object exactly matching this schema:
${EOS_IA_JSON_SCHEMA}`;

  const parts: object[] = [{ text: prompt }];

  if (fileData) {
    parts.push({
      inlineData: {
        data: fileData.data,
        mimeType: fileData.mimeType,
      },
    });
  }

  const result = await callGeminiAPI(parts);
  if (result) {
    return { ...result, version: 1 };
  }

  return buildDynamicFallback(inputText || "the uploaded document", "", "", 1);
}

/**
 * Enhances an existing JD using specific refinement instructions.
 */
export async function enhanceJDContent(
  currentJD: PositionJD,
  instructions?: string
): Promise<PositionJD> {
  const prompt = `You are an expert People & Talent Architect refining an EOS_IA Job Description.

${instructions ? `SPECIFIC REFINEMENT INSTRUCTIONS:\n"${instructions}"\n\n` : ""}CURRENT JOB DESCRIPTION (JSON):
${JSON.stringify(currentJD, null, 2)}

YOUR TASK: Produce an enhanced version of this JD. For every section:
1. purpose: Expand to 2-3 powerful, strategic paragraphs that articulate business impact
2. education: Make requirements more precise and level-appropriate
3. experience: Rewrite as achievement-oriented statements with measurable outcomes
4. skills: Expand to 8-10 specific competencies, both technical and behavioral
5. responsibilities: 7-9 high-impact owned outcomes using strong action verbs
6. capabilityStack: Expand with 6-8 specific, differentiated capabilities
7. nonNegotiables: Sharpen — these are real disqualifiers, make them unambiguous
8. twelveMonthOutcomes: Make outcomes more specific and measurable
9. interfaceMap: Expand with more specific interface details
10. psychometricClusters: Refine descriptions — make them operationally insightful
11. onboardingScorecard: Add more specific, measurable objectives to each period
${instructions ? `12. Incorporate the user's specific instructions throughout: "${instructions}"` : ""}

CRITICAL: Every output item must be MORE specific and differentiated than the input.
OUTPUT FORMAT: Respond ONLY with a valid JSON object matching this schema (version should be ${(currentJD.version || 1) + 1}):
${EOS_IA_JSON_SCHEMA}`;

  const result = await callGeminiAPI([{ text: prompt }]);
  if (result) {
    return {
      ...result,
      version: (currentJD.version || 1) + 1,
    };
  }

  return buildDynamicFallback(
    currentJD.purpose || "this role",
    "",
    "",
    (currentJD.version || 1) + 1,
    currentJD,
    instructions
  );
}

/**
 * Builds a contextually dynamic JD fallback when the API is unavailable.
 */
function buildDynamicFallback(
  contextText: string,
  business: string,
  location: string,
  version: number,
  existingJD?: Partial<PositionJD>,
  instructions?: string
): PositionJD {
  const ctx = contextText.toLowerCase();

  const isData = ctx.includes("data") || ctx.includes("analyst") || ctx.includes("ml") || ctx.includes("ai");
  const isBackend = ctx.includes("backend") || ctx.includes("node") || ctx.includes("python") || ctx.includes("api");
  const isFrontend = ctx.includes("frontend") || ctx.includes("react") || ctx.includes("ui") || ctx.includes("ux");
  const isDesign = ctx.includes("design") || ctx.includes("figma") || ctx.includes("product designer");
  const isLeader = ctx.includes("lead") || ctx.includes("manager") || ctx.includes("director") || ctx.includes("head") || ctx.includes("vp");
  const isFinance = ctx.includes("finance") || ctx.includes("accounting") || ctx.includes("financial");
  const isMarketing = ctx.includes("marketing") || ctx.includes("growth") || ctx.includes("seo");
  const isSales = ctx.includes("sales") || ctx.includes("revenue") || ctx.includes("account executive");
  const isDevOps = ctx.includes("devops") || ctx.includes("cloud") || ctx.includes("infra") || ctx.includes("kubernetes");

  const roleWords = contextText.split(" ")
    .filter((w) => w.length > 3 && !["from", "with", "and", "for", "the", "an", "job", "description", "uploaded", "file"].includes(w.toLowerCase()))
    .slice(0, 4)
    .join(" ");

  const purpose = existingJD?.purpose
    ? `${existingJD.purpose} ${instructions ? `With a focused direction on ${instructions}, t` : "T"}his role operates at the intersection of technical excellence and business strategy, driving measurable impact across the organisation.`
    : `The ${roleWords || "specialist"} is a critical execution node within ${business || "the organisation"}, responsible for driving outcomes that directly impact competitive positioning. ${isLeader ? "This leadership role demands a balance of visionary thinking and operational execution, building high-performing teams and delivering consistent results." : isData ? "This role transforms complex data landscapes into actionable intelligence that influences product and commercial strategy." : isFrontend ? "This role shapes the digital experience through outstanding interface engineering, performance optimisation, and design system stewardship." : isBackend ? "This role architects the core systems powering platform reliability, security, and scalability." : isDevOps ? "This role ensures the resilience, velocity, and security of our engineering infrastructure in a cloud-first environment." : "This position requires deep domain expertise, analytical rigour, and a high-performance collaborative mindset."}${location ? ` Based in ${location}.` : ""}`;

  const education = existingJD?.education?.length ? existingJD.education : [
    isData ? "Bachelor's or Master's in Data Science, Statistics, Computer Science, or Applied Mathematics" : isDesign ? "Bachelor's in Design, HCI, or a related creative discipline" : isFinance ? "Bachelor's or Master's in Finance, Accounting, or Economics; CFA or CPA preferred" : isMarketing ? "Bachelor's in Marketing, Communications, or Business; MBA is a plus" : "Bachelor's or Master's in Computer Science, Engineering, or a related discipline",
    isData ? "Google Professional Data Engineer, AWS ML Specialty, or Databricks Certified Associate" : isDevOps ? "AWS Solutions Architect, CKA, or GCP Professional Cloud Architect" : isFinance ? "ICAI, ACCA, CIMA, or equivalent professional qualification" : "Industry-recognised certifications in the relevant domain",
  ];

  const experience = existingJD?.experience?.length ? existingJD.experience : [
    isLeader ? "8+ years of progressive leadership with direct P&L accountability and a track record of building high-performing teams" : isData ? "5+ years designing and delivering large-scale data pipelines, analytics platforms, and ML models in production" : isFrontend ? "5+ years of senior frontend engineering with React, TypeScript, and modern tooling at scale" : isBackend ? "5+ years building distributed backend systems and APIs serving high-concurrency workloads" : isDevOps ? "5+ years in DevOps/SRE across cloud-native architectures including AWS, GCP, or Azure" : "5+ years in a senior IC or leadership capacity with demonstrated business impact",
    isData ? "Proficiency with Python, SQL, Apache Spark, and ML platforms such as SageMaker or Vertex AI" : isSales ? "Proven track record of consistently exceeding revenue quota by 120%+ over 3+ consecutive years in B2B SaaS" : isFrontend ? "Experience owning a component library or design system used by multiple squads" : "Demonstrated delivery of high-impact projects from inception to production",
  ];

  const skills = existingJD?.skills?.length ? existingJD.skills : [
    isData ? "Advanced Python & SQL" : isFrontend ? "React & TypeScript" : isBackend ? "Distributed System Design" : isDevOps ? "Infrastructure-as-Code (Terraform)" : isDesign ? "Figma & Prototyping" : "Domain technical proficiency",
    "Clear and influential communication across seniority levels",
    "Data-driven decision making",
    "Comfort with ambiguity and fast-changing priorities",
    "Strong ownership culture — takes initiative without being asked",
  ];

  const responsibilities = existingJD?.responsibilities?.length ? existingJD.responsibilities : [
    isLeader ? "Define the team's strategic roadmap and translate company objectives into quarterly OKRs" : "Lead the design, development, and delivery of core platform capabilities end-to-end",
    isData ? "Design, build, and maintain production-grade data pipelines and real-time analytics infrastructure" : isFrontend ? "Architect scalable, accessible UI components and design systems used across the product suite" : isBackend ? "Design and deliver secure, high-throughput APIs with comprehensive observability and SLO adherence" : isDevOps ? "Manage CI/CD pipelines, container orchestration, and infrastructure-as-code across all environments" : "Own and continuously improve the team's core operational processes and output quality",
    "Establish robust measurement frameworks to demonstrate business impact",
    "Collaborate with Product, Design, and Business stakeholders to translate requirements into executable plans",
    "Mentor and develop team members through structured reviews and knowledge-sharing",
    isLeader ? "Partner with People & Talent to define hiring criteria and build world-class team culture" : "Contribute to architecture and technical direction decisions advocating for long-term scalability",
  ];

  const capabilityStack = existingJD?.capabilityStack?.length ? existingJD.capabilityStack : [
    isData ? "Machine Learning & Statistical Modelling" : isFrontend ? "Frontend Architecture & Component Systems" : isBackend ? "Distributed Systems & API Design" : isDevOps ? "Cloud Infrastructure & SRE Practices" : "Core Domain Technical Proficiency",
    "Systems thinking — ability to see patterns across complexity",
    "Stakeholder management and executive communication",
    isLeader ? "Team building and performance management" : "Self-directed delivery with minimal oversight",
    "Continuous improvement and learning agility",
  ];

  const nonNegotiables = existingJD?.nonNegotiables?.length ? existingJD.nonNegotiables : [
    "Absolute ownership mindset — does not deflect accountability",
    "Proven track record of delivery in complex, ambiguous environments",
    isLeader ? "Experience leading a team of 3+ for at least 2 years" : `Minimum ${isData || isBackend || isFrontend ? "4" : "3"}+ years of hands-on experience in the core domain`,
    "Demonstrably high standards — will not ship work they are not proud of",
  ];

  const twelveMonthOutcomes = existingJD?.twelveMonthOutcomes?.length ? existingJD.twelveMonthOutcomes : [
    "By 30 days: Fully onboarded, key stakeholder relationships established, first contribution shipped",
    "By 90 days: Owning a defined workstream with measurable output and clear success metrics",
    "By 6 months: Operating independently at full capacity, actively contributing to team direction",
    "By 12 months: Delivered a flagship outcome, raised the bar for the team, ready to mentor peers",
  ];

  const interfaceMap = existingJD?.interfaceMap?.length ? existingJD.interfaceMap : [
    `Reports to: Head of ${business || "Department"}`,
    isLeader ? "Manages: Direct reports — engineers, analysts, or specialists" : "Individual contributor role with high cross-functional exposure",
    "Collaborates with: Product, Engineering, Design, and Operations teams",
    "Key external interfaces: Vendors, partners, or external stakeholders as relevant",
  ];

  const psychometricClusters: PsychometricCluster[] = existingJD?.psychometricClusters?.length
    ? existingJD.psychometricClusters as PsychometricCluster[]
    : [
      { name: "Achievement Drive", description: "High internal motivation to set and exceed measurable performance targets", score: isLeader ? 9 : 8 },
      { name: "Systems Thinking", description: "Ability to perceive patterns across complexity and design elegant solutions", score: isData || isBackend ? 9 : 7 },
      { name: "Resilience Under Pressure", description: "Maintains performance quality and composure in high-stakes, deadline-driven environments", score: 8 },
      { name: isLeader ? "Influence & Leadership" : "Collaborative Intelligence", description: isLeader ? "Moves people through inspiration, clarity, and trust rather than authority" : "Builds strong working relationships across functions and hierarchies", score: isLeader ? 9 : 7 },
      { name: "Intellectual Curiosity", description: "Demonstrates a proactive, self-directed desire to learn beyond the immediate scope of the role", score: 7 },
    ];

  const onboardingScorecard: OnboardingMilestone[] = existingJD?.onboardingScorecard?.length
    ? existingJD.onboardingScorecard as OnboardingMilestone[]
    : [
      { period: "30 Days", objectives: ["Complete all onboarding documentation and tooling setup", "Attend all relevant team rituals and establish key relationships", "Ship first small contribution or deliver first output"] },
      { period: "90 Days", objectives: ["Own an end-to-end workstream with defined success metrics", "Demonstrate competence in core function — peer-recognised", "Identify and flag one process improvement opportunity"] },
      { period: "12 Months", objectives: ["Deliver a flagship outcome with measurable business impact", "Operate as a fully trusted team member — no supervision required", isLeader ? "Successfully hire and onboard at least one team member" : "Contribute to knowledge base or mentor a junior colleague"] },
    ];

  return {
    version,
    purpose,
    education,
    experience,
    skills,
    responsibilities,
    capabilityStack,
    nonNegotiables,
    twelveMonthOutcomes,
    interfaceMap,
    psychometricClusters,
    onboardingScorecard,
  };
}
