"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { LiveSentimentTracker } from "@/components/live-sentiment-tracker"
import { BubbleVisualizer } from "@/components/bubble-visualizer"
import { LiveFearGreedIndex } from "@/components/live-fear-greed-index"
import { LiveShillerPETracker } from "@/components/live-shiller-pe-tracker"
import { SentimentMarketCorrelation } from "@/components/sentiment-market-correlation"
import { NewsSentimentAnalysis } from "@/components/news-sentiment-analysis"
import { BehavioralFinancePrinciples } from "@/components/behavioral-finance-principles"
import { DashboardOverview } from "@/components/dashboard-overview"
import { CustomStockAnalysis } from "@/components/custom-stock-analysis"
import { CaseStudies } from "@/components/case-studies"
import { ExplanatoryNotes } from "@/components/explanatory-notes"
import { EUPolicyImpact } from "@/components/eu-policy-impact"
import { USChinaPoliticsImpact } from "@/components/us-china-politics-impact"

export default function Dashboard() {
  const [activeView, setActiveView] = useState("overview")

  const renderContent = () => {
    switch (activeView) {
      case "sentiment":
        return <LiveSentimentTracker />
      case "news":
        return <NewsSentimentAnalysis />
      case "bubbles":
        return <BubbleVisualizer />
      case "fear-greed":
        return <LiveFearGreedIndex />
      case "shiller-pe":
        return <LiveShillerPETracker />
      case "correlation":
        return <SentimentMarketCorrelation />
      case "principles":
        return <BehavioralFinancePrinciples />
      case "custom-stocks":
        return <CustomStockAnalysis />
      case "case-studies":
        return <CaseStudies />
      case "explanatory-notes":
        return <ExplanatoryNotes />
      case "eu-policy":
        return <EUPolicyImpact />
      case "us-china-politics":
        return <USChinaPoliticsImpact />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar activeView={activeView} setActiveView={setActiveView} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Behavioral Finance Dashboard</h1>
            <span className="text-sm text-muted-foreground">Live Data • Yale Inspired</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{renderContent()}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
