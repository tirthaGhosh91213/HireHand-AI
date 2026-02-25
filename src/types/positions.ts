export interface CandidateScores {
  resume: number;
  psych: number;
  composite: number;
}

export interface CandidateData {
  id: string;
  name: string;
  role: string;
  email: string;
  stage: string;
  scores: CandidateScores;
  verdict: "Go" | "Conditional" | "No-Go";
  addedDate: string;
}

export interface PositionJD {
  version: number;
  purpose: string;
  education: string[];
  experience: string[];
  responsibilities: string[];
  skills: string[];
}

export interface PositionJDVersion {
  id: string;
  version: number;
  timestamp: string;
  jd: PositionJD;
}

export interface PositionStats {
  candidates: number;
  avgScore: number;
  sla: string;
  riskFlags: number;
}

export interface PositionData {
  id: string;
  title: string;
  level: string;
  location: string;
  department: string;
  status: string;
  jdChoice: "create" | "upload" | "paste" | null;
  jd: PositionJD | null;
  jdVersions?: PositionJDVersion[];
  stats: PositionStats;
  candidates: number;
  shortlisted: number;
  riskFlag: string | null;
  riskLevel: string | null;
  sla: string;
  slaLevel: string;
  updated: string;
  candidatesList?: CandidateData[];
}

const POSITIONS_KEY = "hirehand-positions-v3";

const MOCK_JD: PositionJD = {
  version: 1,
  purpose:
    "Lead the development of scalable backend systems and distributed architectures. Collaborate with cross-functional teams to define technical strategy and deliver high-impact solutions that power our core platform.",
  education: [
    "Bachelor's degree in Computer Science, Engineering, or related field",
    "Master's degree preferred but not required",
  ],
  experience: [
    "6+ years of software engineering experience",
    "Strong background in cloud platforms (AWS, GCP, or Azure)",
    "Experience leading technical teams of 3+ engineers",
    "Track record of delivering production systems at scale",
  ],
  responsibilities: [
    "Design and implement microservices architecture",
    "Mentor junior engineers and conduct code reviews",
    "Drive technical decisions and architecture proposals",
    "Collaborate with Product and Design on feature specs",
    "Ensure system reliability with monitoring and alerting",
    "Contribute to hiring and team growth initiatives",
  ],
  skills: [
    "Kubernetes",
    "Machine Learning",
    "Event-driven Architecture",
    "GraphQL",
    "CI/CD Pipelines",
    "System Design",
    "TypeScript",
    "PostgreSQL",
  ],
};

const MOCK_CANDIDATES: CandidateData[] = [
  { id: "cand-101", name: "James Morrison", role: "Senior Dev @ TechCorp", email: "james@techcorp.com", stage: "Interview L2", scores: { resume: 8.2, psych: 7.8, composite: 80 }, verdict: "Go", addedDate: "2024-12-10" },
  { id: "cand-102", name: "Priya Sharma", role: "Staff Engineer @ InnovateTech", email: "priya@innovatetech.com", stage: "Interview L2", scores: { resume: 9.1, psych: 8.5, composite: 88 }, verdict: "Go", addedDate: "2024-12-08" },
  { id: "cand-103", name: "Alex Chen", role: "Backend Lead @ DataFlow", email: "alex@dataflow.io", stage: "Screened", scores: { resume: 7.4, psych: 7.1, composite: 73 }, verdict: "Conditional", addedDate: "2024-12-12" },
  { id: "cand-104", name: "Sarah Williams", role: "SDE III @ CloudBase", email: "sarah@cloudbase.com", stage: "Sourced", scores: { resume: 6.8, psych: 6.5, composite: 67 }, verdict: "No-Go", addedDate: "2024-12-14" },
  { id: "cand-105", name: "Rahul Patel", role: "Principal Eng @ ScaleUp", email: "rahul@scaleup.io", stage: "Interview L1", scores: { resume: 8.7, psych: 8.0, composite: 84 }, verdict: "Conditional", addedDate: "2024-12-11" },
];

export const DEFAULT_POSITIONS: PositionData[] = [
  {
    id: "REQ-2024-0042",
    title: "Senior Software Engineer",
    level: "Senior",
    location: "San Francisco, CA",
    department: "Engineering",
    status: "Active",
    jdChoice: "create",
    jd: null,
    stats: { candidates: 24, avgScore: 7.9, sla: "At Risk", riskFlags: 1 },
    candidates: 24,
    shortlisted: 6,
    riskFlag: "Long time-to-fill",
    riskLevel: "high",
    sla: "At Risk",
    slaLevel: "warning",
    updated: "2024-12-15",
    candidatesList: MOCK_CANDIDATES,
  },
  {
    id: "REQ-2024-0039",
    title: "Product Manager",
    level: "Senior",
    location: "New York, NY",
    department: "Product",
    status: "Active",
    jdChoice: "create",
    jd: null,
    stats: { candidates: 18, avgScore: 8.1, sla: "On Track", riskFlags: 0 },
    candidates: 18,
    shortlisted: 4,
    riskFlag: null,
    riskLevel: null,
    sla: "On Track",
    slaLevel: "success",
    updated: "2024-12-14",
    candidatesList: [
      { id: "cand-201", name: "Emily Zhang", role: "Sr PM @ MetaVerse", email: "emily@metaverse.com", stage: "Interview L1", scores: { resume: 8.5, psych: 7.9, composite: 82 }, verdict: "Go", addedDate: "2024-12-09" },
      { id: "cand-202", name: "David Kim", role: "Product Lead @ Stripe", email: "david@stripe.com", stage: "Screened", scores: { resume: 7.8, psych: 7.2, composite: 75 }, verdict: "Conditional", addedDate: "2024-12-11" },
    ],
  },
  {
    id: "REQ-2024-0045",
    title: "UX Designer",
    level: "Mid",
    location: "Remote",
    department: "Design",
    status: "Active",
    jdChoice: "upload",
    jd: null,
    stats: { candidates: 8, avgScore: 7.2, sla: "On Track", riskFlags: 1 },
    candidates: 8,
    shortlisted: 3,
    riskFlag: "Low pipeline",
    riskLevel: "medium",
    sla: "On Track",
    slaLevel: "success",
    updated: "2025-01-10",
    candidatesList: [],
  },
  {
    id: "REQ-2024-0050",
    title: "Backend Engineer",
    level: "Senior",
    location: "San Francisco, CA",
    department: "Engineering",
    status: "Active",
    jdChoice: "create",
    jd: null,
    stats: { candidates: 0, avgScore: 0, sla: "On Track", riskFlags: 0 },
    candidates: 0,
    shortlisted: 0,
    riskFlag: null,
    riskLevel: null,
    sla: "On Track",
    slaLevel: "success",
    updated: "2025-01-02",
    candidatesList: [],
  },
  {
    id: "REQ-2024-0051",
    title: "Cloud Architect",
    level: "Principal",
    location: "Austin, TX",
    department: "Cloud",
    status: "Active",
    jdChoice: "create",
    jd: null,
    stats: { candidates: 3, avgScore: 6.8, sla: "At Risk", riskFlags: 1 },
    candidates: 3,
    shortlisted: 1,
    riskFlag: "Slow progression",
    riskLevel: "medium",
    sla: "At Risk",
    slaLevel: "warning",
    updated: "2025-01-05",
    candidatesList: [],
  },
  {
    id: "REQ-2024-0052",
    title: "Data Engineer",
    level: "Mid-Senior",
    location: "Remote",
    department: "Data",
    status: "Active",
    jdChoice: "create",
    jd: null,
    stats: { candidates: 12, avgScore: 7.5, sla: "On Track", riskFlags: 0 },
    candidates: 12,
    shortlisted: 3,
    riskFlag: null,
    riskLevel: null,
    sla: "On Track",
    slaLevel: "success",
    updated: "2025-01-07",
    candidatesList: [],
  },
  {
    id: "REQ-2024-0053",
    title: "Frontend Lead",
    level: "Senior",
    location: "Seattle, WA",
    department: "Engineering",
    status: "Active",
    jdChoice: "create",
    jd: null,
    stats: { candidates: 8, avgScore: 8.0, sla: "On Track", riskFlags: 0 },
    candidates: 8,
    shortlisted: 2,
    riskFlag: null,
    riskLevel: null,
    sla: "On Track",
    slaLevel: "success",
    updated: "2025-01-08",
    candidatesList: [],
  },
  {
    id: "REQ-2024-0054",
    title: "DevOps Engineer",
    level: "Senior",
    location: "Chicago, IL",
    department: "Infrastructure",
    status: "Active",
    jdChoice: "create",
    jd: null,
    stats: { candidates: 5, avgScore: 7.1, sla: "At Risk", riskFlags: 1 },
    candidates: 5,
    shortlisted: 1,
    riskFlag: "Compliance lag",
    riskLevel: "medium",
    sla: "At Risk",
    slaLevel: "warning",
    updated: "2025-01-10",
    candidatesList: [],
  },
  {
    id: "REQ-2024-0055",
    title: "Data Analyst",
    level: "Mid",
    location: "Remote",
    department: "Data & Analytics",
    status: "Active",
    jdChoice: "create",
    jd: null,
    stats: { candidates: 15, avgScore: 7.8, sla: "On Track", riskFlags: 0 },
    candidates: 15,
    shortlisted: 4,
    riskFlag: null,
    riskLevel: null,
    sla: "On Track",
    slaLevel: "success",
    updated: "2025-01-12",
    candidatesList: [],
  },
  {
    id: "REQ-2024-0056",
    title: "Marketing Manager",
    level: "Senior",
    location: "New York, NY",
    department: "Marketing",
    status: "Active",
    jdChoice: "create",
    jd: null,
    stats: { candidates: 20, avgScore: 8.2, sla: "On Track", riskFlags: 0 },
    candidates: 20,
    shortlisted: 5,
    riskFlag: null,
    riskLevel: null,
    sla: "On Track",
    slaLevel: "success",
    updated: "2025-01-14",
    candidatesList: [],
  },
  {
    id: "REQ-2024-0057",
    title: "Product Designer",
    level: "Mid-Senior",
    location: "San Francisco, CA",
    department: "Design",
    status: "Active",
    jdChoice: "create",
    jd: null,
    stats: { candidates: 10, avgScore: 7.4, sla: "At Risk", riskFlags: 1 },
    candidates: 10,
    shortlisted: 2,
    riskFlag: "Slowing pipeline",
    riskLevel: "medium",
    sla: "At Risk",
    slaLevel: "warning",
    updated: "2025-01-15",
    candidatesList: [],
  },
  {
    id: "REQ-2024-0058",
    title: "Sales Lead",
    level: "Lead",
    location: "Chicago, IL",
    department: "Sales",
    status: "Active",
    jdChoice: "create",
    jd: null,
    stats: { candidates: 30, avgScore: 8.5, sla: "On Track", riskFlags: 0 },
    candidates: 30,
    shortlisted: 8,
    riskFlag: null,
    riskLevel: null,
    sla: "On Track",
    slaLevel: "success",
    updated: "2025-01-18",
    candidatesList: [],
  },
  {
    id: "REQ-2024-0059",
    title: "HR Specialist",
    level: "Junior-Mid",
    location: "Remote",
    department: "People",
    status: "Active",
    jdChoice: "create",
    jd: null,
    stats: { candidates: 45, avgScore: 7.0, sla: "High Volume", riskFlags: 1 },
    candidates: 45,
    shortlisted: 12,
    riskFlag: "Screening backlog",
    riskLevel: "medium",
    sla: "On Track",
    slaLevel: "success",
    updated: "2025-01-20",
    candidatesList: [],
  },
  {
    id: "REQ-2024-0060",
    title: "Data Scientist",
    level: "Senior",
    location: "Remote",
    department: "Data Science",
    status: "Active",
    jdChoice: "create",
    jd: null,
    stats: { candidates: 18, avgScore: 8.3, sla: "On Track", riskFlags: 0 },
    candidates: 18,
    shortlisted: 6,
    riskFlag: null,
    riskLevel: null,
    sla: "On Track",
    slaLevel: "success",
    updated: "2025-01-22",
    candidatesList: [],
  },
  {
    id: "REQ-2024-0061",
    title: "Mobile Developer (iOS)",
    level: "Senior",
    location: "San Francisco, CA",
    department: "Engineering",
    status: "Active",
    jdChoice: "create",
    jd: null,
    stats: { candidates: 12, avgScore: 7.6, sla: "At Risk", riskFlags: 1 },
    candidates: 12,
    shortlisted: 3,
    riskFlag: "Strong competitors",
    riskLevel: "medium",
    sla: "At Risk",
    slaLevel: "warning",
    updated: "2025-01-24",
    candidatesList: [],
  },
  {
    id: "REQ-2024-0062",
    title: "Finance Analyst",
    level: "Senior",
    location: "Boston, MA",
    department: "Finance",
    status: "Active",
    jdChoice: "create",
    jd: null,
    stats: { candidates: 25, avgScore: 7.9, sla: "On Track", riskFlags: 0 },
    candidates: 25,
    shortlisted: 7,
    riskFlag: null,
    riskLevel: null,
    sla: "On Track",
    slaLevel: "success",
    updated: "2025-01-26",
    candidatesList: [],
  },
  {
    id: "REQ-2024-0063",
    title: "Operations Lead",
    level: "Lead",
    location: "Denver, CO",
    department: "Operations",
    status: "Active",
    jdChoice: "create",
    jd: null,
    stats: { candidates: 14, avgScore: 7.5, sla: "On Track", riskFlags: 0 },
    candidates: 14,
    shortlisted: 4,
    riskFlag: null,
    riskLevel: null,
    sla: "On Track",
    slaLevel: "success",
    updated: "2025-01-28",
    candidatesList: [],
  },
  {
    id: "REQ-2024-0064",
    title: "Customer Success Manager",
    level: "Senior",
    location: "Remote",
    department: "Success",
    status: "Active",
    jdChoice: "create",
    jd: null,
    stats: { candidates: 35, avgScore: 8.1, sla: "On Track", riskFlags: 0 },
    candidates: 35,
    shortlisted: 10,
    riskFlag: null,
    riskLevel: null,
    sla: "On Track",
    slaLevel: "success",
    updated: "2025-01-30",
    candidatesList: [],
  },
];

export function loadPositions(): PositionData[] {
  try {
    const raw = localStorage.getItem(POSITIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { }
  return DEFAULT_POSITIONS;
}

export function savePositions(data: PositionData[]) {
  localStorage.setItem(POSITIONS_KEY, JSON.stringify(data));
}

export function generateReqId() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `REQ-2024-${num}`;
}

export function generateCandidateId() {
  return `cand-${Math.floor(100 + Math.random() * 900)}`;
}

export function generateAIScores(): { scores: CandidateScores; verdict: "Go" | "Conditional" | "No-Go" } {
  const resume = +(6.0 + Math.random() * 3.5).toFixed(1);
  const psych = +(6.0 + Math.random() * 3.0).toFixed(1);
  const composite = Math.round(((resume + psych) / 2) * 10);
  const verdict = composite >= 85 ? "Go" : composite >= 70 ? "Conditional" : "No-Go";
  return { scores: { resume, psych, composite }, verdict };
}

export function createMockJD(title: string): PositionJD {
  return {
    version: 1,
    purpose: `Lead and contribute to ${title} initiatives. Collaborate across teams to deliver high-quality results aligned with organizational goals.`,
    education: [
      "Bachelor's degree in a relevant field",
      "Advanced certifications preferred",
    ],
    experience: [
      "3+ years of relevant professional experience",
      "Demonstrated ability to work in cross-functional teams",
    ],
    responsibilities: [
      "Execute core duties related to the role",
      "Collaborate with stakeholders on project deliverables",
      "Maintain documentation and reporting standards",
      "Contribute to continuous improvement initiatives",
    ],
    skills: ["Communication", "Problem Solving", "Teamwork", "Adaptability"],
  };
}
