import { useState } from "react";

import {
    ArrowLeft,
    Download,
    Mail,
    MapPin,
    Briefcase,
    Clock,
    ChevronRight,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CANDIDATES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface CandidateDetailsViewProps {
    onBack: () => void;
}

const tabs = ["Overview", "Scores", "Timeline", "Raw Data", "Psychometrics", "Interviews", "Reports", "Evidence", "Audit Log"];

export function CandidateDetailsView({ onBack }: CandidateDetailsViewProps) {
    const [activeTab, setActiveTab] = useState("Overview");
    const candidate = CANDIDATES.find(c => c.name === "Emily Johnson") || CANDIDATES[0];

    const getVerdictBadge = (verdict: string) => {
        switch (verdict) {
            case "Go": return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 shadow-none">Go</Badge>;
            case "No-Go": return <Badge className="bg-red-100 text-red-700 border-red-200 shadow-none">No-Go</Badge>;
            case "Conditional": return <Badge className="bg-amber-100 text-amber-700 border-amber-200 shadow-none">Conditional</Badge>;
            case "Pending": return <Badge className="bg-stone-100 text-stone-600 border-stone-200 shadow-none">Pending</Badge>;
            default: return <Badge variant="outline">{verdict}</Badge>;
        }
    };

    return (
        <div className="flex flex-col min-h-full bg-stone-50/50">
            {/* Header */}
            <div className="bg-white border-b border-stone-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Position
                    </button>
                    <Button variant="outline" className="h-9 border-stone-200 gap-2 text-stone-600 font-semibold shadow-sm">
                        <Download className="h-4 w-4" />
                        Download Dossier (ZIP)
                    </Button>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-stone-900">{candidate.name}</h1>
                    <p className="text-sm text-stone-500 font-medium mt-1">
                        REQ-2024-0042 • Senior Software Engineer
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-4 gap-4 mt-8">
                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2">Current Stage</p>
                        <Badge className="bg-red-50 text-red-700 border-red-100 shadow-none px-2 py-0.5">{candidate.stage}</Badge>
                    </div>
                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2">Composite Score</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-red-600">{candidate.compositeScore}</span>
                            <span className="text-sm text-stone-400 font-bold">({candidate.compositePercentage}%)</span>
                        </div>
                    </div>
                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2">Verdict</p>
                        {getVerdictBadge(candidate.verdict)}
                    </div>
                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2">Risk Flags</p>
                        <span className="text-xl font-bold text-stone-900">{candidate.riskFlags.length}</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-stone-200 px-6">
                <div className="flex items-center gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "py-4 text-sm font-medium transition-all relative",
                                activeTab === tab ? "text-primary" : "text-stone-400 hover:text-stone-600"
                            )}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-8 flex-1">
                {activeTab === "Overview" && (
                    <div className="max-w-6xl mx-auto space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Contact Information */}
                            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-stone-900 mb-6">Contact Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-stone-600">
                                        <Mail className="h-4 w-4 text-stone-400" />
                                        <span className="text-sm">{candidate.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-stone-600">
                                        <MapPin className="h-4 w-4 text-stone-400" />
                                        <span className="text-sm">{candidate.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Professional Background */}
                            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-stone-900 mb-6">Professional Background</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-stone-600">
                                        <Briefcase className="h-4 w-4 text-stone-400" />
                                        <span className="text-sm">{candidate.role}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-stone-600">
                                        <Clock className="h-4 w-4 text-stone-400" />
                                        <span className="text-sm">{candidate.experience} experience</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Assessment Summary */}
                        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-stone-900 mb-6">Assessment Summary</h3>
                            <div className="grid grid-cols-5 gap-4">
                                {[
                                    { label: "Resume/JD", score: candidate.resumeScore },
                                    { label: "Psychometric", score: candidate.psychometricScore },
                                    { label: "Interview L1", score: candidate.l1Score },
                                    { label: "Interview L2", score: candidate.l2Score },
                                    { label: "Composite", score: candidate.compositeScore },
                                ].map((item) => (
                                    <div key={item.label} className="bg-stone-50 border border-stone-100 rounded-lg p-3 flex flex-col items-center">
                                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-2">{item.label}</span>
                                        <span className={cn("text-sm font-bold", item.score ? (item.score < 6 ? "text-red-500" : "text-stone-700") : "text-stone-300")}>
                                            {item.score || "—"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Risk Flags */}
                        <div className="bg-red-50/30 border border-red-100 rounded-xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-red-800 mb-4 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Risk Flags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {candidate.riskFlags.map((flag) => (
                                    <Badge key={flag} className="bg-white text-red-600 border-red-100 shadow-sm font-semibold px-3 py-1">
                                        {flag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
