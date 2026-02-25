import { useState, useMemo, useCallback, useRef } from "react";
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
import { cn } from "@/lib/utils";
import { jsPDF } from "jspdf";
import { PositionData, PositionJD, PositionJDVersion, CandidateData, loadPositions, savePositions } from "@/types/positions";
import { enhanceJDContent, generateJDContent } from "@/lib/jdService";
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

  const handleJDSaved = useCallback((jd: PositionJD, versions: PositionJDVersion[]) => {
    setPositions((prev) => {
      const updated = prev.map((p) => p.id === positionId ? {
        ...p,
        jd,
        jdVersions: versions,
        jdChoice: "create" as const,
        updated: new Date().toISOString().split("T")[0]
      } : p);
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
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all duration-200 ${activeTab === tab.id
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



function JDTab({ position, onJDSaved }: { position: PositionData; onJDSaved: (jd: PositionJD, versions: PositionJDVersion[]) => void }) {
  const [jdView, setJdView] = useState<"choice" | "paste">("choice");
  const [jdText, setJdText] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingInitial, setIsGeneratingInitial] = useState(false);
  const [showEnhancePrompt, setShowEnhancePrompt] = useState(false);
  const [enhanceInstructions, setEnhanceInstructions] = useState("");
  const [expandedVersionId, setExpandedVersionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveJD = async () => {
    if (!jdText.trim()) return;
    setIsGeneratingInitial(true);
    try {
      const newJD = await generateJDContent(jdText.trim());

      const initialVersion: PositionJDVersion = {
        id: crypto.randomUUID(),
        version: 1,
        timestamp: new Date().toLocaleString(),
        jd: newJD,
      };

      onJDSaved(newJD, [initialVersion]);
      setJdText("");
    } catch (error) {
      console.error("Failed to generate JD:", error);
    } finally {
      setIsGeneratingInitial(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsGeneratingInitial(true);
    try {
      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
          };
          reader.onerror = (error) => reject(error);
        });
      };

      const base64Data = await fileToBase64(file);

      // Call generation with both filename context and actual file data
      const newJD = await generateJDContent(
        `Job description from uploaded file: ${file.name}`,
        { data: base64Data, mimeType: file.type || "application/pdf" }
      );

      const initialVersion: PositionJDVersion = {
        id: crypto.randomUUID(),
        version: 1,
        timestamp: new Date().toLocaleString(),
        jd: newJD,
      };

      onJDSaved(newJD, [initialVersion]);
    } catch (error) {
      console.error("Failed to process uploaded JD:", error);
    } finally {
      setIsGeneratingInitial(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleEnhance = async () => {
    if (!position.jd) return;
    setIsEnhancing(true);
    setShowEnhancePrompt(false);
    try {
      const enhanced = await enhanceJDContent(position.jd, enhanceInstructions);
      const newVersion: PositionJDVersion = {
        id: crypto.randomUUID(),
        version: enhanced.version || (position.jd.version + 1),
        timestamp: new Date().toLocaleString(),
        jd: enhanced,
      };

      const updatedVersions = [newVersion, ...(position.jdVersions || [])];
      onJDSaved(enhanced, updatedVersions);
      setExpandedVersionId(newVersion.id);
      setEnhanceInstructions("");
    } catch (error) {
      console.error("Failed to enhance JD:", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleDownloadPDF = (jd: PositionJD) => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    doc.setFontSize(22);
    doc.text(`${position.title} - Job Description`, margin, y);
    y += 15;

    doc.setFontSize(12);
    doc.text(`Version: ${jd.version || 1}`, margin, y);
    y += 10;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Role Purpose", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const purposeLines = doc.splitTextToSize(jd.purpose, 170);
    doc.text(purposeLines, margin, y);
    y += (purposeLines.length * 6) + 10;

    const sections = [
      { title: "Education", items: jd.education },
      { title: "Experience", items: jd.experience },
      { title: "Key Responsibilities", items: jd.responsibilities },
      { title: "Good-to-Have Skills", items: jd.skills },
    ];

    sections.forEach((section) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(section.title, margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      section.items.forEach((item) => {
        const itemLines = doc.splitTextToSize(`• ${item}`, 170);
        doc.text(itemLines, margin, y);
        y += (itemLines.length * 6);
      });
      y += 10;
    });

    doc.save(`${position.title.replace(/\s+/g, "_")}_JD_v${jd.version || 1}.pdf`);
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
                disabled={!jdText.trim() || isGeneratingInitial}
                className="gradient-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 min-w-[140px]"
              >
                {isGeneratingInitial ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Save & Finalize
                  </>
                )}
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
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
            />
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
              onClick={() => fileInputRef.current?.click()}
              disabled={isGeneratingInitial}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group disabled:opacity-50"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted group-hover:bg-muted/80 transition-all">
                {isGeneratingInitial ? (
                  <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-sm">
                  {isGeneratingInitial ? "Processing..." : "Upload JD"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Upload a document</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // JD exists — render it
  // Ensure we have at least one version for rendering if jd exists
  const versions = position.jd
    ? (position.jdVersions && position.jdVersions.length > 0
      ? position.jdVersions
      : [{
        id: "v1-init",
        version: position.jd.version || 1,
        timestamp: "Initial Version",
        jd: position.jd
      }])
    : [];

  const currentJD = position.jd;

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">JD Versions</h2>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownloadPDF(currentJD)}
            className="border-border/50 text-xs gap-2"
          >
            <Download className="h-3.5 w-3.5" /> Download PDF
          </Button>
          <Button
            size="sm"
            onClick={() => setShowEnhancePrompt(true)}
            disabled={isEnhancing}
            className="gradient-primary text-primary-foreground text-xs gap-2"
          >
            {isEnhancing ? (
              <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Edit3 className="h-3.5 w-3.5" />
            )}
            Refine JD
          </Button>
        </div>
      </div>

      {/* Enhancement Prompt Overlay */}
      {showEnhancePrompt && (
        <Card className="glass-strong border-primary/30 ring-1 ring-primary/20 animate-in fade-in slide-in-from-top-4 duration-300">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground font-display">How should I refine it?</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowEnhancePrompt(false)} className="h-8 w-8 p-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              placeholder="e.g., 'Make it more focused on cloud architecture' or 'Add a section about team leadership'..."
              value={enhanceInstructions}
              onChange={(e) => setEnhanceInstructions(e.target.value)}
              className="min-h-[80px] text-xs bg-background/50 border-border/50"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowEnhancePrompt(false)} className="text-xs">Cancel</Button>
              <Button size="sm" onClick={handleEnhance} className="gradient-primary text-xs h-9 px-4">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modern Versioned Display */}
      <div className="space-y-4">
        {versions.map((ver, idx) => {
          const isLatest = idx === 0;
          const isExpanded = expandedVersionId === ver.id || (isLatest && expandedVersionId === null);
          const jdValue = ver.jd;

          return (
            <Card key={ver.id} className={cn(
              "glass-strong transition-all duration-300 overflow-hidden",
              isExpanded ? "ring-2 ring-primary/20 shadow-lg" : "hover:bg-muted/30 cursor-pointer"
            )} onClick={() => !isExpanded && setExpandedVersionId(ver.id)}>
              <CardContent className="p-0">
                {/* Version Header Bar */}
                <div className={cn(
                  "flex items-center justify-between px-6 py-4 border-b border-border/5",
                  isExpanded ? "bg-primary/5" : "bg-transparent"
                )}>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold",
                      isLatest ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      V{ver.version}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {idx === 0 ? "Current Version" : `Version ${ver.version}`}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{ver.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isExpanded && (
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider h-5 px-2 bg-background/50">Minimized</Badge>
                    )}
                    {isExpanded && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setExpandedVersionId(null); }}>
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                <motion.div
                  initial={false}
                  animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 space-y-6">
                    {/* Role Purpose */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold text-foreground font-display">Role Purpose</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{jdValue.purpose}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Education */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <h3 className="text-sm font-semibold text-foreground font-display">Education</h3>
                        </div>
                        <ul className="space-y-2">
                          {jdValue.education.map((e, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1.5 shrink-0">•</span> {e}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Experience */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <h3 className="text-sm font-semibold text-foreground font-display">Experience</h3>
                        </div>
                        <ul className="space-y-2">
                          {jdValue.experience.map((e, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1.5 shrink-0">•</span> {e}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Responsibilities */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold text-foreground font-display">Key Responsibilities</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {jdValue.responsibilities.map((r, i) => (
                          <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-muted/20 border border-border/10">
                            <span className="text-primary font-bold text-sm shrink-0">{i + 1}.</span>
                            <p className="text-sm text-muted-foreground">{r}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold text-foreground font-display">Good-to-Have Skills</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {jdValue.skills.map((s) => (
                          <Badge key={s} variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs py-1">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
