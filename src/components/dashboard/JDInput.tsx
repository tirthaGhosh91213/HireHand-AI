import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface JDInputProps {
  onGenerate: (text: string) => void;
  isGenerating?: boolean;
}

export function JDInput({ onGenerate, isGenerating = false }: JDInputProps) {
  const [text, setText] = useState("");

  const exampleText = `We are looking for a Senior Software Engineer with 5+ years of experience in React, TypeScript, and Node.js. The ideal candidate will have strong problem-solving skills, experience with agile methodologies, and excellent communication abilities...`;

  return (
    <div className="w-full bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-border/40 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="p-16 space-y-10">
        {/* Header Section */}
        <div className="flex items-start gap-8">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#4F46E5] text-white shadow-lg shadow-indigo-500/20">
            <FileText className="h-8 w-8" />
          </div>
          <div className="space-y-1.5 pt-1">
            <h2 className="text-4xl font-bold tracking-tight text-foreground font-display">
              Paste Job Description
            </h2>
            <p className="text-muted-foreground text-xl font-medium opacity-80">
              Our AI will analyze and generate tailored questions
            </p>
          </div>
        </div>

        {/* Textarea Area */}
        <div className="relative group">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your job description here..."
            className={cn(
              "w-full min-h-[350px] p-10 text-xl bg-zinc-50/30 dark:bg-zinc-900/30 rounded-3xl border-2 border-border/20 dark:border-white/5 focus:border-[#4F46E5]/40 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all resize-none font-sans leading-relaxed placeholder:text-zinc-300 dark:placeholder:text-zinc-700",
              text && "bg-white dark:bg-zinc-900 shadow-inner"
            )}
          />
          {!text && (
            <div className="absolute top-[120px] left-10 right-10 pointer-events-none space-y-3 opacity-30 select-none">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Example:</p>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium">
                {exampleText}
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-end items-center pt-2">
          <Button
            onClick={() => onGenerate(text)}
            disabled={!text || isGenerating}
            size="lg"
            className="h-16 px-12 rounded-full gradient-primary hover:shadow-2xl hover:shadow-indigo-500/30 active:scale-[0.98] transition-all duration-300 text-white font-bold text-xl gap-3"
          >
            {isGenerating ? (
              <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="h-6 w-6" />
            )}
            Generate Questions
          </Button>
        </div>
      </div>
    </div>
  );
}
