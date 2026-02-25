import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function GrateLoader() {
    return (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
            <div className="relative">
                {/* Outer rotating ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
                />

                {/* Inner pulsing orb */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="relative h-24 w-24 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-2xl shadow-indigo-500/40"
                >
                    <Sparkles className="h-10 w-10 text-white animate-pulse" />
                </motion.div>

                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1.2, 0],
                            x: Math.cos(i * 60 * (Math.PI / 180)) * 60,
                            y: Math.sin(i * 60 * (Math.PI / 180)) * 60
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "easeOut"
                        }}
                        className="absolute top-1/2 left-1/2 h-2 w-2 rounded-full bg-indigo-400"
                    />
                ))}
            </div>

            <div className="mt-12 space-y-4 text-center">
                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold font-display tracking-tight text-foreground"
                >
                    Analyzing Job Description...
                </motion.h3>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground font-medium max-w-sm mx-auto"
                >
                    Gemini AI is crafting expert interview questions tailored specifically for this role.
                </motion.p>
            </div>

            {/* Loading bar */}
            <div className="mt-10 w-64 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="h-full w-1/2 bg-gradient-to-r from-transparent via-[#4F46E5] to-transparent"
                />
            </div>
        </div>
    );
}
