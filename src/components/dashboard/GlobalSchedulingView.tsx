import { Calendar, Clock, Video, User, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SCHEDULED_INTERVIEWS } from "@/lib/mock-data";

export function GlobalSchedulingView() {
    return (
        <div className="flex min-h-full bg-stone-50/50">
            <div className="flex-1 p-8">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-stone-900">Scheduling</h1>
                    <p className="text-sm text-stone-500 font-medium mt-1">Interview scheduling and calendar</p>
                </header>

                <section className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-stone-900" />
                        <h2 className="text-lg font-bold text-stone-900">Upcoming Interviews</h2>
                    </div>

                    <div className="space-y-4">
                        {SCHEDULED_INTERVIEWS.map((interview) => (
                            <div
                                key={interview.id}
                                className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm hover:border-primary/20 transition-all group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <Video className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-stone-900">{interview.candidateName}</h3>
                                            <p className="text-[11px] text-stone-400 font-bold uppercase tracking-tight mt-0.5">{interview.round}</p>
                                            <div className="flex items-center gap-3 mt-3">
                                                <div className="flex items-center gap-1.5 text-[11px] text-stone-600 font-semibold">
                                                    <User className="h-3.5 w-3.5 text-stone-400" />
                                                    {interview.interviewers.join(", ")}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1.5 text-[11px] text-stone-600 font-bold">
                                            <Clock className="h-3.5 w-3.5 text-stone-400" />
                                            {interview.date}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Quick Actions Sidebar */}
            <aside className="w-80 border-l border-stone-200 bg-white p-8 space-y-8">
                <div>
                    <h3 className="text-sm font-bold text-stone-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Button className="w-full justify-start gap-3 bg-stone-100 hover:bg-stone-200 text-stone-900 border-none h-11 rounded-xl font-bold text-sm">
                            <Calendar className="h-4.5 w-4.5 text-stone-500" />
                            Schedule Interview
                        </Button>
                        <Button className="w-full justify-start gap-3 bg-stone-100 hover:bg-stone-200 text-stone-900 border-none h-11 rounded-xl font-bold text-sm">
                            <Settings className="h-4.5 w-4.5 text-stone-500" />
                            Manage Availability
                        </Button>
                    </div>
                </div>
            </aside>
        </div>
    );
}
