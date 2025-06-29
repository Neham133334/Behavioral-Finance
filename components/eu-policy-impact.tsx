"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AlertTriangle, TrendingDown, TrendingUp, Euro, DollarSign, CircleAlert } from "lucide-react"

// Sample data for EU policy impact analysis
const policyTimelineData = [
  {
    date: "May 2010",
    policy: "Greek Bailout & EFSF",
    description: "First Greek bailout and establishment of European Financial Stability Facility",
    euImpact: "Stabilized European markets temporarily",
    usImpact: "Initial positive reaction followed by concerns about contagion",
    spx1d: -1.4,
    spx1w: -6.4,
    spx1m: -8.2,
    vix: 45.8,
    significance: 4,
  },
  {
    date: "Jul 2012",
    policy: "Draghi's 'Whatever It Takes'",
    description: "ECB President Mario Draghi pledges to do 'whatever it takes' to preserve the euro",
    euImpact: "Significant reduction in sovereign debt yields",
    usImpact: "Strong rally in US equities and risk assets",
    spx1d: 1.7,
    spx1w: 3.6,
    spx1m: 5.1,
    vix: -15.2,
    significance: 5,
  },
  {
    date: "Jan 2015",
    policy: "ECB QE Announced",
    description: "ECB announces €1.1 trillion quantitative easing program",
    euImpact: "Euro depreciation, equity markets rally",
    usImpact: "Mixed initial reaction, concerns about dollar strength",
    spx1d: -0.5,
    spx1w: 2.2,
    spx1m: -3.1,
    vix: 7.4,
    significance: 4,
  },
  {
    date: "Jun 2016",
    policy: "Brexit Referendum",
    description: "UK votes to leave the European Union",
    euImpact: "Sharp decline in European equities and pound",
    usImpact: "Significant volatility, flight to quality",
    spx1d: -3.6,
    spx1w: -1.2,
    spx1m: 2.7,
    vix: 49.3,
    significance: 5,
  },
  {
    date: "Mar 2020",
    policy: "PEPP Announced",
    description: "ECB announces €750 billion Pandemic Emergency Purchase Programme",
    euImpact: "Stabilization of European bond markets",
    usImpact: "Positive reaction amid global pandemic response",
    spx1d: 0.5,
    spx1w: 10.3,
    spx1m: 15.5,
    vix: -9.3,
    significance: 4,
  },
  {
    date: "Jul 2020",
    policy: "EU Recovery Fund",
    description: "Agreement on €750 billion NextGenerationEU recovery fund",
    euImpact: "Strong positive reaction in European assets",
    usImpact: "Positive spillover to US markets",
    spx1d: 0.8,
    spx1w: 1.7,
    spx1m: 4.7,
    vix: -5.4,
    significance: 3,
  },
  {
    date: "Jul 2022",
    policy: "ECB Rate Hike Cycle Begins",
    description: "ECB ends negative interest rates with 50bp hike",
    euImpact: "Euro strengthening, European bank stocks rally",
    usImpact: "Minimal direct impact, markets focused on Fed",
    spx1d: 0.9,
    spx1w: 4.3,
    spx1m: 8.1,
    vix: -8.6,
    significance: 2,
  },
  {
    date: "Oct 2022",
    policy: "EU Energy Crisis Response",
    description: "Coordinated measures to address energy crisis",
    euImpact: "Reduced fears of deep recession in Europe",
    usImpact: "Positive for US energy exporters",
    spx1d: 1.1,
    spx1w: 3.7,
    spx1m: 5.6,
    vix: -6.2,
    significance: 3,
  },
  {
    date: "Jun 2023",
    policy: "EU AI Act Framework",
    description: "World's first comprehensive AI regulations",
    euImpact: "Mixed reaction for European tech",
    usImpact: "Concern for US tech giants with European exposure",
    spx1d: -0.4,
    spx1w: -1.3,
    spx1m: 3.2,
    vix: 4.3,
    significance: 3,
  },
]

// Correlation data between EU/US markets over time
const correlationData = [
  { period: "2010-2012", euPolicy: "Sovereign Debt Crisis", correlation: 0.78, transmission: "High" },
  { period: "2012-2014", euPolicy: "Banking Union Formation", correlation: 0.65, transmission: "Medium" },
  { period: "2015-2016", euPolicy: "QE Implementation", correlation: 0.82, transmission: "High" },
  { period: "2016-2019", euPolicy: "Brexit Negotiations", correlation: 0.71, transmission: "Medium" },
  { period: "2019-2021", euPolicy: "Pandemic Response", correlation: 0.88, transmission: "Very High" },
  { period: "2021-2023", euPolicy: "Inflation Fighting", correlation: 0.75, transmission: "Medium" },
]

// Sector impact data
const sectorImpactData = [
  { sector: "Financials", positiveImpact: 3, negativeImpact: 5, netImpact: -2 },
  { sector: "Technology", positiveImpact: 2, negativeImpact: 4, netImpact: -2 },
  { sector: "Energy", positiveImpact: 5, negativeImpact: 2, netImpact: 3 },
  { sector: "Healthcare", positiveImpact: 4, negativeImpact: 2, netImpact: 2 },
  { sector: "Consumer", positiveImpact: 3, negativeImpact: 3, netImpact: 0 },
  { sector: "Industrials", positiveImpact: 4, negativeImpact: 3, netImpact: 1 },
  { sector: "Materials", positiveImpact: 5, negativeImpact: 2, netImpact: 3 },
]

// Detailed policy-market relationship data
const scatterData = policyTimelineData.map((item) => ({
  name: item.policy,
  date: item.date,
  marketImpact: item.spx1m,
  volatility: Math.abs(item.vix),
  significance: item.significance,
}))

export function EUPolicyImpact() {
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [activeTab, setActiveTab] = useState("timeline")

  // Filter data based on selected period
  const filteredData =
    selectedPeriod === "all"
      ? policyTimelineData
      : policyTimelineData.filter((item) => {
          const year = Number.parseInt(item.date.split(" ")[1])
          if (selectedPeriod === "2010-2015") return year >= 2010 && year <= 2015
          if (selectedPeriod === "2016-2020") return year >= 2016 && year <= 2020
          if (selectedPeriod === "2021-present") return year >= 2021
          return true
        })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">EU Policy Impact on US Markets</h2>
          <p className="text-muted-foreground">
            Analysis of how European Union policy decisions affect US market behavior
          </p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Periods</SelectItem>
            <SelectItem value="2010-2015">2010-2015 (Debt Crisis)</SelectItem>
            <SelectItem value="2016-2020">2016-2020 (Brexit & Covid)</SelectItem>
            <SelectItem value="2021-present">2021-Present (Post-Covid)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="timeline" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="timeline">Policy Timeline</TabsTrigger>
          <TabsTrigger value="correlation">Market Correlation</TabsTrigger>
          <TabsTrigger value="sectors">Sector Impact</TabsTrigger>
          <TabsTrigger value="analysis">Key Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Major EU Policy Decisions & US Market Reactions</CardTitle>
              <CardDescription>
                Historical timeline of significant EU policy events and their cross-Atlantic impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-3.5 top-0 h-full w-px bg-border"></div>
                <ul className="space-y-8">
                  {filteredData.map((item, index) => (
                    <li key={index} className="relative pl-10">
                      <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                        {item.spx1m > 0 ? (
                          <TrendingUp className={`h-4 w-4 ${item.spx1m > 5 ? "text-green-500" : "text-green-400"}`} />
                        ) : (
                          <TrendingDown className={`h-4 w-4 ${item.spx1m < -5 ? "text-red-500" : "text-red-400"}`} />
                        )}
                      </div>

                      <div className="flex items-baseline justify-between">
                        <div className="font-medium flex items-center gap-2">
                          {item.policy}
                          <span className="text-sm text-muted-foreground">{item.date}</span>

                          {Math.abs(item.spx1m) > 5 && (
                            <Badge variant={item.spx1m > 0 ? "default" : "destructive"} className="ml-2">
                              {item.spx1m > 0 ? "Major Positive" : "Major Negative"}
                            </Badge>
                          )}

                          {Math.abs(item.vix) > 20 && (
                            <Badge variant="outline" className="ml-2">
                              High Volatility
                            </Badge>
                          )}
                        </div>

                        <div className="text-sm">
                          <span className={`font-medium ${item.spx1m > 0 ? "text-green-600" : "text-red-600"}`}>
                            S&P 500: {item.spx1m > 0 ? "+" : ""}
                            {item.spx1m}% (1M)
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground mt-1">{item.description}</div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="flex items-start">
                          <Euro className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                          <span className="text-sm">{item.euImpact}</span>
                        </div>
                        <div className="flex items-start">
                          <DollarSign className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                          <span className="text-sm">{item.usImpact}</span>
                        </div>
                      </div>

                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <div>
                          1D:{" "}
                          <span className={item.spx1d > 0 ? "text-green-600" : "text-red-600"}>
                            {item.spx1d > 0 ? "+" : ""}
                            {item.spx1d}%
                          </span>
                        </div>
                        <div>
                          1W:{" "}
                          <span className={item.spx1w > 0 ? "text-green-600" : "text-red-600"}>
                            {item.spx1w > 0 ? "+" : ""}
                            {item.spx1w}%
                          </span>
                        </div>
                        <div>
                          VIX:{" "}
                          <span className={item.vix < 0 ? "text-green-600" : "text-red-600"}>
                            {item.vix > 0 ? "+" : ""}
                            {item.vix}%
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-medium">Policy Impact Visualization</CardTitle>
              <CardDescription>Market reaction magnitude vs. policy significance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid />
                    <XAxis
                      type="number"
                      dataKey="marketImpact"
                      name="Market Impact"
                      domain={[-10, 20]}
                      label={{ value: "S&P 500 1-Month Return (%)", position: "bottom" }}
                    />
                    <YAxis
                      type="number"
                      dataKey="volatility"
                      name="Volatility"
                      domain={[0, 60]}
                      label={{ value: "VIX Change Magnitude", angle: -90, position: "left" }}
                    />
                    <ZAxis type="number" dataKey="significance" range={[50, 400]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background p-3 border rounded-md shadow-sm">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm text-muted-foreground">{data.date}</p>
                              <div className="text-sm mt-1">
                                <p>
                                  Market Impact: {data.marketImpact > 0 ? "+" : ""}
                                  {data.marketImpact}%
                                </p>
                                <p>Volatility Change: {data.volatility}</p>
                                <p>Significance: {data.significance}/5</p>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend />
                    <Scatter name="EU Policy Events" data={scatterData} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>EU-US Market Correlation Analysis</CardTitle>
              <CardDescription>How closely EU policy changes transmit to US market movements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Correlation Strength Over Time</h3>
                <div className="h-72">
                  <ChartContainer
                    config={{
                      correlation: {
                        label: "EU-US Market Correlation",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-64"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={correlationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis domain={[0.5, 1]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="correlation"
                          stroke="var(--color-correlation)"
                          strokeWidth={3}
                          dot={{ r: 6 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <p className="text-sm text-muted-foreground">
                  Correlation coefficient between EU policy announcements and S&P 500 movements (scale 0-1)
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Transmission Mechanism Analysis</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {correlationData.map((item, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">{item.period}</CardTitle>
                        <CardDescription>{item.euPolicy}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Correlation:</span>
                          <span
                            className={`font-bold ${
                              item.correlation > 0.8
                                ? "text-red-500"
                                : item.correlation > 0.7
                                  ? "text-yellow-500"
                                  : "text-green-500"
                            }`}
                          >
                            {item.correlation}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5 mt-1.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              item.correlation > 0.8
                                ? "bg-red-500"
                                : item.correlation > 0.7
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                            style={{ width: `${item.correlation * 100}%` }}
                          ></div>
                        </div>
                        <div className="mt-3 flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Transmission:</span>
                          <Badge
                            variant={
                              item.transmission === "Very High"
                                ? "destructive"
                                : item.transmission === "High"
                                  ? "default"
                                  : item.transmission === "Medium"
                                    ? "secondary"
                                    : "outline"
                            }
                          >
                            {item.transmission}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <CircleAlert className="h-5 w-5 text-amber-500" />
                  Key Correlation Insights
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <AlertTriangle className="h-3 w-3" />
                    </div>
                    <span>
                      <strong>Crisis Correlation:</strong> EU-US market correlation spikes during crisis periods
                      (2010-2012 sovereign debt crisis, 2019-2021 pandemic)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <AlertTriangle className="h-3 w-3" />
                    </div>
                    <span>
                      <strong>Monetary Policy Impact:</strong> ECB monetary policy decisions have increasing influence
                      on US markets, particularly when they signal global economic conditions
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <AlertTriangle className="h-3 w-3" />
                    </div>
                    <span>
                      <strong>Regulatory Spillovers:</strong> EU regulatory decisions, especially in technology and
                      finance, increasingly affect US companies with global operations
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sector-Level Impact Analysis</CardTitle>
              <CardDescription>How EU policy decisions affect specific US market sectors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Impact Distribution by Sector</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sectorImpactData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="sector" />
                      <YAxis domain={[-6, 6]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="positiveImpact" name="Positive Impact" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="negativeImpact" name="Negative Impact" stroke="#ff7300" />
                      <Line type="monotone" dataKey="netImpact" name="Net Impact" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-muted-foreground">
                  Impact scores range from 1-5, with 5 representing the strongest impact
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Most Impacted: Financials</CardTitle>
                    <CardDescription>Banking regulations and monetary policy</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-sm space-y-2">
                      <p>
                        <strong>Key EU Policies:</strong> Banking Union, MiFID II, stress tests
                      </p>
                      <p>
                        <strong>Transmission Mechanism:</strong> Direct regulatory requirements for global banks,
                        capital flows between markets
                      </p>
                      <p>
                        <strong>Notable Events:</strong> 2010-2012 sovereign debt crisis led to significant
                        underperformance of US financial stocks due to European exposure
                      </p>
                    </div>
                    <div className="mt-3 flex items-center space-x-2">
                      <span className="text-sm">Net Impact:</span>
                      <Badge variant="destructive">Negative (-2)</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Most Benefited: Energy & Materials</CardTitle>
                    <CardDescription>Energy policy and commodity demand</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-sm space-y-2">
                      <p>
                        <strong>Key EU Policies:</strong> Energy transition plans, Russian sanctions, critical minerals
                        strategy
                      </p>
                      <p>
                        <strong>Transmission Mechanism:</strong> Increased US LNG exports to Europe, demand for US raw
                        materials
                      </p>
                      <p>
                        <strong>Notable Events:</strong> 2022 energy crisis response created opportunities for US energy
                        exporters
                      </p>
                    </div>
                    <div className="mt-3 flex items-center space-x-2">
                      <span className="text-sm">Net Impact:</span>
                      <Badge variant="default">Positive (+3)</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Growing Concern: Technology</CardTitle>
                    <CardDescription>Digital regulation and privacy rules</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-sm space-y-2">
                      <p>
                        <strong>Key EU Policies:</strong> GDPR, Digital Markets Act, AI Act
                      </p>
                      <p>
                        <strong>Transmission Mechanism:</strong> Compliance costs for US tech giants, potential fines,
                        product redesigns
                      </p>
                      <p>
                        <strong>Notable Events:</strong> 2018 GDPR implementation led to temporary underperformance of
                        US tech stocks with significant European exposure
                      </p>
                    </div>
                    <div className="mt-3 flex items-center space-x-2">
                      <span className="text-sm">Net Impact:</span>
                      <Badge variant="destructive">Negative (-2)</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Mixed Impact: Healthcare</CardTitle>
                    <CardDescription>Pharmaceutical regulations</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-sm space-y-2">
                      <p>
                        <strong>Key EU Policies:</strong> Medical Device Regulation, Clinical Trials Regulation, pharma
                        pricing policies
                      </p>
                      <p>
                        <strong>Transmission Mechanism:</strong> Approval timelines for drugs/devices, pricing
                        precedents
                      </p>
                      <p>
                        <strong>Notable Events:</strong> EU's faster COVID vaccine approval in 2020-2021 created
                        positive sentiment for US pharma companies
                      </p>
                    </div>
                    <div className="mt-3 flex items-center space-x-2">
                      <span className="text-sm">Net Impact:</span>
                      <Badge variant="default">Positive (+2)</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cross-Atlantic Policy Transmission: Key Insights</CardTitle>
              <CardDescription>How EU policy decisions shape US market behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">1. Crisis Responses Have Strongest Impact</h3>
                  <p className="text-sm text-muted-foreground">
                    Emergency EU policy actions during crises show the highest correlation with US market movements. The
                    ECB's crisis responses (Draghi's "whatever it takes" speech, PEPP launch) triggered significant
                    positive reactions in US markets. This suggests global investors view coordinated policy responses
                    as reducing systemic risks.
                  </p>
                  <div className="mt-3 flex items-center text-sm gap-2">
                    <Badge variant="outline">Notable Example</Badge>
                    <span>July 2012: Draghi's speech triggered a 5.1% S&P 500 rally in the following month</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">2. Regulatory Decisions Have Sector-Specific Impact</h3>
                  <p className="text-sm text-muted-foreground">
                    EU regulatory decisions increasingly affect specific US sectors with global operations or European
                    exposure. Technology companies face the most significant regulatory headwinds from EU digital
                    policies (GDPR, DMA, AI Act), while energy companies have benefited from EU energy security
                    concerns.
                  </p>
                  <div className="mt-3 flex items-center text-sm gap-2">
                    <Badge variant="outline">Notable Example</Badge>
                    <span>
                      Technology stocks underperformed by 3.5% in the month following the 2018 GDPR implementation
                    </span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">
                    3. Monetary Policy Divergence Creates Market Opportunities
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Periods of monetary policy divergence between the ECB and Federal Reserve create specific market
                    dynamics and opportunities. When the ECB pursues more accommodative policies than the Fed, it
                    typically strengthens the dollar, benefits US exporters, and creates headwinds for US multinationals
                    with significant European revenue exposure.
                  </p>
                  <div className="mt-3 flex items-center text-sm gap-2">
                    <Badge variant="outline">Notable Example</Badge>
                    <span>
                      2015 ECB QE launch: US companies with high European exposure underperformed the broader market by
                      2.7%
                    </span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">4. Political Uncertainty Creates Volatility Spikes</h3>
                  <p className="text-sm text-muted-foreground">
                    European political events that threaten EU stability or create uncertainty trigger significant
                    volatility spikes in US markets. The Brexit referendum and concerns about Eurozone fragmentation
                    during the sovereign debt crisis both led to sharp VIX increases and temporary S&P 500 selloffs,
                    highlighting how political stability in Europe remains important to US markets.
                  </p>
                  <div className="mt-3 flex items-center text-sm gap-2">
                    <Badge variant="outline">Notable Example</Badge>
                    <span>Brexit vote: VIX jumped 49.3% and S&P 500 fell 3.6% the day after the referendum</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <h3 className="text-lg font-medium mb-2 text-blue-800">Investor Implications</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Monitor major EU policy announcements, especially during crisis periods</li>
                    <li>• Evaluate sector exposure to EU regulatory decisions when considering investments</li>
                    <li>
                      • Pay attention to ECB/Fed policy divergence for currency and multinational exposure effects
                    </li>
                    <li>• Consider volatility protection during major European political events</li>
                    <li>• Track the increasing regulatory impact of EU decisions on US technology companies</li>
                    <li>• Look for opportunities in US energy exporters benefiting from European demand</li>
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
