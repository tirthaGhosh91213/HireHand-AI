import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [view, setView] = useState<DashboardView>("home");
  const [activeSection, setActiveSection] = useState("home");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (section === "home") setView("home");
    else if (section === "positions") setView("candidates");
    else if (section === "candidates") setView("candidates");
    else if (section === "scheduling") setView("scheduling");
    else if (section === "analytics") setView("analytics");
    else if (section === "decision-packs") setView("decision-packs");
    else if (section === "config") setView("config");
    else if (section === "audit-governance") setView("audit-governance");

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

  const breadcrumbs = [
    { label: "Senior Software Engineer", active: view === "candidates" || view === "candidate-detail" || view === "position-interviews" }
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
        onPasteJD={() => setView("paste-jd")}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader
          breadcrumbs={activeSection === "positions" ? breadcrumbs : undefined}
          onAddCandidate={() => console.log("Show Position Modal")}
        />

        <main className="flex-1 overflow-auto bg-[#f8fafc] dark:bg-zinc-950">
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
                <div className="flex h-full items-center justify-center p-8 bg-dot-grid-light dark:bg-dot-grid">
                  <div className="w-full max-w-4xl animate-in fade-in zoom-in duration-500">
                    <JDInput onGenerate={(text) => console.log("Generated:", text)} isGenerating={false} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
