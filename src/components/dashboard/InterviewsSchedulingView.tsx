import { ArrowLeft, Plus, Calendar, Clock, FileText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface InterviewsSchedulingViewProps {
    onBack: () => void;
}

export function InterviewsSchedulingView({ onBack }: InterviewsSchedulingViewProps) {
    return (
        <div className="flex flex-col min-h-full bg-stone-50/50 p-8 pt-6">
            <div className="mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm font-medium mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Candidates
                </button>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-900">Interview Scheduling</h1>
                        <p className="text-sm text-stone-500 font-medium mt-1">Manage process and interviewer materials</p>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-semibold shadow-sm rounded-lg">
                        <Plus className="h-4 w-4" />
                        Schedule Interview
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Upcoming Interviews Card */}
                <div className="bg-white border border-stone-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm min-h-[240px]">
                    <div className="bg-stone-50 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="h-6 w-6 text-stone-400" />
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 mb-1">Upcoming Interviews</h3>
                    <p className="text-sm text-stone-500">No upcoming interviews scheduled</p>
                </div>

                {/* Awaiting Scheduling Card */}
                <div className="bg-white border border-stone-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm min-h-[240px]">
                    <div className="bg-stone-50 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                        <Clock className="h-6 w-6 text-stone-400" />
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 mb-1">Awaiting Scheduling</h3>
                    <p className="text-sm text-stone-500 font-medium">All candidates are scheduled</p>
                    <div className="mt-4">
                        <Button variant="ghost" className="text-stone-400 text-sm font-semibold hover:bg-transparent cursor-default">
                            <span className="flex items-center gap-2">
                                <ChevronRight className="h-4 w-4" />
                            </span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Interviewer Kits Information */}
            <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Info className="h-5 w-5 text-stone-400" />
                    <h3 className="text-lg font-bold text-stone-900">Interviewer Kits</h3>
                </div>
                <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                    Each scheduled interview automatically generates an interviewer kit containing:
                </p>
                <ul className="space-y-4">
                    {[
                        "JD summary and key requirements",
                        "Non-negotiables and probe areas",
                        "Scoring rubric and red flags",
                        "Required evidence checklist"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-stone-700 font-medium">
                            <div className="h-1.5 w-1.5 rounded-full bg-stone-300" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function ChevronRight({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}
