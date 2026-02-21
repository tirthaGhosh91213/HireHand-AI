import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Briefcase,
  Users,
  CalendarDays,
  BarChart3,
  Package,
  Settings,
  Shield,
  LogOut,
  Sparkles,
  ChevronLeft,
  Menu,
  FileText,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const mainNav = [
  { icon: Home, label: "Home", path: "/dashboard", section: "home" },
  { icon: Briefcase, label: "Positions", path: "/dashboard", section: "positions" },
  { icon: Users, label: "Candidates", path: "/dashboard", section: "candidates" },
  { icon: CalendarDays, label: "Scheduling", path: "/dashboard", section: "scheduling" },
  { icon: BarChart3, label: "Analytics", path: "/dashboard", section: "analytics" },
  { icon: Package, label: "Decision Packs", path: "/dashboard", section: "decision-packs" },
];

const adminNav = [
  { icon: Settings, label: "Config", path: "/dashboard", section: "config" },
  { icon: Shield, label: "Audit & Governance", path: "/dashboard", section: "audit-governance" },
];

interface DashboardSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  onPasteJD?: () => void;
}

export function DashboardSidebar({
  isCollapsed,
  onToggle,
  activeSection = "home",
  onSectionChange,
  onPasteJD,
}: DashboardSidebarProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-8 flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4F46E5] text-white shadow-lg shadow-indigo-500/20 shrink-0">
            <Sparkles className="h-6 w-6" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-foreground font-display tracking-tight"
            >
              HireHand AI
            </motion.span>
          )}
        </div>
      </div>

      {/* Paste JD Button */}
      <div className="px-4 mb-8">
        <Button
          onClick={onPasteJD}
          className={cn(
            "w-full h-12 gradient-primary hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 rounded-xl text-white font-bold gap-2",
            isCollapsed && "px-0 justify-center"
          )}
        >
          <div className="bg-white/20 p-1 rounded-md">
            <FileText className="h-4 w-4" />
          </div>
          {!isCollapsed && <span className="text-sm">✨ Paste Job Description</span>}
        </Button>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        <p className={cn("text-[11px] uppercase tracking-[0.2em] text-muted-foreground/50 font-bold mb-4 px-3", isCollapsed && "sr-only")}>
          Menu
        </p>
        {mainNav.map((item) => {
          const isActive = activeSection === item.section && activeSection !== "paste-jd";
          return (
            <button
              key={item.label}
              onClick={() => {
                onSectionChange?.(item.section);
                isMobile && setMobileOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold",
                isActive
                  ? "bg-[#4F46E5]/10 text-[#4F46E5] shadow-sm"
                  : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-[#4F46E5]" : "text-muted-foreground/60")} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}

        {/* Admin Section */}
        <div className="pt-8">
          <p className={cn("text-[11px] uppercase tracking-[0.2em] text-muted-foreground/50 font-bold mb-4 px-3", isCollapsed && "sr-only")}>
            Admin
          </p>
          {adminNav.map((item) => {
            const isActive = activeSection === item.section;
            return (
              <button
                key={item.label}
                onClick={() => {
                  onSectionChange?.(item.section);
                  isMobile && setMobileOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold",
                  isActive
                    ? "bg-[#4F46E5]/10 text-[#4F46E5] shadow-sm"
                    : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-[#4F46E5]" : "text-muted-foreground/60")} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-border/40 mt-auto">
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 text-sm font-semibold",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-zinc-950 flex flex-col border-r border-border/40">
              <SidebarContent />
            </div>
          </motion.div>
        )}
      </>
    );
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 90 : 280 }}
      className="relative h-screen bg-white dark:bg-zinc-950 flex flex-col shrink-0 border-r border-border/40 shadow-sm z-30"
    >
      <SidebarContent />

      <button
        className="absolute -right-3 top-24 h-6 w-6 rounded-full border border-border bg-white dark:bg-zinc-900 text-muted-foreground flex items-center justify-center hover:text-primary transition-all shadow-md z-40 hover:scale-110 active:scale-95"
        onClick={onToggle}
      >
        <ChevronLeft
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-300",
            isCollapsed && "rotate-180"
          )}
        />
      </button>
    </motion.aside>
  );
}
