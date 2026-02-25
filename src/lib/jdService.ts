import { PositionJD } from "@/types/positions";

const GEMINI_API_KEY = "AQ.Ab8RN6KQy6CrNHXbLHEJLAL6NDK5pcWNbLAua5_PKAFCNQFRTw";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const JD_JSON_SCHEMA = `{
  "version": 1,
  "purpose": "A compelling 2-3 sentence overview of the role's strategic importance",
  "education": ["Specific degree requirement 1", "Preferred certification 1"],
  "experience": ["X+ years of experience in Y", "Proven track record in Z"],
  "responsibilities": ["Lead and architect...", "Own and drive...", "Collaborate with..."],
  "skills": ["Skill 1", "Skill 2", "Skill 3"]
}`;

async function callGeminiAPI(parts: object[]): Promise<PositionJD | null> {
    try {
        const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: {
                    temperature: 0.8,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[JD Service] Gemini API Error ${response.status}:`, errorText);
            return null;
        }

        const data = await response.json();
        const rawText: string = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Try to extract JSON from the response
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            // Validate required fields
            if (parsed.purpose && parsed.responsibilities) {
                return parsed;
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
 * Generates a full, professional Job Description from a short snippet, title, or uploaded file.
 */
export async function generateJDContent(
    inputText: string,
    fileData?: { data: string; mimeType: string }
): Promise<PositionJD> {
    const prompt = `You are a world-class HR director at a top-tier global enterprise with 20+ years of experience writing recruitment specifications.

Your task: Write a complete, compelling, and highly specific Job Description.

${inputText ? `USER INPUT / CONTEXT:\n"${inputText}"\n\n` : ""}CRITICAL RULES:
- Tailor EVERY section specifically to the role described in the input. Do NOT use generic placeholders.
- Education: List specific degrees and certifications relevant to THIS exact role.
- Experience: Mention specific years, tools, and technologies drawn from the input text.
- Responsibilities: Write 5-7 specific, impactful bullet points that reflect the actual job.
- Skills: List 6-8 highly specific technical and soft skills for THIS role.
- Tone: Professional, authoritative, inspiring. No AI/assistant mentions.

OUTPUT FORMAT: Respond ONLY with a valid JSON object exactly matching this schema:
${JD_JSON_SCHEMA}`;

    const parts: object[] = [{ text: prompt }];

    if (fileData) {
        parts.push({
            inlineData: {
                data: fileData.data,
                mimeType: fileData.mimeType
            }
        });
    }

    const result = await callGeminiAPI(parts);
    if (result) {
        return { ...result, version: 1 };
    }

    // Fallback: generate dynamic content from the input text
    return buildDynamicFallback(inputText || "the uploaded document", 1);
}

/**
 * Enhances an existing JD by expanding details and improving tone using the Gemini API.
 */
export async function enhanceJDContent(currentJD: PositionJD, instructions?: string): Promise<PositionJD> {
    const prompt = `You are a world-class HR director refining an existing Job Description.

${instructions ? `SPECIFIC REFINEMENT INSTRUCTIONS:\n"${instructions}"\n\n` : ""}CURRENT JOB DESCRIPTION (JSON):
${JSON.stringify(currentJD, null, 2)}

YOUR TASK:
1. Expand the "purpose" into 2-3 powerful, strategic paragraphs.
2. Make each "education" requirement more specific and professional.
3. Rewrite each "experience" point to be achievement-oriented with measurable outcomes.
4. Expand "responsibilities" to 6-8 high-impact, action-verb-led bullet points.
5. Expand "skills" to 8-10 specific technical and leadership competencies.
${instructions ? `6. Incorporate the user's specific instructions: "${instructions}"` : ""}

CRITICAL: Every output item must be MORE specific and detailed than the input. No generic statements.
OUTPUT FORMAT: Respond ONLY with a valid JSON object matching this schema:
${JD_JSON_SCHEMA}`;

    const result = await callGeminiAPI([{ text: prompt }]);
    if (result) {
        return {
            ...result,
            version: (currentJD.version || 1) + 1
        };
    }

    // Fallback with dynamic content based on existing JD + instructions
    return buildDynamicFallback(
        currentJD.purpose || "this role",
        (currentJD.version || 1) + 1,
        currentJD,
        instructions
    );
}

/**
 * Builds a contextually dynamic JD fallback when the API is unavailable.
 * Uses the user's input to generate relevant (non-static) content.
 */
function buildDynamicFallback(
    contextText: string,
    version: number,
    existingJD?: Partial<PositionJD>,
    instructions?: string
): PositionJD {
    const ctx = contextText.toLowerCase();

    // Detect domain from context
    const isData = ctx.includes("data") || ctx.includes("analyst") || ctx.includes("ml") || ctx.includes("ai");
    const isBackend = ctx.includes("backend") || ctx.includes("node") || ctx.includes("python") || ctx.includes("api") || ctx.includes("server");
    const isFrontend = ctx.includes("frontend") || ctx.includes("react") || ctx.includes("ui") || ctx.includes("ux") || ctx.includes("web");
    const isDesign = ctx.includes("design") || ctx.includes("figma") || ctx.includes("product designer");
    const isLeader = ctx.includes("lead") || ctx.includes("manager") || ctx.includes("director") || ctx.includes("head") || ctx.includes("vp");
    const isFinance = ctx.includes("finance") || ctx.includes("accounting") || ctx.includes("cfo") || ctx.includes("financial");
    const isMarketing = ctx.includes("marketing") || ctx.includes("growth") || ctx.includes("seo") || ctx.includes("brand");
    const isSales = ctx.includes("sales") || ctx.includes("revenue") || ctx.includes("account executive") || ctx.includes("business development");
    const isDevOps = ctx.includes("devops") || ctx.includes("cloud") || ctx.includes("infra") || ctx.includes("kubernetes") || ctx.includes("aws");

    // Derive role name from context
    const roleWords = contextText.split(" ")
        .filter(w => w.length > 3 && !["from", "with", "and", "for", "the", "an", "Job", "description", "uploaded", "file"].includes(w.toLowerCase()))
        .slice(0, 4)
        .join(" ");

    const purpose = existingJD?.purpose
        ? `${existingJD.purpose} ${instructions ? `With a focused direction on ${instructions}, t` : "T"}his role operates at the intersection of technical excellence and business strategy, driving measurable impact across the organisation.`
        : `As a key member of our team, the ${roleWords || "specialist"} will spearhead critical initiatives that define our competitive advantage. ${isLeader ? "This leadership role demands a balance of visionary thinking and operational execution, building high-performing teams and delivering consistent results." :
            isData ? "This role transforms complex, raw data landscapes into actionable business intelligence that directly influences product and commercial strategy." :
                isFrontend ? "This role shapes the digital experience for our users through outstanding interface engineering, performance optimization, and design system stewardship." :
                    isBackend ? "This role architects the core systems that power our platform's reliability, security, and scalability at every stage of growth." :
                        isDevOps ? "This role ensures the resilience, velocity, and security of our engineering infrastructure in a cloud-first, developer-centric environment." :
                            isDesign ? "This role leads the product design function, translating complex user needs into intuitive, delightful experiences that drive engagement and retention." :
                                "This position requires a blend of deep domain expertise, sharp analytical thinking, and a collaborative, high-performance mindset."
        }`;

    const education = existingJD?.education?.length ? existingJD.education : [
        isData ? "Bachelor's or Master's in Data Science, Statistics, Computer Science, or Applied Mathematics" :
            isDesign ? "Bachelor's in Design, Human-Computer Interaction, or a related creative discipline" :
                isFinance ? "Bachelor's or Master's in Finance, Accounting, or Economics; CFA or CPA designation strongly preferred" :
                    isMarketing ? "Bachelor's in Marketing, Communications, Business, or a related field; MBA is a plus" :
                        "Bachelor's or Master's in Computer Science, Engineering, or a related technical discipline",
        isData ? "Preferred: Google Professional Data Engineer, AWS Machine Learning Specialty, or Databricks Certified" :
            isDevOps ? "Preferred: AWS Solutions Architect, Certified Kubernetes Administrator (CKA), or GCP Professional Cloud Architect" :
                isFinance ? "Professional qualifications: ICAI, ACCA, CIMA, or equivalent are highly regarded" :
                    isSales ? "MBA or postgraduate qualification in Business advantageous" :
                        "Industry-recognised certifications relevant to the role are strongly preferred"
    ];

    const experience = existingJD?.experience?.length ? existingJD.experience : [
        isLeader ? "8+ years of progressive leadership experience with direct P&L accountability and a track record of building high-performing teams" :
            isData ? "5+ years of hands-on experience designing and delivering large-scale data pipelines, analytics platforms, and ML models in production" :
                isFrontend ? "5+ years of senior frontend engineering experience with React, TypeScript, and modern frontend tooling at scale" :
                    isBackend ? "5+ years building distributed backend systems and APIs that serve high-concurrency, mission-critical workloads" :
                        isDevOps ? "5+ years in DevOps/SRE across cloud-native architectures including AWS, GCP, or Azure" :
                            "5+ years of demonstrated experience in a senior individual contributor or leadership capacity",
        isData ? "Proficiency with Python, SQL, Apache Spark, and ML platforms such as SageMaker, MLflow, or Vertex AI" :
            isSales ? "Proven track record of consistently exceeding revenue quota by 120%+ over 3+ consecutive years in a B2B SaaS environment" :
                isMarketing ? "Demonstrated success scaling performance marketing channels with measurable ROAS and pipeline contribution" :
                    isFrontend ? "Experience owning a component library or design system used by multiple squads in a product-led organisation" :
                        "Demonstrated ability to drive high-impact projects from inception to delivery, with measurable business outcomes",
        isLeader ? "Proven experience hiring, onboarding, and developing senior engineers or functional specialists across distributed teams" :
            "Strong history of cross-functional collaboration with senior stakeholders, Product, and Go-to-Market teams"
    ];

    const responsibilities = existingJD?.responsibilities?.length ? [
        ...existingJD.responsibilities,
        isLeader ? "Define and communicate a clear strategic vision, translating company objectives into actionable team-level OKRs." : "Own end-to-end delivery of your functional area's core outputs with a high standard of quality and predictability.",
        "Establish and champion best practices, coding standards, and governance frameworks across your domain."
    ] : [
        isLeader ? "Define a compelling strategic roadmap and translate it into quarterly OKRs, ensuring alignment from individual contributors to executive leadership." : "Lead the design, development, and delivery of core product or platform capabilities end-to-end.",
        isData ? "Design, build, and maintain production-grade data pipelines, ETL/ELT workflows, and real-time analytics infrastructure." :
            isFrontend ? "Architect and implement scalable, accessible, and highly performant UI components and design systems used across the product suite." :
                isBackend ? "Design and deliver secure, high-throughput RESTful and event-driven APIs with comprehensive observability and SLO adherence." :
                    isDevOps ? "Manage and evolve CI/CD pipelines, container orchestration strategies, and infrastructure-as-code across all environments." :
                        isDesign ? "Drive end-to-end product design for key user journeys, from discovery and wireframing through to high-fidelity prototyping and usability testing." :
                            "Own and continuously improve the team's core operational processes, tooling, and output quality.",
        "Establish robust measurement frameworks to drive data-informed prioritisation and demonstrate business impact.",
        "Collaborate closely with Product, Design, and Business stakeholders to translate requirements into executable technical plans.",
        "Mentor and develop team members through structured code reviews, 1-on-1s, and knowledge-sharing initiatives.",
        isLeader ? "Partner with People and Talent teams to define hiring criteria, conduct interviews, and build a world-class team culture." : "Contribute to architecture and technical direction decisions, advocating for long-term scalability and maintainability."
    ];

    const skills = existingJD?.skills?.length ? existingJD.skills : [
        isData ? "Python & R for Data Science" : isFrontend ? "React & TypeScript" : isBackend ? "Node.js, Go, or Python (FastAPI/Django)" : isDevOps ? "Terraform & Infrastructure-as-Code" : isDesign ? "Figma & Prototyping Tools" : "Domain-Specific Technical Proficiency",
        isData ? "Machine Learning & Statistical Modeling" : isFrontend ? "Performance Optimisation & Core Web Vitals" : "System Design & Distributed Architecture",
        isData ? "Apache Spark, Airflow, dbt, or equivalent orchestration tools" : isDevOps ? "Kubernetes, Docker, Helm & GitOps" : isDesign ? "User Research & Usability Testing" : "Cloud Infrastructure (AWS / GCP / Azure)",
        "Agile / Scrum Delivery Methodology",
        "Stakeholder Management & Executive Communication",
        isLeader ? "Strategic Planning, OKR Setting & Team Development" : "Technical Documentation & Architectural Decision Records",
        "Data-Driven Decision Making",
        "Cross-functional Collaboration & Influence"
    ];

    return { version, purpose, education, experience, responsibilities, skills };
}
