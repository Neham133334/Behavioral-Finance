"use client"

import {
  BarChart3,
  Brain,
  TrendingUp,
  Zap,
  Activity,
  Home,
  GitCompare,
  BookOpen,
  Newspaper,
  Target,
  HelpCircle,
  Globe,
  Flag,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Overview",
    icon: Home,
    id: "overview",
  },
  {
    title: "Sentiment Tracker",
    icon: Brain,
    id: "sentiment",
  },
  {
    title: "News Sentiment",
    icon: Newspaper,
    id: "news",
  },
  {
    title: "Custom Stocks",
    icon: Target,
    id: "custom-stocks",
  },
  {
    title: "Bubble Visualizer",
    icon: TrendingUp,
    id: "bubbles",
  },
  {
    title: "Fear & Greed Index",
    icon: Zap,
    id: "fear-greed",
  },
  {
    title: "Shiller P/E Tracker",
    icon: BarChart3,
    id: "shiller-pe",
  },
  {
    title: "Sentiment Correlation",
    icon: GitCompare,
    id: "correlation",
  },
  {
    title: "EU Policy Impact",
    icon: Globe,
    id: "eu-policy",
  },
  {
    title: "US-China Politics",
    icon: Flag,
    id: "us-china-politics",
  },
  {
    title: "BF Principles",
    icon: BookOpen,
    id: "principles",
  },
  {
    title: "Case Studies",
    icon: BookOpen,
    id: "case-studies",
  },
  {
    title: "Tool Guide",
    icon: HelpCircle,
    id: "explanatory-notes",
  },
]

interface AppSidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export function AppSidebar({ activeView, setActiveView }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Activity className="h-6 w-6" />
          <span className="font-semibold">BehaviorFin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton onClick={() => setActiveView(item.id)} isActive={activeView === item.id}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
