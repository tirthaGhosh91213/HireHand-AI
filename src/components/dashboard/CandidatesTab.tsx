import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Users,
  X,
  Sparkles,
  MoreVertical,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  CandidateData,
  generateCandidateId,
  generateAIScores,
} from "@/types/positions";

const STAGES = ["Sourced", "Screened", "Interview L1", "Interview L2", "Offer"];

const STAGE_COLORS: Record<string, string> = {
  "Sourced": "bg-muted text-muted-foreground border-border/50",
  "Screened": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Interview L1": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "Interview L2": "bg-violet-500/15 text-violet-400 border-violet-500/30",
  "Offer": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Rejected": "bg-red-500/15 text-red-400 border-red-500/30",
};

const VERDICT_COLORS: Record<string, string> = {
  "Go": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Conditional": "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  "No-Go": "bg-red-500/15 text-red-400 border-red-500/30",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function scoreColor(score: number) {
  if (score >= 8.0) return "text-emerald-400";
  if (score >= 7.0) return "text-yellow-400";
  return "text-red-400";
}

interface CandidatesTabProps {
  candidates: CandidateData[];
  onAddCandidate: (candidate: CandidateData) => void;
}

export function CandidatesTab({ candidates, onAddCandidate }: CandidatesTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", email: "", stage: "Sourced" });

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const { scores, verdict } = generateAIScores();
    const newCandidate: CandidateData = {
      id: generateCandidateId(),
      name: form.name.trim(),
      role: form.role.trim() || "Not specified",
      email: form.email.trim(),
      stage: form.stage,
      scores,
      verdict,
      addedDate: new Date().toISOString().slice(0, 10),
    };
    onAddCandidate(newCandidate);
    setForm({ name: "", role: "", email: "", stage: "Sourced" });
    setModalOpen(false);
  };

  if (candidates.length === 0 && !modalOpen) {
    return (
      <>
        <Card className="glass-strong">
          <CardContent className="p-12 text-center">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-muted mb-4">
              <Users className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold text-foreground font-display">No Candidates Yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Add your first candidate to get started.</p>
            <Button onClick={() => setModalOpen(true)} className="gradient-primary text-primary-foreground font-semibold">
              <UserPlus className="h-4 w-4 mr-1" /> Add Candidate
            </Button>
          </CardContent>
        </Card>
        <AddCandidateModal open={modalOpen} form={form} setForm={setForm} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header with count and add button */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="text-foreground font-medium">{candidates.length}</span> candidates
          </p>
          <Button onClick={() => setModalOpen(true)} size="sm" className="gradient-primary text-primary-foreground font-semibold">
            <UserPlus className="h-4 w-4 mr-1" /> Add Candidate
          </Button>
        </div>

        {/* Candidates Table */}
        <Card className="glass-strong overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">Candidate</TableHead>
                <TableHead className="text-muted-foreground font-medium">Current Stage</TableHead>
                <TableHead className="text-muted-foreground font-medium text-center">Resume/JD</TableHead>
                <TableHead className="text-muted-foreground font-medium text-center hidden sm:table-cell">Psychometric</TableHead>
                <TableHead className="text-muted-foreground font-medium text-center hidden md:table-cell">Composite</TableHead>
                <TableHead className="text-muted-foreground font-medium hidden lg:table-cell">Verdict</TableHead>
                <TableHead className="text-muted-foreground font-medium w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((c) => (
                <TableRow key={c.id} className="border-border/20 hover:bg-primary/5 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                          {getInitials(c.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{c.role}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${STAGE_COLORS[c.stage] || STAGE_COLORS["Sourced"]}`}>
                      {c.stage}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`text-sm font-semibold ${scoreColor(c.scores.resume)}`}>
                      {c.scores.resume.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center hidden sm:table-cell">
                    <span className={`text-sm font-semibold ${scoreColor(c.scores.psych)}`}>
                      {c.scores.psych.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    <span className={`text-sm font-bold ${c.scores.composite >= 85 ? "text-emerald-400" : c.scores.composite >= 70 ? "text-yellow-400" : "text-red-400"}`}>
                      {c.scores.composite}%
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="outline" className={`text-xs ${VERDICT_COLORS[c.verdict]}`}>
                      {c.verdict}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border/50 z-50">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" /> View Profile
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <AddCandidateModal open={modalOpen} form={form} setForm={setForm} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} />
    </>
  );
}

interface ModalProps {
  open: boolean;
  form: { name: string; role: string; email: string; stage: string };
  setForm: React.Dispatch<React.SetStateAction<{ name: string; role: string; email: string; stage: string }>>;
  onSubmit: () => void;
  onClose: () => void;
}

function AddCandidateModal({ open, form, setForm, onSubmit, onClose }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-card border border-border/40 rounded-2xl shadow-2xl glow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                  <UserPlus className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground font-display">Add Candidate</h3>
                  <p className="text-xs text-muted-foreground">AI will auto-generate scores</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Full Name</Label>
                <Input
                  placeholder="e.g. Priya Sharma"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Current Role / Company</Label>
                <Input
                  placeholder="e.g. Staff Engineer @ InnovateTech"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Email</Label>
                <Input
                  placeholder="e.g. priya@innovatetech.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Stage</Label>
                <Select value={form.stage} onValueChange={(v) => setForm((f) => ({ ...f, stage: v }))}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/50 z-50">
                    {STAGES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Resume</Label>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border/50 bg-background/30">
                  <div className="text-xs text-muted-foreground">📄 Upload resume (simulated)</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border/30">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button
                onClick={onSubmit}
                disabled={!form.name.trim()}
                className="gradient-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Add & Generate Scores
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}