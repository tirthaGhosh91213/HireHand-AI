import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  UserPlus,
  Users,
  Target,
  ShieldCheck,
  AlertTriangle,
  Briefcase,
  GraduationCap,
  Clock,
  Star,
  FileText,
  Brain,
  Video,
  Package,
  Lock,
  FolderOpen,
  Settings,
  Edit3,
  Upload,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PositionData, PositionJD, CandidateData, loadPositions, savePositions } from "@/types/positions";
import { CandidatesTab } from "@/components/dashboard/CandidatesTab";

const TABS = [
  { id: "overview", label: "Overview", icon: Briefcase },
  { id: "jd", label: "JD", icon: FileText },
  { id: "candidates", label: "Candidates", icon: Users },
  { id: "psychometrics", label: "Psychometrics", icon: Brain },
  { id: "interviews", label: "Interviews", icon: Video },
  { id: "decision-pack", label: "Decision Pack", icon: Package },
  { id: "integrity", label: "Integrity", icon: Lock },
  { id: "evidence", label: "Evidence", icon: FolderOpen },
  { id: "settings", label: "Settings", icon: Settings },
];

interface PositionDetailProps {
  positionId: string;
  onBack: () => void;
}

export function PositionDetail({ positionId, onBack }: PositionDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [positions, setPositions] = useState(() => loadPositions());

  const position = useMemo(() => {
    return positions.find((p) => p.id === positionId) || null;
  }, [positionId, positions]);

  const handleJDSaved = useCallback((jd: PositionJD) => {
    setPositions((prev) => {
      const updated = prev.map((p) => p.id === positionId ? { ...p, jd, jdChoice: "create" as const } : p);
      savePositions(updated);
      return updated;
    });
  }, [positionId]);

  const handleAddCandidate = useCallback((candidate: CandidateData) => {
    setPositions((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== positionId) return p;
        const list = [...(p.candidatesList || []), candidate];
        return { ...p, candidatesList: list, candidates: list.length, stats: { ...p.stats, candidates: list.length } };
      });
      savePositions(updated);
      return updated;
    });
  }, [positionId]);

  if (!position) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Position not found.</p>
        <Button variant="ghost" onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Positions
        </Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground font-display">{position.title}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="outline" className="text-xs font-mono border-border/50">{position.id}</Badge>
              <span className="text-sm text-muted-foreground">{position.location}</span>
              <span className="text-sm text-muted-foreground">• {position.department}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-12 sm:ml-0">
          <Button variant="outline" size="sm" className="border-border/50">
            <Download className="h-4 w-4 mr-1" /> Board Pack
          </Button>
          <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => setActiveTab("candidates")}>
            <UserPlus className="h-4 w-4 mr-1" /> Add Candidate
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-primary/15 text-primary glow-sm font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.id === "candidates" && (
              <Badge className="ml-1 h-5 px-1.5 text-[10px] bg-primary/20 text-primary border-0">{position.stats.candidates}</Badge>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <OverviewTab position={position} />}
      {activeTab === "jd" && <JDTab position={position} onJDSaved={handleJDSaved} />}
      {activeTab === "candidates" && (
        <CandidatesTab candidates={position.candidatesList || []} onAddCandidate={handleAddCandidate} />
      )}
      {!["overview", "jd", "candidates"].includes(activeTab) && (
        <Card className="glass-strong">
          <CardContent className="p-12 text-center">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-muted mb-4">
              {TABS.find((t) => t.id === activeTab)?.icon && (
                (() => { const Icon = TABS.find((t) => t.id === activeTab)!.icon; return <Icon className="h-7 w-7 text-muted-foreground" />; })()
              )}
            </div>
            <p className="text-lg font-semibold text-foreground font-display capitalize">{activeTab.replace("-", " ")}</p>
            <p className="text-sm text-muted-foreground mt-1">This section is coming soon.</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

function OverviewTab({ position }: { position: PositionData }) {
  const stats = [
    { label: "Total Candidates", value: position.stats.candidates, icon: Users, color: "text-primary" },
    { label: "Avg Composite Score", value: position.stats.avgScore.toFixed(1), icon: Target, color: "text-emerald-400" },
    { label: "SLA Status", value: position.stats.sla, icon: ShieldCheck, color: position.stats.sla === "On Track" ? "text-emerald-400" : "text-yellow-400" },
    { label: "Risk Flags", value: position.stats.riskFlags, icon: AlertTriangle, color: position.stats.riskFlags > 0 ? "text-red-400" : "text-emerald-400" },
  ];

  const funnel = [
    { stage: "Sourced", count: position.stats.candidates, pct: 100 },
    { stage: "Psychometrics", count: Math.round(position.stats.candidates * 0.6), pct: 60 },
    { stage: "Interview", count: Math.round(position.stats.candidates * 0.3), pct: 30 },
    { stage: "Offer", count: Math.round(position.stats.candidates * 0.1), pct: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="glass-strong">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
              <p className="text-2xl font-bold font-display text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Funnel */}
      <Card className="glass-strong">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-6 font-display">Pipeline Funnel</h3>
          <div className="space-y-4">
            {funnel.map((f) => (
              <div key={f.stage} className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-28 shrink-0">{f.stage}</span>
                <div className="flex-1 h-8 rounded-lg bg-muted/50 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${f.pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-lg gradient-primary flex items-center justify-end pr-3"
                  >
                    <span className="text-xs font-bold text-primary-foreground">{f.count}</span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function JDTab({ position, onJDSaved }: { position: PositionData; onJDSaved: (jd: PositionJD) => void }) {
  const [jdView, setJdView] = useState<"choice" | "paste">("choice");
  const [jdText, setJdText] = useState("");

  const handleSaveJD = () => {
    if (!jdText.trim()) return;
    const newJD: PositionJD = {
      purpose: jdText.trim(),
      education: ["As described in the job description"],
      experience: ["As described in the job description"],
      responsibilities: ["As described in the job description"],
      skills: ["See full JD for details"],
    };
    onJDSaved(newJD);
  };

  // No JD — show choice or paste view
  if (!position.jd) {
    if (jdView === "paste") {
      return (
        <Card className="glass-strong">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Edit3 className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground font-display">Paste Job Description</h3>
            </div>
            <Textarea
              placeholder="Paste your full job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="min-h-[250px] bg-background/50 border-border/50 focus:border-primary text-sm text-foreground placeholder:text-muted-foreground resize-none"
            />
            <div className="flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setJdView("choice")}>Back</Button>
              <Button
                onClick={handleSaveJD}
                disabled={!jdText.trim()}
                className="gradient-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Generate & Save
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Choice view
    return (
      <Card className="glass-strong">
        <CardContent className="p-12">
          <div className="text-center mb-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold text-foreground font-display">No Job Description Yet</p>
            <p className="text-sm text-muted-foreground mt-1">Choose how you'd like to add one.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <button
              onClick={() => setJdView("paste")}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-primary group-hover:glow-sm transition-all">
                <Edit3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-sm">Paste JD</p>
                <p className="text-xs text-muted-foreground mt-1">Write or paste text</p>
              </div>
            </button>
            <button
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted group-hover:bg-muted/80 transition-all">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-sm">Upload JD</p>
                <p className="text-xs text-muted-foreground mt-1">Upload a document</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // JD exists — render it
  const jd = position.jd;

  return (
    <div className="space-y-6">
      {/* Role Purpose */}
      <Card className="glass-strong">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground font-display">Role Purpose</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{jd.purpose}</p>
        </CardContent>
      </Card>

      {/* Education & Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass-strong">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground font-display">Education</h3>
            </div>
            <ul className="space-y-2">
              {jd.education.map((e, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1.5 shrink-0">•</span> {e}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="glass-strong">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground font-display">Experience</h3>
            </div>
            <ul className="space-y-2">
              {jd.experience.map((e, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1.5 shrink-0">•</span> {e}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Responsibilities */}
      <Card className="glass-strong">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground font-display">Key Responsibilities</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {jd.responsibilities.map((r, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                <span className="text-primary font-bold text-sm shrink-0">{i + 1}.</span>
                <p className="text-sm text-muted-foreground">{r}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="glass-strong">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground font-display">Good-to-Have Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {jd.skills.map((s) => (
              <Badge key={s} variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                {s}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
