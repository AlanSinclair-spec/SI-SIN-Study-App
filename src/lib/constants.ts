export const APP_NAME = "SI & SIN Study";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/knowledge", label: "Knowledge Base", icon: "BookOpen" },
  { href: "/flashcards", label: "Flashcards", icon: "Layers" },
  { href: "/quiz", label: "Quiz", icon: "HelpCircle" },
  { href: "/connections", label: "Connections", icon: "Link" },
  { href: "/tutor", label: "AI Tutor", icon: "MessageSquare" },
  { href: "/daily", label: "Daily Session", icon: "Zap" },
] as const;

export const DIFFICULTY_COLORS = {
  beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  advanced: "bg-red-500/20 text-red-400 border-red-500/30",
} as const;

export const RELATIONSHIP_COLORS = {
  parallel: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  contrast: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  complement: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  tension: "bg-red-500/20 text-red-400 border-red-500/30",
} as const;

export const DAILY_SESSION_CONFIG = {
  maxFlashcards: 15,
  quizQuestionCount: 8,
  minTutorExchanges: 3,
  targetMinutes: 15,
} as const;
