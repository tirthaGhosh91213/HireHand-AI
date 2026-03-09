import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { CandidatesListView } from "../components/dashboard/CandidatesListView";
import { CandidateDetailsView } from "../components/dashboard/CandidateDetailsView";
import { GlobalSchedulingView } from "../components/dashboard/GlobalSchedulingView";
import { AnalyticsView } from "../components/dashboard/AnalyticsView";
import { DecisionPacksView } from "../components/dashboard/DecisionPacksView";
import { ConfigView } from "../components/dashboard/ConfigView";
import { AuditGovernanceView } from "../components/dashboard/AuditGovernanceView";
import { InterviewsSchedulingView } from "../components/dashboard/InterviewsSchedulingView";
import { PositionDetail } from "../components/dashboard/PositionDetail";
import { JDInput } from "../components/dashboard/JDInput";
import { QuestionList } from "../components/dashboard/QuestionList";
import { GrateLoader } from "@/components/dashboard/GrateLoader";
import { generateQuestionsFromJD } from "@/lib/questionService";
import { Question } from "@/types/questions";
import { useToast } from "@/hooks/use-toast";

type DashboardView =
  | "home"
  | "candidates"
  | "candidate-detail"
  | "scheduling"
  | "analytics"
  | "decision-packs"
  | "config"
  | "audit-governance"
  | "position-interviews"
  | "position-detail"
  | "paste-jd";

type Section =
  | "home"
  | "candidates"
  | "scheduling"
  | "analytics"
  | "decision-packs"
  | "config"
  | "audit-governance"
  | "paste-jd";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [view, setView] = useState<DashboardView>("home");
  const [activeSection, setActiveSection] = useState("home");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const { toast } = useToast();

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (section === "home") setView("home");
    else if (section === "candidates") setView("candidates");
    else if (section === "scheduling") setView("scheduling");
    else if (section === "analytics") setView("analytics");
    else if (section === "decision-packs") setView("decision-packs");
    else if (section === "config") setView("config");
    else if (section === "audit-governance") setView("audit-governance");
    else if (section === "paste-jd") setView("paste-jd");

    // Clear selection when changing main sections
    setSelectedPositionId(null);
  };

  const handleViewPosition = (id: string) => {
    setSelectedPositionId(id);
    setView("position-detail");
  };

  const handleSelectCandidate = (id: string) => {
    setSelectedCandidateId(id);
    setView("candidate-detail");
  };

  const handleGenerateQuestions = async (text: string) => {
    try {
      setIsGenerating(true);
      const questions = await generateQuestionsFromJD(text);
      setGeneratedQuestions(questions);
      setShowQuestions(true);
      setSidebarCollapsed(true);
      toast({
        title: "Questions generated!",
        description: "The sidebar has been collapsed for a better view.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const breadcrumbs = [
    { label: "Senior Software Engineer", active: view === "candidates" || view === "candidate-detail" || view === "position-interviews" || view === "paste-jd" }
  ];

  if (view === "candidate-detail") {
    breadcrumbs.push({ label: "Emily Johnson", active: true });
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <DashboardSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onPasteJD={() => handleSectionChange("paste-jd")}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader
          breadcrumbs={activeSection === "positions" || activeSection === "paste-jd" ? breadcrumbs : undefined}
          onAddCandidate={() => console.log("Show Position Modal")}
        />

        <main className="flex-1 overflow-auto bg-[#f8fafc] dark:bg-zinc-950 no-scrollbar">
          <div className={cn(
            "mx-auto w-full transition-all duration-500",
            view === "candidates" ? "max-w-full px-4 md:px-6 lg:px-8 py-4" : "max-w-[1600px] px-4 md:px-12 lg:px-16 py-8"
          )}>
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-full"
              >
                {view === "home" && <DashboardHome onViewPosition={handleViewPosition} />}
                {view === "candidates" && (
                  <CandidatesListView
                    onSelectCandidate={handleSelectCandidate}
                    onSwitchTab={(tab) => {
                      if (tab === "Interviews") setView("position-interviews");
                    }}
                    onAddCandidate={() => console.log("Show Position Modal")}
                  />
                )}
                {view === "candidate-detail" && (
                  <CandidateDetailsView onBack={() => setView("candidates")} />
                )}
                {view === "scheduling" && <GlobalSchedulingView />}
                {view === "analytics" && <AnalyticsView />}
                {view === "decision-packs" && <DecisionPacksView />}
                {view === "config" && <ConfigView />}
                {view === "audit-governance" && <AuditGovernanceView />}
                {view === "position-interviews" && (
                  <InterviewsSchedulingView onBack={() => setView("candidates")} />
                )}
                {view === "position-detail" && selectedPositionId && (
                  <PositionDetail positionId={selectedPositionId} onBack={() => setView("home")} />
                )}

                {view === "paste-jd" && (
                  <div className="flex flex-col space-y-12 animate-in fade-in zoom-in duration-500">
                    <JDInput
                      onGenerate={handleGenerateQuestions}
                      isGenerating={isGenerating}
                      isMinimized={showQuestions || isGenerating}
                    />

                    {isGenerating && (
                      <div className="animate-in fade-in zoom-in duration-500">
                        <GrateLoader />
                      </div>
                    )}

                    {showQuestions && !isGenerating && (
                      <div className="animate-in fade-in slide-in-from-top-8 duration-700">
                        <QuestionList
                          questions={generatedQuestions}
                          onUpdateQuestions={setGeneratedQuestions}
                          onBack={() => {
                            setShowQuestions(false);
                            setSidebarCollapsed(false);
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
