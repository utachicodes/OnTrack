'use client'

import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  CheckSquare,
  CalendarDays,
  Focus,
  FileText,
  Target,
  Flame,
  WalletCards,
  Settings,
  Bell,
  Search,
  Plus,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Sparkles,
  Timer,
  TrendingUp,
  Send,
  Hourglass,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowUpRight,
  BookCheck,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  PenSquare,
} from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }
type LucideIcon = ComponentType<{ size?: number; className?: string; strokeWidth?: number }>

function wrap(L: LucideIcon, defaultStroke = 1.7) {
  return function Wrapped(props: IconProps) {
    const { size = 18, ...rest } = props
    return <L size={size} strokeWidth={defaultStroke} {...(rest as object)} />
  }
}

/* Sidebar + utility icons — calm Lucide stroke. */
export const IconOverview    = wrap(LayoutDashboard)
export const IconLearn      = wrap(BookOpen)
export const IconExams      = wrap(GraduationCap)
export const IconTasks      = wrap(CheckSquare)
export const IconPlanning   = wrap(CalendarDays)
export const IconFocus      = wrap(Focus)
export const IconDocs       = wrap(FileText)
export const IconGoals      = wrap(Target)
export const IconHabits     = wrap(Flame)
export const IconFinance    = wrap(WalletCards)
export const IconSettings   = wrap(Settings)
export const IconBell       = wrap(Bell)
export const IconSearch     = wrap(Search)
export const IconAdd        = wrap(Plus)
export const IconPlay       = wrap(Play)
export const IconPause      = wrap(Pause)
export const IconReset      = wrap(RotateCcw)
export const IconChevron    = wrap(ChevronRight)
export const IconChevronL   = wrap(ChevronLeft)
export const IconMenu       = wrap(Menu)
export const IconClose      = wrap(X)
export const IconSparkles   = wrap(Sparkles)
export const IconTimer      = wrap(Timer)
export const IconTrending   = wrap(TrendingUp)
export const IconSend       = wrap(Send)
export const IconHourglass  = wrap(Hourglass)
export const IconArrow      = wrap(ArrowUpRight)
export const IconArrowR     = wrap(ArrowRight)
export const IconCheck      = wrap(BookCheck)
export const IconLayers     = wrap(Layers)
export const IconPanelClose = wrap(PanelLeftClose)
export const IconPanelOpen  = wrap(PanelLeftOpen)
export const IconPen        = wrap(PenSquare)
export const IconFlame      = wrap(Flame)

/* Form icons. */
export const IconEye      = (p: IconProps) => { const { size = 16, ...r } = p; return <Eye size={size} strokeWidth={1.6} {...(r as object)} /> }
export const IconEyeOff   = (p: IconProps) => { const { size = 16, ...r } = p; return <EyeOff size={size} strokeWidth={1.6} {...(r as object)} /> }
export const IconMail     = (p: IconProps) => { const { size = 17, ...r } = p; return <Mail size={size} strokeWidth={1.6} {...(r as object)} /> }
export const IconLock     = (p: IconProps) => { const { size = 17, ...r } = p; return <Lock size={size} strokeWidth={1.6} {...(r as object)} /> }
export const IconUser     = (p: IconProps) => { const { size = 17, ...r } = p; return <User size={size} strokeWidth={1.6} {...(r as object)} /> }
export const IconAlert    = (p: IconProps) => { const { size = 15, ...r } = p; return <AlertCircle size={size} strokeWidth={1.6} {...(r as object)} /> }
export const IconLoader   = (p: IconProps) => { const { size = 16, ...r } = p; return <Loader2 size={size} strokeWidth={1.6} className="auth-spin" {...(r as object)} /> }