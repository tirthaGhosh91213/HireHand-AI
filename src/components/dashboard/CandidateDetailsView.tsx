import { useState } from "react";
import {
    ArrowLeft,
    Download,
    Mail,
    MapPin,
    Briefcase,
    Clock,
    ChevronRight,
    AlertCircle,
    User,
    Shield,
    FileText,
    PieChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CANDIDATES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CandidateDetailsViewProps {
    onBack: () => void;
}

const tabs = ["Overview", "Scores", "Timeline", "Raw Data", "Psychometrics", "Interviews", "Reports", "Evidence", "Audit Log"];

const MatchOrb = ({ score, label }: { score: number | string, label: string }) => {
    const numericScore = typeof score === "string" ? parseFloat(score) : score;
    const isAvailable = !isNaN(numericScore);
    const color = isAvailable ? (numericScore >= 8.5 || numericScore >= 85 ? "from-emerald-400 to-emerald-600" : numericScore >= 7.0 || numericScore >= 70 ? "from-amber-400 to-amber-600" : "from-red-400 to-red-600") : "from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700";

    return (
        <div className="flex flex-col items-center gap-2 bg-white/40 dark:bg-zinc-900/40 p-4 rounded-[1.5rem] border border-border/10 backdrop-blur-sm min-w-[100px]">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">{label}</span>
            <div className="flex items-center gap-2">
                {isAvailable && <div className={cn("h-2.5 w-2.5 rounded-full bg-gradient-to-tr shadow-sm", color)} />}
                <span className={cn("text-lg font-black font-mono tracking-tighter", isAvailable ? "text-foreground" : "text-muted-foreground/20")}>
                    {isAvailable ? (numericScore > 10 ? `${numericScore}%` : numericScore.toFixed(1)) : "—"}
                </span>
            </div>
        </div>
    );
};

export function CandidateDetailsView({ onBack }: CandidateDetailsViewProps) {
    const [activeTab, setActiveTab] = useState("Overview");
    const candidate = CANDIDATES.find(c => c.name === "Emily Johnson") || CANDIDATES[0];

    return (
        <div className="flex flex-col min-h-screen bg-[#fcfcfd] dark:bg-zinc-950 no-scrollbar">
            {/* Premium Header */}
            <div className="relative bg-white/60 dark:bg-zinc-950/60 backdrop-blur-3xl border-b border-border/5 p-8 md:p-12 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />

                <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-8 w-full md:w-auto">
                        <motion.button
                            whileHover={{ x: -4 }}
                            onClick={onBack}
                            className="h-14 w-14 rounded-2xl bg-white dark:bg-zinc-900 border border-border/10 shadow-sm flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </motion.button>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-4 mb-1">
                                <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter font-display">
                                    {candidate.name}
                                </h1>
                                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-none px-3 py-1 font-black text-[10px] uppercase tracking-widest rounded-lg">
                                    Active
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground/60 text-[13px] font-bold uppercase tracking-widest">
                                <span>{candidate.role}</span>
                                <div className="h-1 w-1 rounded-full bg-border" />
                                <span>{candidate.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Button variant="outline" className="h-14 px-8 rounded-2xl border-border/10 font-black text-xs uppercase tracking-[0.2em] gap-3 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
                            <Download className="h-5 w-5" /> Download Dossier
                        </Button>
                        <Button className="gradient-primary h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20">
                            Process Next
                        </Button>
                    </div>
                </div>

                {/* KPI High-Density Cards */}
                <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                    <div className="bg-white/40 dark:bg-zinc-900/40 border border-border/10 rounded-[2rem] p-6 backdrop-blur-md shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 mb-3">Workflow State</p>
                        <Badge className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 shadow-none px-3 py-1.5 font-black text-xs rounded-xl">
                            {candidate.stage}
                        </Badge>
                    </div>
                    <div className="bg-white/40 dark:bg-zinc-900/40 border border-border/10 rounded-[2rem] p-6 backdrop-blur-md shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 mb-3">Composite Match</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black font-mono text-primary tracking-tighter">{candidate.compositeScore}</span>
                            <span className="text-sm text-muted-foreground/40 font-black">({candidate.compositePercentage}%)</span>
                        </div>
                    </div>
                    <div className="bg-white/40 dark:bg-zinc-900/40 border border-border/10 rounded-[2rem] p-6 backdrop-blur-md shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 mb-3">Hiring Verdict</p>
                        <span className={cn("text-xs font-black uppercase tracking-[0.15em]", candidate.verdict === "Go" ? "text-emerald-500" : "text-amber-500")}>
                            {candidate.verdict} Decision
                        </span>
                    </div>
                    <div className="bg-white/40 dark:bg-zinc-900/40 border border-border/10 rounded-[2rem] p-6 backdrop-blur-md shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 mb-3">Anomaly Detection</p>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black font-mono text-foreground tracking-tighter">{candidate.riskFlags.length}</span>
                            <span className="text-[10px] font-black uppercase text-red-500 tracking-widest">Flagged</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Tabs Navigation */}
            <div className="bg-white/40 dark:bg-zinc-950/40 backdrop-blur-3xl border-b border-border/5 px-8 md:px-12 sticky top-0 z-30">
                <div className="flex items-center gap-10 md:gap-14 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "py-6 text-[11px] md:text-[13px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap",
                                activeTab === tab ? "text-primary" : "text-muted-foreground/40 hover:text-foreground"
                            )}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="detailTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content View */}
            <div className="p-8 md:p-12 pb-32">
                {activeTab === "Overview" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-[1400px] mx-auto space-y-8"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Unified Identity & Professional Profile */}
                            <Card className="lg:col-span-2 rounded-[2.5rem] border border-border/10 shadow-2xl overflow-hidden bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl p-10">
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-10">
                                        <div>
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-6 flex items-center gap-3">
                                                <User className="h-4 w-4" /> Personal Information
                                            </h3>
                                            <div className="space-y-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">Primary Email</span>
                                                    <p className="text-base font-bold text-foreground">{candidate.email}</p>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">Geo Location</span>
                                                    <p className="text-base font-bold text-foreground">{candidate.location}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-10">
                                        <div>
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-6 flex items-center gap-3">
                                                <Briefcase className="h-4 w-4" /> Professional Matrix
                                            </h3>
                                            <div className="space-y-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">Current Designation</span>
                                                    <p className="text-base font-bold text-foreground">{candidate.role}</p>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">Total Tenure</span>
                                                    <p className="text-base font-bold text-foreground">{candidate.experience} Cumulative</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Risk & Integrity Panel */}
                            <Card className="rounded-[2.5rem] border border-border/10 shadow-2xl overflow-hidden bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl p-10 lg:col-span-1">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500 mb-8 flex items-center gap-3">
                                    <Shield className="h-4 w-4" /> Governance & Risk
                                </h3>
                                <div className="space-y-4">
                                    {candidate.riskFlags.map((flag) => (
                                        <div key={flag} className="flex items-center gap-4 bg-red-500/5 p-4 rounded-2xl border border-red-500/10 group hover:border-red-500/30 transition-all">
                                            <AlertCircle className="h-5 w-5 text-red-500" />
                                            <span className="text-[13px] font-bold text-red-700 dark:text-red-400 tracking-tight">{flag}</span>
                                        </div>
                                    ))}
                                    {candidate.riskFlags.length === 0 && (
                                        <div className="py-12 text-center text-muted-foreground/30 italic text-sm">No significant risks identified</div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Intelligence Scores Grid */}
                        <div className="bg-white dark:bg-zinc-900/50 rounded-[3rem] border border-border/10 p-10 shadow-xl">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-10 flex items-center gap-3">
                                <PieChart className="h-4 w-4" /> AI Attribution Matrix
                            </h3>
                            <div className="flex flex-wrap gap-6 justify-between">
                                <MatchOrb score={candidate.resumeScore} label="Resume Rank" />
                                <MatchOrb score={candidate.psychometricScore || "—"} label="Psych Index" />
                                <MatchOrb score={candidate.l1Score || "—"} label="Technical L1" />
                                <MatchOrb score={candidate.l2Score || "—"} label="Strategy L2" />
                                <MatchOrb score={candidate.compositeScore} label="Global Match" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
