import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { JDInput } from "@/components/dashboard/JDInput";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { QuestionList } from "@/components/dashboard/QuestionList";
import { Question, generateMockQuestions } from "@/types/questions";

type DashboardState = "input" | "loading" | "results";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [state, setState] = useState<DashboardState>("input");
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleGenerate = async (jd: string) => {
    setState("loading");
    
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    // Generate mock questions
    const generatedQuestions = generateMockQuestions();
    setQuestions(generatedQuestions);
    setState("results");
  };

  const handleBack = () => {
    setState("input");
    setQuestions([]);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />

        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            {state === "input" && (
              <JDInput
                key="input"
                onGenerate={handleGenerate}
                isGenerating={false}
              />
            )}
            {state === "loading" && <LoadingState key="loading" />}
            {state === "results" && (
              <QuestionList
                key="results"
                questions={questions}
                onUpdateQuestions={setQuestions}
                onBack={handleBack}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
