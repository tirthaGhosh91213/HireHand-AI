import { motion } from "framer-motion";
import { FileText, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface JDInputProps {
  onGenerate: (text: string) => void;
  isGenerating?: boolean;
  isMinimized?: boolean;
}

export function JDInput({ onGenerate, isGenerating = false, isMinimized = false }: JDInputProps) {
  const [text, setText] = useState("");

  const exampleText = `We are looking for a Senior Software Engineer with 5+ years of experience in React, TypeScript, and Node.js. The ideal candidate will have strong problem-solving skills, experience with agile methodologies, and excellent communication abilities...`;

  return (
    <div className={cn(
      "w-full bg-white dark:bg-zinc-950 rounded-[1.5rem] md:rounded-[2.5rem] border border-border/40 shadow-2xl overflow-hidden transition-all duration-500",
      isMinimized ? "animate-in fade-in" : "animate-in fade-in slide-in-from-bottom-8 duration-700"
    )}>
      <div className={cn(
        "transition-all duration-500 flex flex-col gap-6 md:gap-8",
        isMinimized ? "p-4 md:p-6" : "p-6 md:p-10 lg:p-12"
      )}>
        {/* Header Section */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className={cn(
            "flex shrink-0 items-center justify-center rounded-xl md:rounded-2xl bg-[#4F46E5] text-white shadow-lg shadow-indigo-500/20 transition-all duration-500",
            isMinimized ? "h-10 w-10" : "h-12 w-12 md:h-16 md:w-16"
          )}>
            <FileText className={cn("transition-all", isMinimized ? "h-5 w-5" : "h-6 w-6 md:h-8 w-8")} />
          </div>
          <div className="space-y-0.5 md:space-y-1">
            <h2 className={cn(
              "font-bold tracking-tight text-foreground font-display transition-all leading-tight",
              isMinimized ? "text-lg md:text-xl" : "text-xl md:text-2xl lg:text-3xl"
            )}>
              Paste Job Description
            </h2>
            {!isMinimized && (
              <p className="text-muted-foreground text-sm md:text-base lg:text-lg font-medium opacity-80 line-clamp-1">
                Professional analysis and question drafting
              </p>
            )}
          </div>
        </div>

        {/* Textarea Area */}
        <div className="relative group">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your job description here..."
            className={cn(
              "w-full p-4 md:p-6 lg:p-8 text-base md:text-lg bg-zinc-50/30 dark:bg-zinc-900/30 rounded-2xl md:rounded-3xl border-2 border-border/20 dark:border-white/5 focus:border-[#4F46E5]/40 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all resize-none font-sans leading-relaxed placeholder:text-zinc-300 dark:placeholder:text-zinc-700",
              text && "bg-white dark:bg-zinc-900 shadow-inner",
              isMinimized ? "min-h-[80px] md:min-h-[100px] p-4 text-sm md:text-base" : "min-h-[200px] md:min-h-[280px] lg:min-h-[320px]"
            )}
          />
          {!text && !isMinimized && (
            <div className="absolute top-6 left-6 right-6 md:top-8 md:left-8 md:right-8 pointer-events-none space-y-2 opacity-20 select-none hidden sm:block">
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Example:</p>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed font-medium line-clamp-3">
                {exampleText}
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-end items-center">
          <Button
            onClick={() => onGenerate(text)}
            disabled={!text || isGenerating}
            size="lg"
            className={cn(
              "rounded-full gradient-primary hover:shadow-2xl hover:shadow-indigo-500/30 active:scale-[0.98] transition-all duration-300 text-white font-bold gap-2",
              isMinimized ? "h-10 px-6 text-sm md:h-12 md:px-8 md:text-base" : "h-12 px-8 text-base md:h-14 md:px-10 md:text-lg"
            )}
          >
            {isGenerating ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Edit3 className="h-5 w-5 md:h-6 md:w-6" />
            )}
            {isMinimized ? "Finalize" : "Analyze & Draft"}
          </Button>
        </div>
      </div>
    </div>
  );
}
