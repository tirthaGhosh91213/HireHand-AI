export const CANDIDATES = [
  {
      id: "C-1001",
      name: "Emily Johnson",
      role: "Senior Frontend Engineer",
      location: "San Francisco, CA",
      stage: "Offer Extended",
      compositeScore: 9.2,
      compositePercentage: 92,
      verdict: "Go",
      riskFlags: [],
      resumeScore: 9.5,
      psychometricScore: 8.8,
      l1Score: 9.1,
      l2Score: 9.4,
      email: "emily.johnson@example.com",
      experience: "8 Years",
      appliedDate: "2026-02-15",
      avatar: "https://i.pravatar.cc/150?u=emily"
  },
  {
      id: "C-1002",
      name: "Michael Chen",
      role: "Backend Developer",
      location: "Remote",
      stage: "Technical Interview",
      compositeScore: 8.5,
      compositePercentage: 85,
      verdict: "Pending",
      riskFlags: ["Job Hopping"],
      resumeScore: 8.9,
      psychometricScore: 8.0,
      l1Score: 8.6,
      l2Score: null,
      email: "michael.chen@example.com",
      experience: "5 Years",
      appliedDate: "2026-02-18",
      avatar: "https://i.pravatar.cc/150?u=michael"
  },
  {
      id: "C-1003",
      name: "Sarah Williams",
      role: "Product Manager",
      location: "New York, NY",
      stage: "Initial Screening",
      compositeScore: 7.8,
      compositePercentage: 78,
      verdict: "Review",
      riskFlags: [],
      resumeScore: 8.2,
      psychometricScore: 8.5,
      l1Score: null,
      l2Score: null,
      email: "sarah.w@example.com",
      experience: "6 Years",
      appliedDate: "2026-03-01",
      avatar: "https://i.pravatar.cc/150?u=sarah"
  }
];

export const ANALYTICS_DATA = {
  trends: [
      { month: "Jan", volume: 120 },
      { month: "Feb", volume: 150 },
      { month: "Mar", volume: 180 },
      { month: "Apr", volume: 220 },
      { month: "May", volume: 210 },
      { month: "Jun", volume: 250 }
  ],
  funnel: [
      { stage: "Applied", count: 800 },
      { stage: "Screened", count: 350 },
      { stage: "Interviewed", count: 120 },
      { stage: "Offered", count: 40 },
      { stage: "Hired", count: 25 }
  ],
  sourceMetrics: [
      { source: "Referral", hires: 12, quality: 9.1 },
      { source: "LinkedIn", hires: 8, quality: 8.5 },
      { source: "Direct", hires: 5, quality: 8.2 }
  ]
};

export const AUDIT_LOGS = [
  {
      id: "AL-1",
      user: "System AI",
      activity: "Auto-rejected 15 unqualified candidates for Backend Role",
      time: "10 mins ago",
      type: "Automated Action"
  },
  {
      id: "AL-2",
      user: "System AI",
      activity: "Generated Interview L1 Packet for Emily Johnson",
      time: "2 hours ago",
      type: "Document Generation"
  },
  {
      id: "AL-3",
      user: "Admin",
      activity: "Updated hiring criteria for Product Manager",
      time: "1 day ago",
      type: "Configuration Change"
  }
];

export const GOVERNANCE_SETTINGS = [
  {
      id: "GS-1",
      category: "Bias Mitigation",
      policy: "Blind Screening Enabled",
      status: "Active",
      lastReviewed: "2026-01-10"
  },
  {
      id: "GS-2",
      category: "Data Retention",
      policy: "Purge rejected candidate data after 1 year",
      status: "Active",
      lastReviewed: "2025-11-20"
  }
];

export const OVERRIDES = [
  {
      id: "OV-1",
      candidate: "David Miller",
      role: "Frontend Engineer",
      aiVerdict: "Reject",
      humanVerdict: "Proceed",
      reason: "Strong portfolio overcomes lack of formal degree",
      overriddenBy: "Hiring Manager",
      date: "2026-03-02"
  }
];

export const DECISION_PACKS = [
  {
      id: "DP-1001",
      candidateRef: "C-1001",
      candidateName: "Emily Johnson",
      role: "Senior Frontend Engineer",
      status: "Ready for Review",
      generatedDate: "2026-03-05",
      summary: "Exceptional technical skills. Strong cultural fit.",
      documents: ["Resume Summary", "L1 Interview Notes", "Psychometric Profile"]
  },
  {
      id: "DP-1002",
      candidateRef: "C-1002",
      candidateName: "Michael Chen",
      role: "Backend Developer",
      status: "Compiling",
      generatedDate: "2026-03-08",
      summary: "Solid backend architecture experience. Questionable job longevity.",
      documents: ["Resume Summary", "L1 Interview Notes"]
  }
];

export const SCHEDULED_INTERVIEWS = [
  {
      id: "INT-1",
      candidateName: "Emily Johnson",
      role: "Senior Frontend Engineer",
      interviewer: "Alex Techlead",
      time: "10:00 AM",
      date: "2026-03-10",
      type: "Technical L2",
      status: "Confirmed"
  },
  {
      id: "INT-2",
      candidateName: "Michael Chen",
      role: "Backend Developer",
      interviewer: "Sam Backend",
      time: "2:00 PM",
      date: "2026-03-11",
      type: "System Design",
      status: "Pending"
  }
];
