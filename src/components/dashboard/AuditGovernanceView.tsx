import { useState } from "react";
import { Shield, List, ScrollText, CheckCircle2, User, Clock, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AUDIT_LOGS, GOVERNANCE_SETTINGS, OVERRIDES } from "@/lib/mock-data";

const tabs = ["AI Governance", "Audit Log", "Overrides"];

export function AuditGovernanceView() {
    const [activeTab, setActiveTab] = useState("AI Governance");

    return (
        <div className="flex flex-col min-h-full bg-stone-50/50">
            <header className="p-8 bg-white border-b border-stone-200">
                <h1 className="text-2xl font-bold text-stone-900">Audit & Governance</h1>
                <p className="text-sm text-stone-500 font-medium mt-1">Monitor AI decision logic and human oversight</p>
            </header>

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

            <div className="p-8 flex-1">
                {activeTab === "AI Governance" && (
                    <div className="max-w-4xl space-y-6">
                        <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
                            <h3 className="text-sm font-bold text-stone-900 mb-8 border-b border-stone-50 pb-4">Decision Guardrails</h3>
                            <div className="space-y-6">
                                {GOVERNANCE_SETTINGS.map((setting) => (
                                    <div key={setting.id} className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm font-bold text-stone-700">{setting.label}</Label>
                                            <p className="text-[11px] text-stone-400 font-medium">Automatic system behavior based on AI confidence levels.</p>
                                        </div>
                                        <Switch defaultChecked={setting.enabled} className="data-[state=checked]:bg-primary" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
                            <h3 className="text-sm font-bold text-stone-900 mb-6">Confidence & Evidence Requirements</h3>
                            <div className="space-y-4">
                                {[
                                    "Minimum AI confidence of 85% for automated screening",
                                    "Requires multi-modal evidence (Resume + Psychometric)",
                                    "Mandatory human review for all 'Conditional' verdicts"
                                ].map((req, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-stone-50 border border-stone-100 p-3 rounded-xl">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                        <span className="text-xs font-semibold text-stone-600">{req}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Audit Log" && (
                    <div className="max-w-4xl bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="divide-y divide-stone-100">
                            {AUDIT_LOGS.map((log) => (
                                <div key={log.id} className="p-5 flex items-start gap-4 hover:bg-stone-50 transition-colors">
                                    <div className="h-9 w-9 rounded-xl bg-stone-50 flex items-center justify-center shrink-0">
                                        <User className="h-4 w-4 text-stone-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-stone-900">{log.activity}</p>
                                        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                                            <Clock className="h-3 w-3" />
                                            {log.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "Overrides" && (
                    <div className="max-w-4xl space-y-4">
                        {OVERRIDES.map((override) => (
                            <div key={override.id} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-stone-900">{override.candidate}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline" className="text-[10px] font-bold text-stone-400 border-stone-100 shadow-none uppercase">{override.aiVerdict}</Badge>
                                            <span className="text-stone-300">→</span>
                                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 shadow-none text-[10px] font-bold uppercase">{override.humanVerdict}</Badge>
                                        </div>
                                    </div>
                                    <Badge className="bg-amber-50 text-amber-600 border-amber-100 shadow-none font-bold">Manual Override</Badge>
                                </div>
                                <div className="bg-stone-50 border border-stone-100 rounded-xl p-4 flex gap-3">
                                    <AlertTriangle className="h-4 w-4 text-stone-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Human Justification</p>
                                        <p className="text-xs text-stone-600 leading-relaxed font-medium">"{override.justification}"</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
