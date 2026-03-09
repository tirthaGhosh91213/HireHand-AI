import { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown, ChevronRight, FileText, Download, Users, Mail, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CANDIDATES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const tabs = ["Overview", "JD", "Candidates", "Psychometrics", "Interviews", "Decision Pack", "Integrity", "Evidence", "Settings"];

const STAGE_COLORS: Record<string, string> = {
    "Interview L2": "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    "Interview L1": "bg-purple-500/10 text-purple-500 border-purple-500/20",
    "Psychometrics": "bg-amber-500/10 text-amber-500 border-amber-500/20",
    "Screened": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "Rejected": "bg-red-500/10 text-red-500 border-red-500/20",
    "Sourced": "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
};

const VERDICT_COLORS: Record<string, string> = {
    "Go": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "No-Go": "bg-red-500/10 text-red-500 border-red-500/20",
    "Conditional": "bg-amber-500/10 text-amber-500 border-amber-500/20",
    "Pending": "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
    "Screened": "bg-[#4F46E5]/10 text-[#4F46E5] border-[#4F46E5]/20",
};

const MatchOrb = ({ score }: { score: number }) => {
    const color = score >= 85 ? "from-emerald-400 to-emerald-600" : score >= 70 ? "from-amber-400 to-amber-600" : "from-red-400 to-red-600";
    return (
        <div className="flex items-center gap-3">
            <div className={cn("h-3 w-3 rounded-full bg-gradient-to-tr shadow-sm ring-1 ring-white/20", color)} />
            <span className="text-sm font-black font-mono tracking-tighter text-foreground">{score}%</span>
        </div>
    );
};

interface CandidatesListViewProps {
    onSelectCandidate: (id: string) => void;
    onSwitchTab: (tab: string) => void;
    onAddCandidate?: () => void;
}

export function CandidatesListView({ onSelectCandidate, onSwitchTab, onAddCandidate }: CandidatesListViewProps) {
    const [activeTab, setActiveTab] = useState("Candidates");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCandidates = useMemo(() =>
        CANDIDATES.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.role.toLowerCase().includes(searchQuery.toLowerCase())
        ), [searchQuery]
    );

    return (
        <div className="flex flex-col min-h-screen bg-[#fcfcfd] dark:bg-zinc-950 no-scrollbar">
            {/* Sub tabs - Grate Glass Header */}
            <div className="px-4 md:px-12 pt-8 border-b border-border/5 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-3xl sticky top-0 z-20">
                <div className="flex items-center gap-8 md:gap-12 mb-[-1px] overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                onSwitchTab(tab);
                            }}
                            className={cn(
                                "pb-6 text-[11px] md:text-[13px] font-black uppercase tracking-[0.15em] transition-all relative whitespace-nowrap",
                                activeTab === tab ? "text-[#4F46E5]" : "text-muted-foreground/50 hover:text-foreground"
                            )}
                        >
                            {tab}
                            {tab === "Candidates" && (
                                <span className="ml-2.5 px-2 py-0.5 rounded-md bg-[#4F46E5]/10 text-[9px] md:text-[10px] text-[#4F46E5] font-black tracking-normal">
                                    {CANDIDATES.length}
                                </span>
                            )}
                            {activeTab === tab && (
                                <motion.div layoutId="activeTabMain" className="absolute bottom-0 left-0 right-0 h-1 bg-[#4F46E5] rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="px-4 md:px-12 py-10 w-full max-w-[1600px] mx-auto space-y-8">
                {/* Search & Action Row */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 w-full lg:max-w-2xl bg-white dark:bg-zinc-900/50 p-2 rounded-2xl border border-border/10 shadow-sm focus-within:shadow-md focus-within:border-primary/20 transition-all">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-800 text-muted-foreground/40">
                            <Search className="h-5 w-5" />
                        </div>
                        <Input
                            placeholder="Search high-potential talent..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border-none bg-transparent focus-visible:ring-0 text-base placeholder:text-muted-foreground/30 h-10 shadow-none px-2"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <Button variant="outline" className="h-12 px-6 rounded-2xl border-border/10 font-bold text-xs uppercase tracking-widest gap-2 flex-1 lg:flex-none">
                            <Filter className="h-4 w-4" /> Filter
                        </Button>
                        <Button variant="outline" className="h-12 px-6 rounded-2xl border-border/10 font-bold text-xs uppercase tracking-widest gap-2 flex-1 lg:flex-none">
                            <ArrowUpDown className="h-4 w-4" /> Sort
                        </Button>
                    </div>
                </div>

                {/* Main Data View */}
                <Card className="rounded-[2.5rem] border border-border/10 shadow-2xl overflow-hidden bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-zinc-50/40 dark:bg-zinc-900/40 border-b border-border/5">
                                    <th className="px-8 py-5 text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.25em]">Candidate Profile</th>
                                    <th className="px-8 py-5 text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.25em]">Pipeline Stage</th>
                                    <th className="px-8 py-5 text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.25em] text-center">Scores</th>
                                    <th className="px-8 py-5 text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.25em] bg-primary/[0.03]">Match index</th>
                                    <th className="px-8 py-5 text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.25em]">Health</th>
                                    <th className="px-8 py-5 text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.25em]">Verdict</th>
                                    <th className="px-8 py-5 w-20"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/[0.03]">
                                <AnimatePresence mode="popLayout">
                                    {filteredCandidates.map((candidate) => (
                                        <motion.tr
                                            key={candidate.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            whileHover={{ backgroundColor: "rgba(79, 70, 229, 0.03)" }}
                                            className="group cursor-pointer transition-colors duration-200 border-l-4 border-transparent hover:border-primary"
                                            onClick={() => onSelectCandidate(candidate.id)}
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="relative shrink-0">
                                                        <div className="h-16 w-16 rounded-[1.25rem] bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center font-black text-primary text-xl shadow-inner border border-border/5 transition-transform group-hover:scale-105 duration-500">
                                                            {candidate.name.charAt(0)}
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-zinc-950 bg-emerald-500 shadow-lg" />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-3">
                                                            {candidate.name}
                                                            <div className="h-1 w-1 rounded-full bg-border" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{candidate.experience || "Exp"}</span>
                                                        </span>
                                                        <span className="text-[13px] text-muted-foreground/70 font-medium mt-1 truncate max-w-[240px] tracking-tight">{candidate.role}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge variant="outline" className={cn("shadow-none border-border/10 font-bold text-[10px] px-3 py-1.5 rounded-lg", STAGE_COLORS[candidate.stage] || STAGE_COLORS["Sourced"])}>
                                                    {candidate.stage}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex gap-2">
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-tighter">RSM</span>
                                                            <span className="text-sm font-black font-mono tracking-tighter">{candidate.resumeScore}</span>
                                                        </div>
                                                        <div className="w-[1px] h-8 bg-border/10 self-center" />
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-tighter">PSY</span>
                                                            <span className="text-sm font-black font-mono tracking-tighter">{candidate.psychometricScore || "—"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 bg-primary/[0.01] group-hover:bg-primary/[0.03] transition-colors">
                                                <div className="flex justify-center">
                                                    <MatchOrb score={candidate.compositeScore} />
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-2 w-36">
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Engagement</span>
                                                        <span className="text-[11px] font-black font-mono text-emerald-500">85%</span>
                                                    </div>
                                                    <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800/50 overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: "85%" }}
                                                            className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge variant="outline" className={cn("text-[10px] font-black rounded-lg border-none", VERDICT_COLORS[candidate.verdict])}>
                                                    {candidate.verdict}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="h-12 w-12 rounded-[1rem] flex items-center justify-center text-muted-foreground/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300">
                                                    <ChevronRight className="h-6 w-6" />
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
