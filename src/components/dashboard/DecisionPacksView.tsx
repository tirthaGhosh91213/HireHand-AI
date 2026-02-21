import { Eye, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DECISION_PACKS } from "@/lib/mock-data";

export function DecisionPacksView() {
    return (
        <div className="p-8 space-y-8 bg-stone-50/50 min-h-full">
            <header>
                <h1 className="text-2xl font-bold text-stone-900">Decision Packs</h1>
                <p className="text-sm text-stone-500 font-medium mt-1">Review and download curated hiring dossiers</p>
            </header>

            <div className="flex items-center gap-4 max-w-sm relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input placeholder="Search decision packs..." className="pl-10 h-10 border-stone-200 bg-white" />
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-stone-50/50 border-b border-stone-200">
                            <th className="px-6 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-wider">Candidate</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-wider">Target Role</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-wider text-center">Verdict</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-wider text-center">Composite Score</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-stone-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {DECISION_PACKS.map((pack) => (
                            <tr key={pack.id} className="hover:bg-stone-50/50 transition-colors">
                                <td className="px-6 py-5">
                                    <span className="text-sm font-bold text-stone-900">{pack.candidate}</span>
                                </td>
                                <td className="px-6 py-5 text-sm text-stone-600 font-medium">{pack.role}</td>
                                <td className="px-6 py-5 text-center">
                                    <Badge className={cn(
                                        "shadow-none px-2.5 py-0.5",
                                        pack.verdict === "Go" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                                            pack.verdict === "Conditional" ? "bg-amber-100 text-amber-700 border-amber-200" :
                                                "bg-red-100 text-red-700 border-red-200"
                                    )}>
                                        {pack.verdict}
                                    </Badge>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="text-sm font-bold text-stone-900">{pack.score}</span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-stone-900">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-stone-900">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
