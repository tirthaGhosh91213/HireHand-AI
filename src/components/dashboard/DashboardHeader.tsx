import { Search, Bell, Moon, Sun, Monitor, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  breadcrumbs?: { label: string; active?: boolean }[];
  onAddCandidate?: () => void;
}

export function DashboardHeader({ breadcrumbs, onAddCandidate }: DashboardHeaderProps) {
  const { setTheme, theme } = useTheme();

  return (
    <header className="h-20 border-b border-border/40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold text-foreground font-display hidden md:block">Dashboard</h1>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground/30 font-light text-2xl hidden md:block">/</span>
            {breadcrumbs.map((crumb, idx) => (
              <div key={crumb.label} className="flex items-center gap-2">
                <span className={crumb.active ? "text-[#4F46E5] font-bold text-sm" : "text-muted-foreground font-medium text-sm"}>
                  {crumb.label}
                </span>
                {idx < breadcrumbs.length - 1 && <span className="text-muted-foreground/30 text-sm">/</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative w-80 group hidden lg:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-[#4F46E5] transition-colors" />
          <Input
            placeholder="Search candidates, positions..."
            className="pl-12 h-11 bg-zinc-100/50 dark:bg-zinc-900/50 border-transparent focus:border-[#4F46E5]/20 focus:bg-white dark:focus:bg-zinc-900 rounded-xl transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-[#4F46E5]" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl border-border/40 p-2 shadow-2xl">
              <DropdownMenuItem onClick={() => setTheme("light")} className="gap-3 rounded-xl py-3 focus:bg-[#4F46E5]/10 focus:text-[#4F46E5]">
                <Sun className="h-4 w-4" /> <span className="font-semibold">Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-3 rounded-xl py-3 focus:bg-[#4F46E5]/10 focus:text-[#4F46E5]">
                <Moon className="h-4 w-4" /> <span className="font-semibold">Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="gap-3 rounded-xl py-3 focus:bg-[#4F46E5]/10 focus:text-[#4F46E5]">
                <Monitor className="h-4 w-4" /> <span className="font-semibold">System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-3 right-3 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950" />
          </Button>

          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform cursor-pointer">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
