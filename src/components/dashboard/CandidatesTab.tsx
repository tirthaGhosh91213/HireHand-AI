import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Users,
  X,
  Edit3,
  MoreVertical,
  Eye,
  Search,
  ChevronRight,
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
import { cn } from "@/lib/utils";

const STAGES = ["Sourced", "Screened", "Interview L1", "Interview L2", "Offer"];

const STAGE_COLORS: Record<string, string> = {
  "Sourced": "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
  "Screened": "bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20",
  "Interview L1": "bg-purple-500/10 text-purple-500 dark:text-purple-400 border-purple-500/20",
  "Interview L2": "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/20",
  "Offer": "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20",
  "Rejected": "bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20",
};

const VERDICT_STYLES: Record<string, string> = {
  "Go": "text-emerald-500 dark:text-emerald-400",
  "Conditional": "text-amber-500 dark:text-amber-400",
  "No-Go": "text-red-500 dark:text-red-400",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const MatchOrb = ({ score }: { score: number }) => {
  const color = score >= 85 ? "from-emerald-400 to-emerald-600" : score >= 70 ? "from-amber-400 to-amber-600" : "from-red-400 to-red-600";
  return (
    <div className="flex items-center gap-3">
      <div className={cn("h-2.5 w-2.5 rounded-full bg-gradient-to-tr shadow-sm", color)} />
      <span className="text-sm font-black font-mono tracking-tighter">{score}%</span>
    </div>
  );
};

interface CandidatesTabProps {
  candidates: CandidateData[];
  onAddCandidate: (candidate: CandidateData) => void;
}

export function CandidatesTab({ candidates, onAddCandidate }: CandidatesTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", email: "", stage: "Sourced" });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 dark:bg-zinc-900/40 p-1.5 rounded-2xl border border-border/10 backdrop-blur-md">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <Input
            placeholder="Search candidates by name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-none bg-transparent focus-visible:ring-0 text-sm shadow-none"
          />
        </div>
        <Button onClick={() => setModalOpen(true)} size="sm" className="gradient-primary text-primary-foreground font-bold shadow-indigo-500/20 w-full sm:w-auto px-5 rounded-xl h-10">
          <UserPlus className="h-4 w-4 mr-2" /> Add Candidate
        </Button>
      </div>

      {/* Grate High-Density Table */}
      {filteredCandidates.length === 0 ? (
        <Card className="glass-strong border-dashed">
          <CardContent className="p-16 text-center">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-muted/50 mb-6">
              <Users className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <p className="text-lg font-bold text-foreground font-display">No candidates found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or add a new candidate.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-[2rem] border border-border/10 shadow-2xl overflow-hidden bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/30 dark:bg-zinc-900/30 border-b border-border/5">
                  <th className="px-6 py-4 text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Candidate Detail</th>
                  <th className="px-6 py-4 text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Current Stage</th>
                  <th className="px-6 py-4 text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] text-center">Resume</th>
                  <th className="px-6 py-4 text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] text-center">Psych</th>
                  <th className="px-6 py-4 text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] bg-primary/5">Match Score</th>
                  <th className="px-6 py-4 text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Verdict</th>
                  <th className="px-6 py-4 w-[60px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/5">
                {filteredCandidates.map((c) => (
                  <motion.tr
                    key={c.id}
                    initial={false}
                    whileHover={{ backgroundColor: "rgba(79, 70, 229, 0.04)" }}
                    className="group cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 rounded-xl border border-border/10 shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition-transform group-hover:scale-105 duration-300">
                          <AvatarFallback className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 text-primary text-[10px] font-black">
                            {getInitials(c.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{c.name}</p>
                          <p className="text-[11px] text-muted-foreground leading-tight truncate max-w-[140px]">{c.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn("text-[10px] h-6 px-2 font-bold shadow-none", STAGE_COLORS[c.stage] || STAGE_COLORS["Sourced"])}>
                        {c.stage}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-black font-mono tracking-tighter text-foreground">
                        {c.scores.resume.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-black font-mono tracking-tighter text-foreground/70">
                        {c.scores.psych.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 bg-primary/[0.02] group-hover:bg-primary/[0.05] transition-colors">
                      <MatchOrb score={c.scores.composite} />
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("text-xs font-black uppercase tracking-wider", VERDICT_STYLES[c.verdict])}>
                        {c.verdict}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end pr-2">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground/30 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddCandidateModal open={modalOpen} form={form} setForm={setForm} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} />
    </div>
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-border/10 rounded-[2rem] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-border/5">
              <div className="flex items-center justify-between mb-2">
                <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-primary-foreground" />
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="text-xl font-black text-foreground font-display tracking-tight">Add New Candidate</h3>
              <p className="text-[13px] text-muted-foreground mt-1">Submit the candidate for immediate analysis</p>
            </div>

            {/* Form */}
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">Candidate Name</Label>
                <Input
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">Target Designation</Label>
                <Input
                  placeholder="e.g. Senior Product Manager"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">Workflow Stage</Label>
                <Select value={form.stage} onValueChange={(v) => setForm((f) => ({ ...f, stage: v }))}>
                  <SelectTrigger className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/10">
                    {STAGES.map((s) => (
                      <SelectItem key={s} value={s} className="rounded-lg">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-border/5 flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={onClose} className="font-bold rounded-xl h-12 px-6">Discard</Button>
              <Button
                onClick={onSubmit}
                disabled={!form.name.trim()}
                className="gradient-primary text-primary-foreground font-black rounded-xl h-12 px-8 flex-1"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Initialize Profile
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}