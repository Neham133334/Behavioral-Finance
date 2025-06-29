"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, TrendingDown, TrendingUp, Calendar, BarChart2, LineChartIcon } from "lucide-react"

// Mock data for the charts
const dotComData = [
  { date: "1995", nasdaq: 1052, sp500: 615, pe: 16 },
  { date: "1996", nasdaq: 1291, sp500: 740, pe: 18 },
  { date: "1997", nasdaq: 1570, sp500: 970, pe: 22 },
  { date: "1998", nasdaq: 2192, sp500: 1229, pe: 28 },
  { date: "1999", nasdaq: 4069, sp500: 1469, pe: 33 },
  { date: "2000", nasdaq: 5048, sp500: 1527, pe: 44 },
  { date: "2001", nasdaq: 1950, sp500: 1148, pe: 30 },
  { date: "2002", nasdaq: 1335, sp500: 879, pe: 22 },
]

const financialCrisisData = [
  { date: "2005", housing: 100, sp500: 1248, pe: 26 },
  { date: "2006", housing: 115, sp500: 1418, pe: 27 },
  { date: "2007", housing: 112, sp500: 1468, pe: 27 },
  { date: "2008-Q1", housing: 100, sp500: 1326, pe: 24 },
  { date: "2008-Q2", housing: 90, sp500: 1280, pe: 23 },
  { date: "2008-Q3", housing: 80, sp500: 1164, pe: 21 },
  { date: "2008-Q4", housing: 65, sp500: 903, pe: 15 },
  { date: "2009-Q1", housing: 60, sp500: 797, pe: 13 },
  { date: "2009-Q2", housing: 62, sp500: 919, pe: 15 },
  { date: "2009-Q3", housing: 65, sp500: 1057, pe: 17 },
  { date: "2009-Q4", housing: 68, sp500: 1115, pe: 20 },
]

const covidCrashData = [
  { date: "Jan 2020", sp500: 3278, vix: 14, retailFlow: 100 },
  { date: "Feb 2020", sp500: 2954, vix: 40, retailFlow: 90 },
  { date: "Mar 2020", sp500: 2237, vix: 82, retailFlow: 120 },
  { date: "Apr 2020", sp500: 2912, vix: 34, retailFlow: 180 },
  { date: "May 2020", sp500: 3044, vix: 28, retailFlow: 220 },
  { date: "Jun 2020", sp500: 3100, vix: 30, retailFlow: 250 },
  { date: "Jul 2020", sp500: 3271, vix: 25, retailFlow: 280 },
  { date: "Aug 2020", sp500: 3500, vix: 22, retailFlow: 320 },
  { date: "Sep 2020", sp500: 3363, vix: 26, retailFlow: 340 },
  { date: "Oct 2020", sp500: 3270, vix: 38, retailFlow: 360 },
  { date: "Nov 2020", sp500: 3622, vix: 20, retailFlow: 380 },
  { date: "Dec 2020", sp500: 3756, vix: 22, retailFlow: 400 },
]

export function CaseStudies() {
  const [dotComView, setDotComView] = useState<"chart" | "timeline">("chart")
  const [crisisView, setCrisisView] = useState<"chart" | "timeline">("chart")
  const [covidView, setCovidView] = useState<"chart" | "timeline">("chart")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">📚 Historical Case Studies</h2>
        <p className="text-muted-foreground">Examining major market events through the lens of behavioral finance</p>
      </div>

      <Tabs defaultValue="dotcom" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dotcom">Dot-Com Bubble</TabsTrigger>
          <TabsTrigger value="financial-crisis">2008 Financial Crisis</TabsTrigger>
          <TabsTrigger value="covid">COVID-19 Crash</TabsTrigger>
          <TabsTrigger value="lessons">Key Lessons</TabsTrigger>
        </TabsList>

        <TabsContent value="dotcom" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>The Dot-Com Bubble (1995-2002)</CardTitle>
                  <CardDescription>Irrational exuberance in technology stocks</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={dotComView === "chart" ? "default" : "outline"}
                    onClick={() => setDotComView("chart")}
                    className="cursor-pointer"
                  >
                    <BarChart2 className="h-3.5 w-3.5 mr-1" />
                    Chart
                  </Badge>
                  <Badge
                    variant={dotComView === "timeline" ? "default" : "outline"}
                    onClick={() => setDotComView("timeline")}
                    className="cursor-pointer"
                  >
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    Timeline
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {dotComView === "chart" ? (
                <div className="space-y-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dotComData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="nasdaq" stroke="#8884d8" name="NASDAQ" />
                        <Line yAxisId="left" type="monotone" dataKey="sp500" stroke="#82ca9d" name="S&P 500" />
                        <Line yAxisId="right" type="monotone" dataKey="pe" stroke="#ff7300" name="Shiller P/E" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Behavioral Factors</h3>
                      <ul className="mt-2 space-y-2">
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <AlertCircle className="h-3 w-3" />
                          </div>
                          <div>
                            <span className="font-medium">Narrative-Driven Investing:</span> The "new economy" narrative
                            suggested traditional valuation metrics no longer applied to internet companies.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <AlertCircle className="h-3 w-3" />
                          </div>
                          <div>
                            <span className="font-medium">Overconfidence Bias:</span> Investors believed they could
                            identify winning tech stocks despite lack of earnings or proven business models.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <AlertCircle className="h-3 w-3" />
                          </div>
                          <div>
                            <span className="font-medium">Herding Behavior:</span> Fear of missing out (FOMO) drove
                            retail investors into tech stocks regardless of fundamentals.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <AlertCircle className="h-3 w-3" />
                          </div>
                          <div>
                            <span className="font-medium">Confirmation Bias:</span> Investors sought information
                            confirming their belief in perpetually rising tech stocks.
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Shiller's Analysis</h3>
                      <p className="mt-2 text-muted-foreground">
                        Robert Shiller identified the bubble in real-time, noting that the Shiller P/E ratio reached an
                        unprecedented 44 in December 1999, far above historical norms. In his book "Irrational
                        Exuberance" (published March 2000, just as the NASDAQ peaked), Shiller argued that stock prices
                        were driven by psychological factors and social dynamics rather than rational valuation.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute left-3.5 top-0 h-full w-px bg-border"></div>
                    <ul className="space-y-6">
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="font-medium">1995-1998: Early Growth</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Internet adoption accelerates. Netscape's IPO in August 1995 marks the beginning of the
                          internet stock boom. Amazon and eBay go public. NASDAQ doubles from 1,000 to 2,000.
                        </div>
                      </li>
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="font-medium">1999: Mania Phase</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Dot-com stocks soar regardless of profitability. Companies add ".com" to names to boost stock
                          prices. NASDAQ nearly doubles in a single year. Media celebrates new tech billionaires. Retail
                          investor participation surges.
                        </div>
                      </li>
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <LineChartIcon className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="font-medium">March 2000: Peak</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          NASDAQ reaches all-time high of 5,048 on March 10, 2000. Shiller P/E ratio hits 44, more than
                          double the historical average. Shiller publishes "Irrational Exuberance" warning of market
                          bubble.
                        </div>
                      </li>
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="font-medium">2000-2001: Crash Begins</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          NASDAQ falls 39% in 2000. Dot-com companies begin to fail as venture capital dries up.
                          Pets.com becomes symbol of excess with rapid rise and fall. September 11, 2001 attacks
                          accelerate market decline.
                        </div>
                      </li>
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="font-medium">2002: Bottom</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          NASDAQ bottoms at 1,114 in October 2002, a 78% decline from peak. Trillions in market value
                          erased. Major companies like Cisco lose over 80% of value. Investor sentiment shifts from
                          greed to fear.
                        </div>
                      </li>
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <AlertCircle className="h-4 w-4" />
                        </div>
                        <div className="font-medium">Aftermath</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          It takes NASDAQ 15 years (until 2015) to regain its 2000 peak. Surviving companies (Amazon,
                          eBay) eventually thrive. Sarbanes-Oxley Act passed to improve corporate governance. Investors
                          develop skepticism toward unprofitable tech companies.
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial-crisis" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>The 2008 Financial Crisis</CardTitle>
                  <CardDescription>Housing bubble, financial contagion, and market panic</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={crisisView === "chart" ? "default" : "outline"}
                    onClick={() => setCrisisView("chart")}
                    className="cursor-pointer"
                  >
                    <BarChart2 className="h-3.5 w-3.5 mr-1" />
                    Chart
                  </Badge>
                  <Badge
                    variant={crisisView === "timeline" ? "default" : "outline"}
                    onClick={() => setCrisisView("timeline")}
                    className="cursor-pointer"
                  >
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    Timeline
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {crisisView === "chart" ? (
                <div className="space-y-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={financialCrisisData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="housing" stroke="#8884d8" name="Housing Index" />
                        <Line yAxisId="left" type="monotone" dataKey="sp500" stroke="#82ca9d" name="S&P 500" />
                        <Line yAxisId="right" type="monotone" dataKey="pe" stroke="#ff7300" name="Shiller P/E" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Behavioral Factors</h3>
                      <ul className="mt-2 space-y-2">
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <AlertCircle className="h-3 w-3" />
                          </div>
                          <div>
                            <span className="font-medium">Extrapolation Bias:</span> Belief that housing prices would
                            continue rising indefinitely, ignoring historical mean reversion.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <AlertCircle className="h-3 w-3" />
                          </div>
                          <div>
                            <span className="font-medium">Moral Hazard:</span> Financial institutions took excessive
                            risks believing they would be bailed out if problems arose.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <AlertCircle className="h-3 w-3" />
                          </div>
                          <div>
                            <span className="font-medium">Panic Selling:</span> Once the crisis began, fear drove
                            massive selling regardless of fundamentals.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <AlertCircle className="h-3 w-3" />
                          </div>
                          <div>
                            <span className="font-medium">Complexity Aversion:</span> Few understood the complex
                            financial instruments (CDOs, MBS) at the heart of the crisis.
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Systemic Risk Factors</h3>
                      <p className="mt-2 text-muted-foreground">
                        The crisis demonstrated how behavioral biases can create systemic risks. Excessive leverage
                        amplified the impact of housing price declines. Financial institutions' interconnectedness
                        spread contagion throughout the system. The crisis revealed that markets are not always
                        efficient or rational, especially during periods of stress when fear dominates decision-making.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute left-3.5 top-0 h-full w-px bg-border"></div>
                    <ul className="space-y-6">
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="font-medium">2001-2006: Housing Boom</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Low interest rates after dot-com crash fuel housing boom. Subprime mortgages proliferate.
                          Housing prices rise dramatically. Financial innovation creates complex mortgage-backed
                          securities. Lending standards deteriorate.
                        </div>
                      </li>
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <TrendingDown className="h-4 w-4 text-amber-500" />
                        </div>
                        <div className="font-medium">2007: Early Warning Signs</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Housing prices peak and begin to decline. Subprime mortgage defaults rise. Bear Stearns
                          liquidates two hedge funds invested in mortgage securities. BNP Paribas freezes redemptions
                          for three investment funds in August.
                        </div>
                      </li>
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="font-medium">March 2008: Bear Stearns Collapse</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Bear Stearns faces liquidity crisis and is sold to JPMorgan Chase for $2 per share (later
                          raised to $10), a fraction of its former value. Federal Reserve provides $30 billion in
                          financing for the deal.
                        </div>
                      </li>
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="font-medium">September 2008: Crisis Peak</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Lehman Brothers files for bankruptcy on September 15. Merrill Lynch sold to Bank of America.
                          AIG receives $85 billion government bailout. Reserve Primary Fund "breaks the buck." Money
                          markets freeze. Washington Mutual fails.
                        </div>
                      </li>
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <AlertCircle className="h-4 w-4" />
                        </div>
                        <div className="font-medium">October 2008: Government Response</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Congress passes $700 billion Troubled Asset Relief Program (TARP). Federal Reserve begins
                          quantitative easing. Global coordinated interest rate cuts. S&P 500 falls 17% in October
                          alone.
                        </div>
                      </li>
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="font-medium">March 2009: Market Bottom</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          S&P 500 bottoms at 676 on March 9, 2009, a 57% decline from October 2007 peak. Shiller P/E
                          falls to 13, below historical average. Unemployment reaches 8.5% and continues rising.
                        </div>
                      </li>
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="font-medium">Aftermath</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Dodd-Frank Act passed to reform financial regulation. Banks undergo stress tests and increase
                          capital requirements. Housing market takes years to recover. Unprecedented monetary policy
                          (near-zero interest rates) continues for years.
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="covid" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>COVID-19 Market Crash & Recovery (2020)</CardTitle>
                  <CardDescription>Pandemic panic and unprecedented policy response</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={covidView === "chart" ? "default" : "outline"}
                    onClick={() => setCovidView("chart")}
                    className="cursor-pointer"
                  >
                    <BarChart2 className="h-3.5 w-3.5 mr-1" />
                    Chart
                  </Badge>
                  <Badge
                    variant={covidView === "timeline" ? "default" : "outline"}
                    onClick={() => setCovidView("timeline")}
                    className="cursor-pointer"
                  >
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    Timeline
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {covidView === "chart" ? (
                <div className="space-y-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={covidCrashData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="sp500" stroke="#82ca9d" name="S&P 500" />
                        <Line yAxisId="right" type="monotone" dataKey="vix" stroke="#ff7300" name="VIX (Volatility)" />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="retailFlow"
                          stroke="#8884d8"
                          name="Retail Investor Flow"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Behavioral Factors</h3>
                      <ul className="mt-2 space-y-2">
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <AlertCircle className="h-3 w-3" />
                          </div>
                          <div>
                            <span className="font-medium">Panic Selling:</span> Unprecedented uncertainty about pandemic
                            impacts triggered fear-based selling regardless of fundamentals.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <AlertCircle className="h-3 w-3" />
                          </div>
                          <div>
                            <span className="font-medium">FOMO (Fear of Missing Out):</span> Retail investors piled into
                            the market during recovery, afraid of missing gains despite economic uncertainty.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <AlertCircle className="h-3 w-3" />
                          </div>
                          <div>
                            <span className="font-medium">Recency Bias:</span> Investors who experienced 2008 expected a
                            similar prolonged downturn, not anticipating the rapid V-shaped recovery.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <AlertCircle className="h-3 w-3" />
                          </div>
                          <div>
                            <span className="font-medium">Gamification Effect:</span> New trading platforms with
                            game-like features attracted unprecedented retail participation during lockdowns.
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Unique Aspects</h3>
                      <p className="mt-2 text-muted-foreground">
                        The COVID-19 crash was unique in its speed (fastest 30% decline in history) and recovery
                        (V-shaped rather than prolonged). Unprecedented monetary and fiscal stimulus (over $5 trillion
                        in the US alone) dramatically altered market dynamics. The crisis saw record retail investor
                        participation, with platforms like Robinhood adding millions of new accounts during lockdowns.
                        Unlike previous crashes, this one featured significant divergence between "stay-at-home" stocks
                        and sectors directly impacted by lockdowns.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute left-3.5 top-0 h-full w-px bg-border"></div>
                    <ul className="space-y-6">
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <AlertCircle className="h-4 w-4" />
                        </div>
                        <div className="font-medium">January 2020: Early Concerns</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          News of novel coronavirus emerges from China. WHO declares Public Health Emergency on January
                          30. Markets largely dismiss concerns, with S&P 500 reaching new all-time high on February 19.
                        </div>
                      </li>
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="font-medium">February 24-28, 2020: Initial Selloff</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          S&P 500 drops 11.5% in one week as COVID-19 spreads globally. VIX volatility index spikes
                          above 40. Oil prices collapse due to anticipated demand destruction. Treasury yields plummet
                          as investors seek safety.
                        </div>
                      </li>
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="font-medium">March 9, 2020: Circuit Breakers Triggered</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          S&P 500 triggers circuit breaker, halting trading after 7% drop. Oil prices crash 24% in worst
                          day since 1991 Gulf War. VIX hits highest level since 2008 financial crisis. Trading halts
                          triggered again on March 12 and 16.
                        </div>
                      </li>
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="font-medium">March 23, 2020: Market Bottom</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          S&P 500 bottoms at 2,237, down 34% from February peak. VIX reaches 82, near all-time high.
                          Fastest bear market in history (22 trading days). Liquidity issues emerge in bond markets.
                        </div>
                      </li>
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <AlertCircle className="h-4 w-4" />
                        </div>
                        <div className="font-medium">March-April 2020: Unprecedented Stimulus</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Federal Reserve cuts rates to zero and announces unlimited QE. Congress passes $2.2 trillion
                          CARES Act. Fed establishes multiple emergency lending facilities. Global central banks
                          coordinate policy response.
                        </div>
                      </li>
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="font-medium">April-August 2020: V-Shaped Recovery</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Markets begin rapid recovery. Tech stocks lead gains as "stay-at-home" trades benefit from
                          lockdowns. Retail investor participation surges with commission-free trading platforms. S&P
                          500 regains pre-pandemic highs by August.
                        </div>
                      </li>
                      <li className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="font-medium">Late 2020: Continued Rally</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Vaccine announcements in November fuel further gains. "Meme stock" phenomenon emerges. SPACs
                          proliferate. S&P 500 ends year up 16% despite pandemic. Retail investor participation reaches
                          record levels.
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Lessons from Market Cycles</CardTitle>
              <CardDescription>Universal patterns in behavioral finance across different crises</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">1. Sentiment Extremes Signal Turning Points</h3>
                  <p className="text-sm text-muted-foreground">
                    All three crises featured extreme sentiment readings at key turning points. The dot-com bubble
                    peaked when optimism was highest, the 2008 crisis bottomed when fear was greatest, and COVID-19 saw
                    both extremes within months. Contrarian indicators like the Shiller P/E, VIX, and sentiment surveys
                    often provide early warning signals.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">2. Narratives Drive Markets More Than Fundamentals</h3>
                  <p className="text-sm text-muted-foreground">
                    Each crisis was driven by powerful narratives: the "new economy" in the dot-com era, "housing never
                    goes down" before 2008, and "unprecedented times" during COVID-19. These stories often become
                    self-reinforcing until reality intervenes. Understanding prevailing narratives is crucial for
                    identifying bubbles and crashes.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">3. Herding Behavior Amplifies Volatility</h3>
                  <p className="text-sm text-muted-foreground">
                    In all three cases, herding behavior amplified both the rise and fall. Investors followed others
                    into overvalued assets during bubbles and panic-sold during crashes. Social media and modern
                    communication have accelerated this process, making markets more volatile but also potentially
                    creating more opportunities for contrarian investors.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">4. Policy Responses Shape Recovery Patterns</h3>
                  <p className="text-sm text-muted-foreground">
                    The speed and magnitude of policy responses significantly affected recovery patterns. The dot-com
                    crash had limited policy intervention and a prolonged recovery. 2008 saw substantial but delayed
                    intervention with a slow recovery. COVID-19 featured immediate, massive intervention leading to a
                    V-shaped recovery. This suggests policy makers have learned from previous crises.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">5. Technology Changes Market Dynamics</h3>
                  <p className="text-sm text-muted-foreground">
                    Each crisis reflected the technology of its time. The dot-com bubble was driven by internet
                    adoption, 2008 featured complex financial engineering, and COVID-19 saw unprecedented retail
                    participation via mobile trading apps. New technologies create new opportunities for both innovation
                    and speculation.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">6. Valuation Metrics Provide Long-Term Guidance</h3>
                  <p className="text-sm text-muted-foreground">
                    Despite short-term volatility, valuation metrics like the Shiller P/E have proven remarkably
                    consistent in predicting long-term returns. High valuations (above historical averages) have
                    consistently led to below-average future returns, while low valuations have preceded above-average
                    returns. This relationship holds across all three crises studied.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">7. Behavioral Biases Are Persistent</h3>
                  <p className="text-sm text-muted-foreground">
                    The same behavioral biases appear in every crisis: overconfidence during bubbles, panic during
                    crashes, recency bias in extrapolating trends, and confirmation bias in seeking supporting
                    information. Understanding these biases doesn't eliminate them but can help investors recognize when
                    they might be affecting decision-making.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <h3 className="text-lg font-medium mb-2 text-blue-800">Practical Applications</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Monitor sentiment indicators for extreme readings</li>
                    <li>• Question prevailing narratives, especially when they seem universally accepted</li>
                    <li>• Use valuation metrics for long-term positioning</li>
                    <li>• Maintain awareness of your own behavioral biases</li>
                    <li>• Consider contrarian positions when sentiment reaches extremes</li>
                    <li>• Understand that markets can remain irrational longer than expected</li>
                    <li>• Prepare for policy responses that may alter traditional market dynamics</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
