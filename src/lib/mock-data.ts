import { 
  Users, 
  Briefcase, 
  CalendarDays, 
  BarChart3, 
  Package, 
  Settings, 
  Shield 
} from "lucide-react";

export const CANDIDATES = [
  {
    id: "1",
    name: "James Morrison",
    role: "Senior Developer @ TechCorp Inc.",
    stage: "Interview L2",
    resumeScore: 8.2,
    psychometricScore: 7.8,
    l1Score: 8.0,
    l2Score: null,
    compositeScore: 8.0,
    compositePercentage: 88,
    psychDate: "Jan 18",
    l1Scheduled: "Jan 24",
    l2Scheduled: "Feb 5",
    verdict: "Go",
    email: "james.morrison@techcorp.com",
    experience: "8 years",
    location: "San Francisco, CA",
    riskFlags: [],
  },
  {
    id: "2",
    name: "Priya Sharma",
    role: "Staff Engineer @ InnovateTech",
    stage: "Interview L2",
    resumeScore: 9.1,
    psychometricScore: 8.5,
    l1Score: 8.8,
    l2Score: 9.0,
    compositeScore: 8.9,
    compositePercentage: 92,
    psychDate: "Jan 19",
    l1Scheduled: "Jan 25",
    l2Scheduled: "Feb 1",
    verdict: "Go",
    email: "priya.sharma@innovate.tech",
    experience: "10 years",
    location: "Bangalore, IN",
    riskFlags: [],
  },
  {
    id: "3",
    name: "Michael Chen",
    role: "Lead Developer @ StartupXYZ",
    stage: "Interview L1",
    resumeScore: 7.5,
    psychometricScore: 7.2,
    l1Score: null,
    l2Score: null,
    compositeScore: 7.3,
    compositePercentage: 85,
    psychDate: "Jan 21",
    l1Scheduled: "Feb 6",
    l2Scheduled: null,
    verdict: "Conditional",
    email: "michael.chen@startupxyz.io",
    experience: "6 years",
    location: "Austin, TX",
    riskFlags: ["Culture fit concerns"],
  },
  {
    id: "4",
    name: "Sarah Williams",
    role: "Software Engineer III @ Enterprise Solutions",
    stage: "Psychometrics",
    resumeScore: 7.8,
    psychometricScore: null,
    l1Score: null,
    l2Score: null,
    compositeScore: 7.8,
    compositePercentage: 86,
    psychDate: "Feb 4",
    l1Scheduled: null,
    l2Scheduled: null,
    verdict: "Pending",
    email: "sarah.w@enterprise.com",
    experience: "5 years",
    location: "London, UK",
    riskFlags: [],
  },
  {
    id: "5",
    name: "David Park",
    role: "Senior Software Developer @ Digital Dynamics",
    stage: "Screened",
    resumeScore: 8.0,
    psychometricScore: null,
    l1Score: null,
    l2Score: null,
    compositeScore: 8.0,
    compositePercentage: 89,
    psychDate: null,
    l1Scheduled: null,
    l2Scheduled: null,
    verdict: "Pending",
    email: "david.park@digital.com",
    experience: "7 years",
    location: "Seoul, KR",
    riskFlags: [],
  },
  {
    id: "6",
    name: "Emily Johnson",
    role: "Developer @ WebTech Ltd",
    stage: "Rejected",
    resumeScore: 5.2,
    psychometricScore: null,
    l1Score: null,
    l2Score: null,
    compositeScore: 5.2,
    compositePercentage: 78,
    psychDate: null,
    l1Scheduled: null,
    l2Scheduled: null,
    verdict: "No-Go",
    email: "emily.johnson@email.com",
    experience: "3 years",
    location: "Seattle, WA",
    riskFlags: ["Insufficient experience", "Missing required skills"],
  }
];

export const POSITIONS = [
  {
    id: "REQ-2024-0042",
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    activeCandidates: 6,
  },
  {
    id: "REQ-2024-0035",
    title: "Data Scientist",
    department: "Data & Analytics",
    location: "Austin, TX",
    activeCandidates: 4,
  }
];

export const SCHEDULED_INTERVIEWS = [
  {
    id: "int-1",
    candidateName: "James Morrison",
    round: "Round L2 Interview",
    date: "Feb 5, 2024 at 2:00 PM",
    interviewers: ["Jennifer Walsh", "Emily Rodriguez"],
  },
  {
    id: "int-2",
    candidateName: "Michael Chen",
    round: "Round L1 Interview",
    date: "Feb 6, 2024 at 10:00 AM",
    interviewers: ["David Kim", "Emily Rodriguez"],
  }
];

export const ANALYTICS_DATA = {
  kpis: [
    { label: "Avg Time to Fill", value: "45 days", trend: "+12% improvement", icon: CalendarDays },
    { label: "Offer Acceptance", value: "82%", trend: "+5% vs last quarter", icon: BarChart3 },
    { label: "Pipeline Conversion", value: "12%", trend: "Sourced → Hired", icon: Settings },
    { label: "Interviewer Rigor", value: "8.2", trend: "Avg score quality", icon: Users },
  ],
  funnel: [
    { stage: "Sourced", count: 156 },
    { stage: "Screened", count: 84 },
    { stage: "Psychometrics", count: 42 },
    { stage: "Interview L1", count: 28 },
    { stage: "Interview L2", count: 18 },
    { stage: "Offer", count: 8 },
    { stage: "Hired", count: 6 },
  ],
  sourceDistribution: [
    { name: "LinkedIn", value: 45 },
    { name: "Referral", value: 25 },
    { name: "Career Site", value: 12 },
    { name: "Indeed", value: 18 },
  ],
  trends: [
    { month: "Sep", volume: 52 },
    { month: "Oct", volume: 48 },
    { month: "Nov", volume: 45 },
    { month: "Dec", volume: 50 },
    { month: "Jan", volume: 42 },
    { month: "Feb", volume: 46 },
  ]
};

export const DECISION_PACKS = [
  { id: "dp-1", candidate: "Priya Sharma", role: "Staff Engineer", verdict: "Go", score: 8.9 },
  { id: "dp-2", candidate: "James Morrison", role: "Senior Developer", verdict: "Go", score: 8.0 },
  { id: "dp-3", candidate: "Michael Chen", role: "Lead Developer", verdict: "Conditional", score: 7.3 },
  { id: "dp-4", candidate: "Emily Johnson", role: "Developer", verdict: "No-Go", score: 5.2 },
];

export const AUDIT_LOGS = [
  { id: "log-1", activity: "Sarah Chen viewed Emily Johnson's profile", time: "2 hours ago" },
  { id: "log-2", activity: "David Kim updated Michael Chen's L1 score", time: "5 hours ago" },
  { id: "log-3", activity: "System scheduled L2 interview for James Morrison", time: "1 day ago" },
  { id: "log-4", activity: "Sarah Chen updated Branding Colors", time: "2 days ago" },
];

export const GOVERNANCE_SETTINGS = [
  { id: "gov-1", label: "AI-Generated JD", enabled: true },
  { id: "gov-2", label: "AI Scoring Suggestions", enabled: true },
  { id: "gov-3", label: "Human-Only Final Decisions", enabled: true },
];

export const OVERRIDES = [
  { 
    id: "ov-1", 
    candidate: "Liam Vance", 
    aiVerdict: "Conditional Go", 
    humanVerdict: "Go", 
    justification: "Candidate showed exceptional domain knowledge in the deep dive session which wasn't fully captured by the psychometric test." 
  }
];
