import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from "recharts";
import { TrendingUp } from "lucide-react";
import { ANALYTICS_DATA } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const COLORS = ["#2F3A2B", "#5C6B57", "#8A9C84", "#A6A15A"];

export function AnalyticsView() {
    return (
        <div className="p-8 space-y-8 bg-stone-50/50 min-h-full">
            <header>
                <h1 className="text-2xl font-bold text-stone-900">Analytics</h1>
                <p className="text-sm text-stone-500 font-medium mt-1">Org-wide hiring metrics & insights</p>
            </header>

            {/* KPI Row */}
            <div className="grid grid-cols-4 gap-4">
                {ANALYTICS_DATA.kpis.map((kpi) => (
                    <div key={kpi.label} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-stone-50 flex items-center justify-center">
                                <kpi.icon className="h-5 w-5 text-stone-400" />
                            </div>
                            {kpi.trend.startsWith("+") && <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <TrendingUp className="h-4 w-4" />
                            </div>}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-stone-900 leading-none">{kpi.value}</span>
                            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mt-2">{kpi.label}</span>
                            <span className={cn(
                                "text-[10px] font-bold mt-1",
                                kpi.trend.includes("improvement") || kpi.trend.includes("vs last") ? "text-emerald-600" : "text-stone-400"
                            )}>
                                {kpi.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-2 gap-6 pb-8">
                {/* Hiring Funnel */}
                <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm h-[400px] flex flex-col">
                    <h3 className="text-lg font-bold text-stone-900 mb-8">Hiring Funnel</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={ANALYTICS_DATA.funnel}
                                margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="stage"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontWeight: 600, fill: "#6B7280" }}
                                />
                                <Tooltip
                                    cursor={{ fill: "#F9FAFB" }}
                                    contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#2F3A2B"
                                    radius={[0, 4, 4, 0]}
                                    barSize={12}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Source Distribution */}
                <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm h-[400px] flex flex-col relative">
                    <h3 className="text-lg font-bold text-stone-900 mb-4">Source Distribution</h3>
                    <div className="flex-1 min-h-0 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ANALYTICS_DATA.sourceDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {ANALYTICS_DATA.sourceDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Legend Overlays */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-12">
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-bold text-stone-900">74%</span>
                                <span className="text-[10px] text-stone-400 font-bold uppercase">LinkedIn/Ref</span>
                            </div>
                        </div>
                        <div className="absolute top-24 right-12 flex flex-col gap-2">
                            {ANALYTICS_DATA.sourceDistribution.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                                    <span className="text-[10px] font-bold text-stone-500 uppercase">{entry.name} {entry.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Hiring Trends */}
                <div className="col-span-2 bg-white border border-stone-200 rounded-2xl p-8 shadow-sm h-[320px] flex flex-col">
                    <h3 className="text-lg font-bold text-stone-900 mb-8">Hiring Trends</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ANALYTICS_DATA.trends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontWeight: 600, fill: "#9CA3AF" }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="volume"
                                    stroke="#2F3A2B"
                                    strokeWidth={2}
                                    dot={{ fill: "#2F3A2B", strokeWidth: 2, r: 3 }}
                                    activeDot={{ r: 5, strokeWidth: 0 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="volume"
                                    data={ANALYTICS_DATA.trends.map(d => ({ ...d, volume: d.volume * 0.8 }))}
                                    stroke="#A6A15A"
                                    strokeWidth={2}
                                    dot={{ fill: "#A6A15A", strokeWidth: 2, r: 3 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}


