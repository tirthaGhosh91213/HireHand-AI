import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const tabs = ["Branding", "Workflow", "Scoring", "Patterns", "Templates", "Access"];

export function ConfigView() {
    const [activeTab, setActiveTab] = useState("Branding");

    const colorTokens = [
        { label: "Primary Color", hex: "#2F3A2B", description: "Main brand color used for primary actions and sidebar active states." },
        { label: "Secondary Color", hex: "#A6A15A", description: "Accent color used for secondary highlights and data visualization." },
        { label: "Background Color", hex: "#F6F1E6", description: "Main application background color for a warm, enterprise feel." },
        { label: "Accent Color", hex: "#5C6B57", description: "Subtle accent color for borders and muted elements." },
    ];

    return (
        <div className="flex flex-col min-h-full bg-stone-50/50">
            <header className="p-8 bg-white border-b border-stone-200">
                <h1 className="text-2xl font-bold text-stone-900">Configuration</h1>
                <p className="text-sm text-stone-500 font-medium mt-1">Manage system settings and visual branding</p>
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
                {activeTab === "Branding" && (
                    <div className="max-w-4xl space-y-8">
                        <section>
                            <h3 className="text-lg font-bold text-stone-900 mb-6">Branding Tokens</h3>
                            <div className="grid grid-cols-2 gap-6">
                                {colorTokens.map((token) => (
                                    <div key={token.label} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-bold text-stone-900">{token.label}</span>
                                            <div className="h-8 w-8 rounded-full border border-stone-100 shadow-inner" style={{ backgroundColor: token.hex }} />
                                        </div>
                                        <p className="text-xs text-stone-400 font-medium mb-6 leading-relaxed">
                                            {token.description}
                                        </p>
                                        <div className="mt-auto pt-4 border-t border-stone-50">
                                            <div className="flex items-center gap-2">
                                                <Input readOnly value={token.hex} className="h-9 bg-stone-50 border-stone-100 text-xs font-mono font-bold text-stone-600 focus-visible:ring-primary/10" />
                                                <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 border-stone-100 bg-white">
                                                    <Copy className="h-3.5 w-3.5 text-stone-400" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
