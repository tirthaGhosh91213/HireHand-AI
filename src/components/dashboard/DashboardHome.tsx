import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  Plus,
  BarChart3,
  Package,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  X,
  FileText,
  Upload,
  ArrowRight,
  CheckCircle2,
  MoreVertical,
  Eye,
  XCircle,
  RotateCcw,
  Pencil,
  Trash2,
  FileEdit,
} from "lucide-react";
import { JDInput } from "./JDInput";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PositionData,
  PositionJD,
  loadPositions,
  savePositions,
  generateReqId,
} from "@/types/positions";
import { generateJDFromInputs, generateJDContent } from "@/lib/jdService";

type ModalStep = "form" | "success" | "paste-jd" | "generate-jd";
type ModalMode = "create" | "edit";

interface DashboardHomeProps {
  onViewPosition: (id: string) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function DashboardHome({ onViewPosition }: DashboardHomeProps) {
  const [positions, setPositions] = useState<PositionData[]>(loadPositions);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>("form");
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createdPosition, setCreatedPosition] = useState<PositionData | null>(null);
  const [form, setForm] = useState({ title: "", bu: "", location: "", level: "Mid" });
  const [statusFilter, setStatusFilter] = useState<"Active" | "Closed">("Active");
  const [jdGenForm, setJdGenForm] = useState({ role: "", level: "", business: "", location: "" });
  const [isGeneratingJD, setIsGeneratingJD] = useState(false);
  const [jdGenError, setJdGenError] = useState<string | null>(null);
  const [isPastingJD, setIsPastingJD] = useState(false);

  useEffect(() => {
    savePositions(positions);
  }, [positions]);

  const filteredPositions = useMemo(() => positions.filter((p) => p.status === statusFilter), [positions, statusFilter]);
  const openCount = useMemo(() => positions.filter((p) => p.status === "Active").length, [positions]);
  const closedCount = useMemo(() => positions.filter((p) => p.status === "Closed").length, [positions]);

  const kpiData = useMemo(() => {
    const totalCandidates = positions.reduce((s, p) => s + p.candidates, 0);
    const totalShortlisted = positions.reduce((s, p) => s + p.shortlisted, 0);
    return [
      { label: "Open Positions", value: String(openCount), icon: Briefcase, sub: "Active roles", trend: null },
      { label: "Total Candidates", value: String(totalCandidates), icon: Users, sub: `${totalShortlisted} shortlisted`, trend: null },
      { label: "Avg Time to Fill", value: "45 days", icon: Clock, sub: "+12%", trend: "up" },
      { label: "Offer Acceptance", value: "82%", icon: CheckCircle, sub: "+5%", trend: "up" },
    ];
  }, [positions, openCount]);

  const handleCreate = () => {
    if (!form.title.trim()) return;
    const today = new Date().toISOString().slice(0, 10);
    const newPos: PositionData = {
      id: generateReqId(),
      title: `${form.level} ${form.title}`.trim(),
      level: form.level,
      location: form.location || "Remote",
      department: form.bu || "General",
      status: "Active",
      jdChoice: null,
      jd: null,
      stats: { candidates: 0, avgScore: 0, sla: "On Track", riskFlags: 0 },
      candidates: 0,
      shortlisted: 0,
      riskFlag: "New Opening",
      riskLevel: "new",
      sla: "On Track",
      slaLevel: "success",
      updated: today,
    };
    setPositions((prev) => [newPos, ...prev]);
    setCreatedPosition(newPos);
    setModalStep("success");
  };

  const handleJDChoice = (choice: "create" | "upload" | "paste") => {
    if (!createdPosition) return;

    if (choice === "paste") {
      setModalStep("paste-jd");
      return;
    }

    if (choice === "create") {
      // Pre-fill the AI generation form from position data
      setJdGenForm({
        role: createdPosition.title,
        level: createdPosition.level,
        business: createdPosition.department,
        location: createdPosition.location,
      });
      setJdGenError(null);
      setModalStep("generate-jd");
      return;
    }

    // upload — just mark choice without a JD for now
    setPositions((prev) =>
      prev.map((p) => (p.id === createdPosition.id ? { ...p, jdChoice: choice, jd: null } : p))
    );
    setCreatedPosition((p) => (p ? { ...p, jdChoice: choice, jd: null } : p));
  };

  const handleGenerateJDWithAI = async () => {
    if (!createdPosition) return;
    setIsGeneratingJD(true);
    setJdGenError(null);
    try {
      const { jd, error } = await generateJDFromInputs(
        jdGenForm.role,
        jdGenForm.level,
        jdGenForm.business,
        jdGenForm.location
      );
      if (error === "API_FAILED") {
        setJdGenError("The AI API key could not be reached. A structured fallback JD has been generated instead. Please check your API key.");
      }
      const updatedJD: PositionJD = { ...jd, version: 1 };
      setPositions((prev) =>
        prev.map((p) => (p.id === createdPosition.id ? { ...p, jdChoice: "create", jd: updatedJD } : p))
      );
      setCreatedPosition((p) => (p ? { ...p, jdChoice: "create", jd: updatedJD } : p));
      if (!error) setModalStep("success");
    } catch {
      setJdGenError("Something went wrong. Please try again.");
    } finally {
      setIsGeneratingJD(false);
    }
  };

  const handleJDPasted = async (jdText: string) => {
    if (!createdPosition) return;
    setIsPastingJD(true);

    // Use AI to properly structure the pasted JD content
    try {
      const structured = await generateJDContent(jdText);
      setPositions((prev) =>
        prev.map((p) => (p.id === createdPosition.id ? { ...p, jdChoice: "paste", jd: structured } : p))
      );
      setCreatedPosition((p) => (p ? { ...p, jdChoice: "paste", jd: structured } : p));
    } catch {
      // Fallback: store raw pasted text in a minimal valid PositionJD
      const fallbackJD: PositionJD = {
        version: 1,
        purpose: jdText,
        education: [],
        experience: [],
        skills: [],
        responsibilities: [],
      };
      setPositions((prev) =>
        prev.map((p) => (p.id === createdPosition.id ? { ...p, jdChoice: "paste", jd: fallbackJD } : p))
      );
      setCreatedPosition((p) => (p ? { ...p, jdChoice: "paste", jd: fallbackJD } : p));
    } finally {
      setIsPastingJD(false);
    }
    setModalStep("success");
  };

  const handleGoToPosition = () => {
    if (createdPosition) {
      onViewPosition(createdPosition.id);
    }
    closeModal();
  };

  const updateStatus = (id: string, newStatus: string) => {
    setPositions((prev) =>
      prev.map((p) => p.id === id ? { ...p, status: newStatus } : p)
    );
  };

  const openCreateModal = () => {
    setModalMode("create");
    setEditingId(null);
    setForm({ title: "", bu: "", location: "", level: "Mid" });
    setModalStep("form");
    setModalOpen(true);
  };

  const openEditModal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const pos = positions.find((p) => p.id === id);
    if (!pos) return;
    setModalMode("edit");
    setEditingId(id);
    setForm({
      title: pos.title,
      bu: pos.department,
      location: pos.location,
      level: pos.level,
    });
    setModalStep("form");
    setModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingId || !form.title.trim()) return;
    setPositions((prev) =>
      prev.map((p) =>
        p.id === editingId
          ? { ...p, title: form.title.trim(), department: form.bu || "General", location: form.location || "Remote", level: form.level, updated: new Date().toISOString().slice(0, 10) }
          : p
      )
    );
    closeModal();
  };

  const deletePosition = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this position? This action cannot be undone.")) return;
    setPositions((prev) => prev.filter((p) => p.id !== id));
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalStep("form");
    setModalMode("create");
    setEditingId(null);
    setCreatedPosition(null);
    setForm({ title: "", bu: "", location: "", level: "Mid" });
    setJdGenForm({ role: "", level: "", business: "", location: "" });
    setJdGenError(null);
    setIsGeneratingJD(false);
    setIsPastingJD(false);
  };

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi) => (
            <motion.div key={kpi.label} variants={item}>
              <Card className="glass-strong hover:glow-sm transition-all duration-300 group">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-primary">
                    <kpi.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground truncate">{kpi.label}</p>
                    <p className="text-2xl font-bold font-display text-foreground">{kpi.value}</p>
                    {kpi.sub && (
                      <span className={`text-xs ${kpi.trend === "up" ? "text-emerald-400" : "text-muted-foreground"} flex items-center gap-1`}>
                        {kpi.trend === "up" && <TrendingUp className="h-3 w-3" />}
                        {kpi.sub}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <h2 className="text-lg font-semibold text-foreground mb-3 font-display">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Create a Position", icon: Plus, desc: "Post a new role", action: () => openCreateModal() },
              { label: "View Analytics", icon: BarChart3, desc: "Hiring insights", action: undefined },
              { label: "Decision Packs", icon: Package, desc: "Review bundles", action: undefined },
            ].map((qa) => (
              <Card key={qa.label} onClick={qa.action} className="glass hover:glow-sm transition-all duration-300 cursor-pointer group">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <qa.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{qa.label}</p>
                    <p className="text-xs text-muted-foreground">{qa.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Positions Table */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground font-display">Positions</h2>
            <div className="flex items-center rounded-lg border border-border/40 overflow-hidden">
              <button
                onClick={() => setStatusFilter("Active")}
                className={`px-4 py-1.5 text-sm font-medium transition-all ${statusFilter === "Active"
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Open ({openCount})
              </button>
              <button
                onClick={() => setStatusFilter("Closed")}
                className={`px-4 py-1.5 text-sm font-medium transition-all ${statusFilter === "Closed"
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Closed ({closedCount})
              </button>
            </div>
          </div>
          <Card className="glass-strong overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium">Req ID</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Role</TableHead>
                  <TableHead className="text-muted-foreground font-medium hidden md:table-cell">BU</TableHead>
                  <TableHead className="text-muted-foreground font-medium hidden lg:table-cell">Location</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-center">Candidates</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-center hidden sm:table-cell">Shortlisted</TableHead>
                  <TableHead className="text-muted-foreground font-medium hidden md:table-cell">Risk Flags</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                  <TableHead className="text-muted-foreground font-medium hidden lg:table-cell">Updated</TableHead>
                  <TableHead className="text-muted-foreground font-medium w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPositions.map((pos) => (
                  <TableRow
                    key={pos.id}
                    onClick={() => onViewPosition(pos.id)}
                    className="border-border/20 hover:bg-primary/5 transition-colors cursor-pointer"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">{pos.id}</TableCell>
                    <TableCell className="font-medium text-foreground">{pos.title}</TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">{pos.department}</TableCell>
                    <TableCell className="text-muted-foreground hidden lg:table-cell">{pos.location}</TableCell>
                    <TableCell className="text-center text-foreground">{pos.candidates}</TableCell>
                    <TableCell className="text-center text-foreground hidden sm:table-cell">{pos.shortlisted}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {pos.riskFlag ? (
                        <Badge variant="outline" className={`text-xs ${pos.riskLevel === "high" ? "border-red-500/50 text-red-400 bg-red-500/10"
                            : pos.riskLevel === "new" ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                              : "border-yellow-500/50 text-yellow-400 bg-yellow-500/10"
                          }`}>
                          {pos.riskLevel !== "new" && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {pos.riskLevel === "new" && <Sparkles className="h-3 w-3 mr-1" />}
                          {pos.riskFlag}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs ${pos.status === "Active"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : "bg-muted text-muted-foreground border-border/50"
                          }`}
                        variant="outline"
                      >
                        {pos.status === "Active" ? "Open" : "Closed"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs hidden lg:table-cell">{pos.updated}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border/50 z-50">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewPosition(pos.id); }}>
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => openEditModal(pos.id, e)}>
                            <Pencil className="h-4 w-4 mr-2" /> Edit Position
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus(pos.id, pos.status === "Active" ? "Closed" : "Active"); }}>
                            {pos.status === "Active" ? (
                              <><XCircle className="h-4 w-4 mr-2" /> Mark as Closed</>
                            ) : (
                              <><RotateCcw className="h-4 w-4 mr-2" /> Re-open Position</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => deletePosition(pos.id, e)} className="text-red-400 focus:text-red-400 focus:bg-red-500/10">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Position
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPositions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No {statusFilter === "Active" ? "open" : "closed"} positions.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </motion.div>
      </motion.div>

      {/* Create Position Modal - 2 Steps */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={closeModal} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-card border border-border/40 rounded-2xl shadow-2xl glow-sm overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {modalStep === "form" ? (
                  <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border/30">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                          {modalMode === "edit" ? <Pencil className="h-5 w-5 text-primary-foreground" /> : <Plus className="h-5 w-5 text-primary-foreground" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground font-display">{modalMode === "edit" ? "Edit Position" : "Create Position"}</h3>
                          <p className="text-xs text-muted-foreground">{modalMode === "edit" ? "Update position details" : "Add a new open role"}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={closeModal} className="rounded-full">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {/* Form */}
                    <div className="p-6 space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Position Title</Label>
                        <Input placeholder="e.g. Software Engineer" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="bg-background/50 border-border/50 focus:border-primary" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Business Unit</Label>
                        <Input placeholder="e.g. Engineering" value={form.bu} onChange={(e) => setForm((f) => ({ ...f, bu: e.target.value }))} className="bg-background/50 border-border/50 focus:border-primary" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Location</Label>
                        <Input placeholder="e.g. San Francisco, CA" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="bg-background/50 border-border/50 focus:border-primary" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Level</Label>
                        <Select value={form.level} onValueChange={(v) => setForm((f) => ({ ...f, level: v }))}>
                          <SelectTrigger className="bg-background/50 border-border/50"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Junior">Junior</SelectItem>
                            <SelectItem value="Mid">Mid</SelectItem>
                            <SelectItem value="Senior">Senior</SelectItem>
                            <SelectItem value="Executive">Executive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-border/30">
                      <Button variant="ghost" onClick={closeModal}>Cancel</Button>
                      {modalMode === "edit" ? (
                        <Button onClick={handleSaveEdit} disabled={!form.title.trim()} className="gradient-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90">
                          <Pencil className="h-4 w-4 mr-1" />
                          Save Changes
                        </Button>
                      ) : (
                        <Button onClick={handleCreate} disabled={!form.title.trim()} className="gradient-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90">
                          <Sparkles className="h-4 w-4 mr-1" />
                          Create Position
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ) : modalStep === "success" ? (
                  <motion.div key="success" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    {/* Success Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border/30">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground font-display">Position Created!</h3>
                          <p className="text-xs text-muted-foreground font-mono">{createdPosition?.id}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={closeModal} className="rounded-full">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* JD Choice */}
                    <div className="p-6 space-y-4">
                      <p className="text-sm text-muted-foreground">What would you like to do next?</p>
                      <div className="grid grid-cols-1 gap-3">
                        <button
                          onClick={() => handleJDChoice("create")}
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${createdPosition?.jdChoice === "create"
                              ? "border-primary bg-primary/10 glow-sm"
                              : "border-border/40 hover:border-primary/50 hover:bg-primary/5"
                            }`}
                        >
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-primary">
                            <Sparkles className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm">Create JD with AI</p>
                            <p className="text-xs text-muted-foreground">Use the Adaptive JD Generator</p>
                          </div>
                          {createdPosition?.jdChoice === "create" && <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />}
                        </button>

                        <button
                          onClick={() => handleJDChoice("upload")}
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${createdPosition?.jdChoice === "upload"
                              ? "border-primary bg-primary/10 glow-sm"
                              : "border-border/40 hover:border-primary/50 hover:bg-primary/5"
                            }`}
                        >
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                            <Upload className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm">Upload JD</p>
                            <p className="text-xs text-muted-foreground">Upload an existing document</p>
                          </div>
                          {createdPosition?.jdChoice === "upload" && <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />}
                        </button>

                        <button
                          onClick={() => handleJDChoice("paste")}
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${createdPosition?.jdChoice === "paste"
                              ? "border-primary bg-primary/10 glow-sm"
                              : "border-border/40 hover:border-primary/50 hover:bg-primary/5"
                            }`}
                        >
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                            <FileEdit className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm">Paste JD</p>
                            <p className="text-xs text-muted-foreground">Manually paste the job description</p>
                          </div>
                          {createdPosition?.jdChoice === "paste" && <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 p-6 border-t border-border/30">
                      <Button variant="ghost" onClick={closeModal}>Skip for now</Button>
                      <Button onClick={handleGoToPosition} className="gradient-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90">
                        Go to Position
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                ) : modalStep === "paste-jd" ? (
                  <motion.div key="paste-jd" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-1">
                    <div className="flex items-center justify-between p-6 border-b border-border/30">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                          <FileEdit className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground font-display">Paste JD</h3>
                          <p className="text-xs text-muted-foreground">Add your job description text</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setModalStep("success")} className="rounded-full">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto">
                      <JDInput onGenerate={handleJDPasted} isGenerating={isPastingJD} />
                    </div>
                  </motion.div>
                ) : (
                  /* Generate JD with AI step */
                  <motion.div key="generate-jd" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <div className="flex items-center justify-between p-6 border-b border-border/30">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                          <Sparkles className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground font-display">Generate JD with AI</h3>
                          <p className="text-xs text-muted-foreground">EOS_IA — 12-section role architecture</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setModalStep("success")} className="rounded-full" disabled={isGeneratingJD}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-6 space-y-4">
                      <p className="text-xs text-muted-foreground">Confirm or edit the details below. AI will generate a comprehensive 12-section job description tailored to this exact role.</p>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Role Title</Label>
                          <Input
                            value={jdGenForm.role}
                            onChange={(e) => setJdGenForm((f) => ({ ...f, role: e.target.value }))}
                            className="bg-background/50 border-border/50 focus:border-primary text-sm"
                            placeholder="e.g. Senior Software Engineer"
                            disabled={isGeneratingJD}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Position / Level</Label>
                          <Input
                            value={jdGenForm.level}
                            onChange={(e) => setJdGenForm((f) => ({ ...f, level: e.target.value }))}
                            className="bg-background/50 border-border/50 focus:border-primary text-sm"
                            placeholder="e.g. Senior, Lead, Principal"
                            disabled={isGeneratingJD}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Business / Department</Label>
                          <Input
                            value={jdGenForm.business}
                            onChange={(e) => setJdGenForm((f) => ({ ...f, business: e.target.value }))}
                            className="bg-background/50 border-border/50 focus:border-primary text-sm"
                            placeholder="e.g. Engineering, Product, Sales"
                            disabled={isGeneratingJD}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Location</Label>
                          <Input
                            value={jdGenForm.location}
                            onChange={(e) => setJdGenForm((f) => ({ ...f, location: e.target.value }))}
                            className="bg-background/50 border-border/50 focus:border-primary text-sm"
                            placeholder="e.g. San Francisco, CA or Remote"
                            disabled={isGeneratingJD}
                          />
                        </div>
                      </div>
                      {jdGenError && (
                        <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-3">
                          <p className="text-xs text-yellow-400 leading-relaxed">{jdGenError}</p>
                          <div className="flex justify-end mt-2">
                            <Button size="sm" variant="ghost" className="text-xs h-7 text-yellow-400" onClick={() => setModalStep("success")}>Continue with fallback JD</Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-border/30">
                      <Button variant="ghost" onClick={() => setModalStep("success")} disabled={isGeneratingJD}>Back</Button>
                      <Button
                        onClick={handleGenerateJDWithAI}
                        disabled={!jdGenForm.role.trim() || isGeneratingJD}
                        className="gradient-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 min-w-[160px]"
                      >
                        {isGeneratingJD ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate JD
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
