import { useState } from "react";
import { Search, Filter, ArrowUpDown, ChevronRight, Eye, Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CANDIDATES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const tabs = ["Overview", "JD", "Candidates", "Psychometrics", "Interviews", "Decision Pack", "Integrity", "Evidence", "Settings"];

interface CandidatesListViewProps {
    onSelectCandidate: (id: string) => void;
    onSwitchTab: (tab: string) => void;
    onAddCandidate?: () => void;
}

export function CandidatesListView({ onSelectCandidate, onSwitchTab, onAddCandidate }: CandidatesListViewProps) {
    const [activeTab, setActiveTab] = useState("Candidates");

    const getVerdictBadge = (verdict: string) => {
        switch (verdict) {
            case "Go": return <Badge className="bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20 shadow-none px-3 py-1 font-bold">Go</Badge>;
            case "No-Go": return <Badge className="bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20 shadow-none px-3 py-1 font-bold">No-Go</Badge>;
            case "Conditional": return <Badge className="bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20 shadow-none px-3 py-1 font-bold">Conditional</Badge>;
            case "Pending": return <Badge className="bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/20 shadow-none px-3 py-1 font-bold">Pending</Badge>;
            case "Screened": return <Badge className="bg-[#4F46E5]/10 text-[#4F46E5] border-[#4F46E5]/20 shadow-none px-3 py-1 font-bold">Screened</Badge>;
            default: return <Badge variant="outline">{verdict}</Badge>;
        }
    };

    const getStageBadge = (stage: string) => {
        const colorMap: Record<string, string> = {
            "Interview L2": "bg-[#4F46E5]/10 text-[#4F46E5] border-[#4F46E5]/20",
            "Interview L1": "bg-[#4F46E5]/10 text-[#4F46E5] border-[#4F46E5]/20",
            "Psychometrics": "bg-amber-500/10 text-amber-500 border-amber-500/20",
            "Screened": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            "Rejected": "bg-red-500/10 text-red-500 border-red-500/20",
        };
        return (
            <Badge className={cn("shadow-none border font-bold px-3 py-1", colorMap[stage] || "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400")}>
                {stage}
            </Badge>
        );
    };

    return (
        <div className="flex flex-col min-h-full bg-[#f8fafc] dark:bg-zinc-950">
            {/* Sub tabs */}
            <div className="px-8 pt-6 border-b border-border/40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-10 mb-[-1px]">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                onSwitchTab(tab);
                            }}
                            className={cn(
                                "pb-5 text-[15px] font-bold transition-all relative whitespace-nowrap",
                                activeTab === tab ? "text-[#4F46E5]" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab}
                            {tab === "Candidates" && (
                                <span className="ml-2 px-2 py-0.5 rounded-lg bg-[#4F46E5]/10 text-[11px] text-[#4F46E5] font-black">
                                    6
                                </span>
                            )}
                            {activeTab === tab && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#4F46E5] rounded-t-full shadow-[0_-2px_8px_rgba(79,70,229,0.4)]" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-10 space-y-8 max-w-[1600px] mx-auto w-full">
                {/* Header & Stats */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground font-display">Active Pipeline</h2>
                        <p className="text-muted-foreground font-medium">Manage and evaluate your leading candidates for the Senior Software Engineer role</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="lg" className="border-border/60 gap-3 h-12 px-6 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 font-bold">
                            <Download className="h-5 w-5" /> Download Report
                        </Button>
                        <Button onClick={onAddCandidate} className="gradient-primary h-12 px-6 rounded-xl text-white font-bold gap-3 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                            <Users className="h-5 w-5" /> Add Candidate
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center justify-between gap-6 bg-white dark:bg-zinc-900/50 p-2 rounded-2xl border border-border/20 shadow-sm">
                    <div className="flex items-center gap-2 flex-1 max-w-xl relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Search by name, skills, or tags..." className="pl-12 h-14 border-none bg-transparent focus-visible:ring-0 text-lg placeholder:text-muted-foreground/50" />
                    </div>
                    <div className="flex items-center gap-2 pr-2">
                        <Button variant="ghost" size="lg" className="text-muted-foreground font-bold gap-3 h-12 px-5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl">
                            <Filter className="h-5 w-5" /> Filter
                        </Button>
                        <Button variant="ghost" size="lg" className="text-muted-foreground font-bold gap-3 h-12 px-5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl">
                            <ArrowUpDown className="h-5 w-5" /> Sort
                        </Button>
                    </div>
                </div>

                {/* Data Table */}
                <Card className="rounded-3xl border border-border/40 shadow-xl overflow-hidden bg-white dark:bg-zinc-950">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-border/40">
                                    <th className="px-8 py-6 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Candidate</th>
                                    <th className="px-8 py-6 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Pipeline Stage</th>
                                    <th className="px-8 py-6 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] text-center">Resume</th>
                                    <th className="px-8 py-6 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] text-center">Psych</th>
                                    <th className="px-8 py-6 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] text-center bg-zinc-100/30 dark:bg-zinc-800/20">Composite</th>
                                    <th className="px-8 py-6 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Last Activity</th>
                                    <th className="px-8 py-6 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Verdict</th>
                                    <th className="px-8 py-6 w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {CANDIDATES.map((candidate) => (
                                    <tr
                                        key={candidate.id}
                                        className="hover:bg-[#4F46E5]/5 cursor-pointer transition-all duration-300 group"
                                        onClick={() => onSelectCandidate(candidate.id)}
                                    >
                                        <td className="px-8 py-7">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center font-bold text-[#4F46E5] text-lg">
                                                    {candidate.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-base font-bold text-foreground group-hover:text-[#4F46E5] transition-colors">{candidate.name}</span>
                                                    <span className="text-[13px] text-muted-foreground font-medium mt-0.5">{candidate.role}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">{getStageBadge(candidate.stage)}</td>
                                        <td className="px-8 py-7 text-center">
                                            <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-black text-sm border border-emerald-500/20">
                                                {candidate.resumeScore}
                                            </div>
                                        </td>
                                        <td className="px-8 py-7 text-center">
                                            {candidate.psychometricScore ? (
                                                <span className="text-base font-bold text-foreground dark:text-zinc-300">{candidate.psychometricScore}</span>
                                            ) : (
                                                <span className="text-muted-foreground/20 text-sm">—</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-7 text-center bg-zinc-50/30 dark:bg-zinc-900/10">
                                            <div className="flex flex-col items-center">
                                                <span className="text-lg font-black text-[#4F46E5]">{candidate.compositeScore}</span>
                                                <span className="text-[11px] text-muted-foreground font-black tracking-tighter uppercase opacity-60">{candidate.compositePercentage}% Match</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-foreground/80 font-bold">{candidate.psychDate || "Pending"}</span>
                                                {candidate.psychDate && <span className="text-[11px] text-[#4F46E5] font-black uppercase tracking-tighter mt-1 leading-none">Verified ✓</span>}
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">{getVerdictBadge(candidate.verdict)}</td>
                                        <td className="px-8 py-7 text-right">
                                            <div className="h-10 w-10 rounded-xl flex items-center justify-center group-hover:bg-[#4F46E5] group-hover:text-white transition-all text-muted-foreground/40">
                                                <ChevronRight className="h-5 w-5" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
