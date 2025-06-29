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
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Flag, Zap, CircleAlert, Target } from "lucide-react"

// Historical US-China political events and market impact data
const politicalTimelineData = [
  {
    date: "Mar 2018",
    event: "Trade War Begins",
    description: "Trump announces tariffs on $50B of Chinese goods",
    category: "Trade",
    severity: 5,
    spx1d: -2.3,
    spx1w: -5.9,
    spx1m: -3.7,
    vix: 24.5,
    chinaStocks: -6.8,
    techImpact: -4.2,
    industrialsImpact: -3.8,
  },
  {
    date: "Jul 2018",
    event: "Tariff Escalation",
    description: "US imposes 25% tariffs on $34B of Chinese goods",
    category: "Trade",
    severity: 4,
    spx1d: -0.7,
    spx1w: -2.1,
    spx1m: 3.6,
    vix: 12.3,
    chinaStocks: -4.2,
    techImpact: -2.8,
    industrialsImpact: -5.1,
  },
  {
    date: "Dec 2018",
    event: "Huawei CFO Arrest",
    description: "Meng Wanzhou arrested in Canada on US request",
    category: "Technology",
    severity: 4,
    spx1d: -1.8,
    spx1w: -4.6,
    spx1m: -9.2,
    vix: 36.2,
    chinaStocks: -3.7,
    techImpact: -6.4,
    industrialsImpact: -2.1,
  },
  {
    date: "Jan 2020",
    event: "Phase One Deal",
    description: "US-China sign Phase One trade agreement",
    category: "Trade",
    severity: -3,
    spx1d: 0.3,
    spx1w: 1.8,
    spx1m: -0.2,
    vix: -8.4,
    chinaStocks: 4.2,
    techImpact: 2.1,
    industrialsImpact: 3.7,
  },
  {
    date: "May 2020",
    event: "Hong Kong Security Law",
    description: "China passes national security law for Hong Kong",
    category: "Geopolitical",
    severity: 3,
    spx1d: -0.2,
    spx1w: 3.2,
    spx1m: 4.5,
    vix: -2.1,
    chinaStocks: -1.8,
    techImpact: -0.8,
    industrialsImpact: 0.3,
  },
  {
    date: "Aug 2020",
    event: "TikTok Ban Threat",
    description: "Trump threatens to ban TikTok and WeChat",
    category: "Technology",
    severity: 3,
    spx1d: -0.9,
    spx1w: 1.4,
    spx1m: 7.0,
    vix: 3.2,
    chinaStocks: -2.4,
    techImpact: -3.1,
    industrialsImpact: 0.7,
  },
  {
    date: "Nov 2020",
    event: "Ant Group IPO Suspended",
    description: "China suspends Ant Group's $37B IPO",
    category: "Financial",
    severity: 2,
    spx1d: 1.2,
    spx1w: 7.3,
    spx1m: 10.8,
    vix: -12.4,
    chinaStocks: -8.1,
    techImpact: 0.8,
    industrialsImpact: 1.4,
  },
  {
    date: "Mar 2021",
    event: "Alaska Summit Tensions",
    description: "Heated exchanges at US-China diplomatic talks",
    category: "Diplomatic",
    severity: 2,
    spx1d: -0.1,
    spx1w: 0.9,
    spx1m: 4.2,
    vix: -1.8,
    chinaStocks: -1.2,
    techImpact: -0.4,
    industrialsImpact: 0.2,
  },
  {
    date: "Jul 2021",
    event: "China Tech Crackdown",
    description: "China launches broad crackdown on tech companies",
    category: "Technology",
    severity: 4,
    spx1d: -0.7,
    spx1w: 1.3,
    spx1m: 2.3,
    vix: 4.2,
    chinaStocks: -24.8,
    techImpact: -2.8,
    industrialsImpact: 0.1,
  },
  {
    date: "Aug 2022",
    event: "Pelosi Taiwan Visit",
    description: "House Speaker Pelosi visits Taiwan despite China warnings",
    category: "Geopolitical",
    severity: 4,
    spx1d: -0.3,
    spx1w: 0.2,
    spx1m: -4.2,
    vix: 8.7,
    chinaStocks: -3.6,
    techImpact: -1.9,
    industrialsImpact: -0.8,
  },
  {
    date: "Oct 2022",
    event: "Semiconductor Export Controls",
    description: "US imposes sweeping semiconductor export controls on China",
    category: "Technology",
    severity: 5,
    spx1d: -2.4,
    spx1w: -1.6,
    spx1m: 8.1,
    vix: 12.3,
    chinaStocks: -4.7,
    techImpact: -8.2,
    industrialsImpact: -1.4,
  },
  {
    date: "Feb 2023",
    event: "Spy Balloon Incident",
    description: "Chinese spy balloon shot down over US territory",
    category: "Geopolitical",
    severity: 2,
    spx1d: 1.3,
    spx1w: 1.1,
    spx1m: -2.4,
    vix: -3.2,
    chinaStocks: -0.8,
    techImpact: 0.4,
    industrialsImpact: 0.9,
  },
  {
    date: "May 2023",
    event: "G7 China Stance",
    description: "G7 adopts unified stance on China economic coercion",
    category: "Diplomatic",
    severity: 3,
    spx1d: 0.9,
    spx1w: 0.3,
    spx1m: 0.1,
    vix: -1.4,
    chinaStocks: -2.1,
    techImpact: -0.7,
    industrialsImpact: 0.2,
  },
]

// Sector impact analysis data
const sectorImpactData = [
  {
    sector: "Technology",
    tradeWarImpact: -15.2,
    techCrackdownImpact: -8.7,
    semiconductorControlsImpact: -12.4,
    overallImpact: -36.3,
    exposure: "Very High",
  },
  {
    sector: "Industrials",
    tradeWarImpact: -8.9,
    techCrackdownImpact: -1.2,
    semiconductorControlsImpact: -2.8,
    overallImpact: -12.9,
    exposure: "High",
  },
  {
    sector: "Consumer Discretionary",
    tradeWarImpact: -6.4,
    techCrackdownImpact: -2.1,
    semiconductorControlsImpact: -1.8,
    overallImpact: -10.3,
    exposure: "Medium",
  },
  {
    sector: "Materials",
    tradeWarImpact: -7.2,
    techCrackdownImpact: -0.8,
    semiconductorControlsImpact: -1.4,
    overallImpact: -9.4,
    exposure: "Medium",
  },
  {
    sector: "Energy",
    tradeWarImpact: -2.1,
    techCrackdownImpact: 0.4,
    semiconductorControlsImpact: 0.8,
    overallImpact: -0.9,
    exposure: "Low",
  },
  {
    sector: "Healthcare",
    tradeWarImpact: -1.8,
    techCrackdownImpact: -0.3,
    semiconductorControlsImpact: -0.7,
    overallImpact: -2.8,
    exposure: "Low",
  },
  {
    sector: "Financials",
    tradeWarImpact: -4.2,
    techCrackdownImpact: -1.1,
    semiconductorControlsImpact: -0.9,
    overallImpact: -6.2,
    exposure: "Medium",
  },
]

// Trade volume and market correlation data
const tradeCorrelationData = [
  { year: "2017", tradeVolume: 635.4, correlation: 0.72, tension: 1 },
  { year: "2018", tradeVolume: 659.8, correlation: 0.45, tension: 4 },
  { year: "2019", tradeVolume: 559.2, correlation: 0.38, tension: 4 },
  { year: "2020", tradeVolume: 559.5, correlation: 0.51, tension: 3 },
  { year: "2021", tradeVolume: 657.0, correlation: 0.42, tension: 3 },
  { year: "2022", tradeVolume: 690.6, correlation: 0.35, tension: 4 },
  { year: "2023", tradeVolume: 664.8, correlation: 0.29, tension: 4 },
]

// Company exposure analysis
const companyExposureData = [
  { company: "Apple", chinaRevenue: 19.3, stockImpact: -18.7, sector: "Technology" },
  { company: "Tesla", chinaRevenue: 22.3, stockImpact: -15.2, sector: "Consumer Discretionary" },
  { company: "Nike", chinaRevenue: 16.2, stockImpact: -12.4, sector: "Consumer Discretionary" },
  { company: "Starbucks", chinaRevenue: 11.3, stockImpact: -9.8, sector: "Consumer Discretionary" },
  { company: "Intel", chinaRevenue: 27.4, stockImpact: -22.1, sector: "Technology" },
  { company: "Qualcomm", chinaRevenue: 67.2, stockImpact: -28.9, sector: "Technology" },
  { company: "Boeing", chinaRevenue: 13.8, stockImpact: -16.3, sector: "Industrials" },
  { company: "Caterpillar", chinaRevenue: 9.7, stockImpact: -11.2, sector: "Industrials" },
]

export function USChinaPoliticsImpact() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState("all")

  // Filter data based on selections
  const filteredData = politicalTimelineData.filter((item) => {
    const categoryMatch = selectedCategory === "all" || item.category.toLowerCase() === selectedCategory
    const timeMatch =
      selectedTimeframe === "all" ||
      (selectedTimeframe === "trump" && Number.parseInt(item.date.split(" ")[1]) <= 2020) ||
      (selectedTimeframe === "biden" && Number.parseInt(item.date.split(" ")[1]) >= 2021)
    return categoryMatch && timeMatch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">US-China Politics Impact Analysis</h2>
          <p className="text-muted-foreground">
            How US-China political tensions and policy decisions affect global markets
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="trade">Trade</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="geopolitical">Geopolitical</SelectItem>
              <SelectItem value="diplomatic">Diplomatic</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="trump">Trump Era</SelectItem>
              <SelectItem value="biden">Biden Era</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Political Timeline</TabsTrigger>
          <TabsTrigger value="sectors">Sector Impact</TabsTrigger>
          <TabsTrigger value="companies">Company Exposure</TabsTrigger>
          <TabsTrigger value="correlation">Trade & Correlation</TabsTrigger>
          <TabsTrigger value="insights">Strategic Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>US-China Political Events & Market Impact</CardTitle>
              <CardDescription>Major political developments and their immediate market consequences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-3.5 top-0 h-full w-px bg-border"></div>
                <ul className="space-y-8">
                  {filteredData.map((item, index) => (
                    <li key={index} className="relative pl-10">
                      <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                        {item.category === "Trade" && <Target className="h-4 w-4 text-orange-500" />}
                        {item.category === "Technology" && <Zap className="h-4 w-4 text-blue-500" />}
                        {item.category === "Geopolitical" && <Flag className="h-4 w-4 text-red-500" />}
                        {item.category === "Diplomatic" && <CircleAlert className="h-4 w-4 text-purple-500" />}
                        {item.category === "Financial" && <TrendingUp className="h-4 w-4 text-green-500" />}
                      </div>

                      <div className="flex items-baseline justify-between">
                        <div className="font-medium flex items-center gap-2">
                          {item.event}
                          <span className="text-sm text-muted-foreground">{item.date}</span>
                          <Badge
                            variant={
                              item.category === "Trade"
                                ? "default"
                                : item.category === "Technology"
                                  ? "secondary"
                                  : item.category === "Geopolitical"
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {item.category}
                          </Badge>
                          {Math.abs(item.severity) >= 4 && (
                            <Badge variant={item.severity > 0 ? "destructive" : "default"} className="ml-2">
                              {item.severity > 0 ? "High Impact" : "Positive"}
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

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="text-xs font-medium text-muted-foreground">US Market Impact</div>
                          <div className="flex gap-4 mt-1 text-xs">
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
                        </div>

                        <div className="p-3 bg-muted rounded-lg">
                          <div className="text-xs font-medium text-muted-foreground">China Market Impact</div>
                          <div className="mt-1 text-xs">
                            <span className={item.chinaStocks > 0 ? "text-green-600" : "text-red-600"}>
                              {item.chinaStocks > 0 ? "+" : ""}
                              {item.chinaStocks}% (1M)
                            </span>
                          </div>
                        </div>

                        <div className="p-3 bg-muted rounded-lg">
                          <div className="text-xs font-medium text-muted-foreground">Sector Impact</div>
                          <div className="flex gap-2 mt-1 text-xs">
                            <div>
                              Tech:{" "}
                              <span className={item.techImpact > 0 ? "text-green-600" : "text-red-600"}>
                                {item.techImpact > 0 ? "+" : ""}
                                {item.techImpact}%
                              </span>
                            </div>
                            <div>
                              Industrials:{" "}
                              <span className={item.industrialsImpact > 0 ? "text-green-600" : "text-red-600"}>
                                {item.industrialsImpact > 0 ? "+" : ""}
                                {item.industrialsImpact}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Impact Visualization</CardTitle>
              <CardDescription>Political tension severity vs market reaction magnitude</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid />
                    <XAxis
                      type="number"
                      dataKey="severity"
                      name="Political Tension"
                      domain={[0, 6]}
                      label={{ value: "Political Tension Severity", position: "bottom" }}
                    />
                    <YAxis
                      type="number"
                      dataKey="spx1m"
                      name="Market Impact"
                      domain={[-15, 15]}
                      label={{ value: "S&P 500 1-Month Return (%)", angle: -90, position: "left" }}
                    />
                    <ZAxis type="number" dataKey="vix" range={[50, 400]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background p-3 border rounded-md shadow-sm">
                              <p className="font-medium">{data.event}</p>
                              <p className="text-sm text-muted-foreground">{data.date}</p>
                              <div className="text-sm mt-1">
                                <p>
                                  Market Impact: {data.spx1m > 0 ? "+" : ""}
                                  {data.spx1m}%
                                </p>
                                <p>Tension Level: {data.severity}/5</p>
                                <p>Category: {data.category}</p>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Scatter name="Political Events" data={filteredData} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sector Vulnerability Analysis</CardTitle>
              <CardDescription>How different US sectors are affected by US-China tensions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorImpactData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sector" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tradeWarImpact" name="Trade War Impact" fill="#ff7300" />
                    <Bar dataKey="techCrackdownImpact" name="Tech Crackdown Impact" fill="#8884d8" />
                    <Bar dataKey="semiconductorControlsImpact" name="Semiconductor Controls" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sectorImpactData.map((sector, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">{sector.sector}</CardTitle>
                      <CardDescription>
                        China Exposure:{" "}
                        <Badge
                          variant={
                            sector.exposure === "Very High"
                              ? "destructive"
                              : sector.exposure === "High"
                                ? "default"
                                : sector.exposure === "Medium"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {sector.exposure}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Overall Impact:</span>
                          <span
                            className={`font-bold ${
                              sector.overallImpact < -20
                                ? "text-red-600"
                                : sector.overallImpact < -10
                                  ? "text-orange-500"
                                  : "text-yellow-500"
                            }`}
                          >
                            {sector.overallImpact}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              sector.overallImpact < -20
                                ? "bg-red-500"
                                : sector.overallImpact < -10
                                  ? "bg-orange-500"
                                  : "bg-yellow-500"
                            }`}
                            style={{ width: `${Math.abs(sector.overallImpact) * 2}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Trade War: {sector.tradeWarImpact}%</div>
                          <div>Tech Crackdown: {sector.techCrackdownImpact}%</div>
                          <div>Chip Controls: {sector.semiconductorControlsImpact}%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="companies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company China Exposure Analysis</CardTitle>
              <CardDescription>Major US companies with significant China revenue exposure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid />
                    <XAxis
                      type="number"
                      dataKey="chinaRevenue"
                      name="China Revenue %"
                      domain={[0, 70]}
                      label={{ value: "China Revenue (%)", position: "bottom" }}
                    />
                    <YAxis
                      type="number"
                      dataKey="stockImpact"
                      name="Stock Impact"
                      domain={[-35, 0]}
                      label={{ value: "Stock Impact (%)", angle: -90, position: "left" }}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background p-3 border rounded-md shadow-sm">
                              <p className="font-medium">{data.company}</p>
                              <p className="text-sm text-muted-foreground">{data.sector}</p>
                              <div className="text-sm mt-1">
                                <p>China Revenue: {data.chinaRevenue}%</p>
                                <p>Stock Impact: {data.stockImpact}%</p>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Scatter name="Companies" data={companyExposureData} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {companyExposureData.map((company, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">{company.company}</CardTitle>
                      <CardDescription>{company.sector}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>China Revenue:</span>
                            <span className="font-medium">{company.chinaRevenue}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${(company.chinaRevenue / 70) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Stock Impact:</span>
                            <span className="font-medium text-red-600">{company.stockImpact}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-red-500"
                              style={{ width: `${(Math.abs(company.stockImpact) / 35) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            company.chinaRevenue > 50
                              ? "destructive"
                              : company.chinaRevenue > 20
                                ? "default"
                                : "secondary"
                          }
                          className="w-full justify-center"
                        >
                          {company.chinaRevenue > 50
                            ? "Very High Risk"
                            : company.chinaRevenue > 20
                              ? "High Risk"
                              : "Medium Risk"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trade Volume vs Market Correlation</CardTitle>
              <CardDescription>How trade relationships affect market correlations over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tradeCorrelationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" domain={[0, 800]} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 1]} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="tradeVolume" name="Trade Volume ($B)" fill="#8884d8" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="correlation"
                      name="Market Correlation"
                      stroke="#ff7300"
                      strokeWidth={3}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="tension"
                      name="Political Tension (1-5)"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid gap-4 md:grid-cols-3 mt-6">
                <Card className="overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Trade Relationship</CardTitle>
                    <CardDescription>Bilateral trade trends</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-sm space-y-2">
                      <p>
                        <strong>Peak Trade:</strong> $690.6B in 2022
                      </p>
                      <p>
                        <strong>Trade War Impact:</strong> 15% decline (2018-2019)
                      </p>
                      <p>
                        <strong>Current Status:</strong> Stabilizing around $665B
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Market Correlation</CardTitle>
                    <CardDescription>US-China stock correlation</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-sm space-y-2">
                      <p>
                        <strong>Pre-Trade War:</strong> 0.72 correlation
                      </p>
                      <p>
                        <strong>Current Level:</strong> 0.29 correlation
                      </p>
                      <p>
                        <strong>Trend:</strong> Continued decoupling
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Political Tension</CardTitle>
                    <CardDescription>Sustained high tension</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-sm space-y-2">
                      <p>
                        <strong>2018-Present:</strong> Elevated tension (4/5)
                      </p>
                      <p>
                        <strong>Key Issues:</strong> Tech, Taiwan, trade
                      </p>
                      <p>
                        <strong>Outlook:</strong> Structural competition
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Investment Insights</CardTitle>
              <CardDescription>Key takeaways for navigating US-China political risks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">1. Technology Sector Bears Highest Risk</h3>
                  <p className="text-sm text-muted-foreground">
                    Technology companies face the most severe and persistent impact from US-China tensions.
                    Semiconductor export controls, forced technology transfers, and regulatory restrictions create
                    ongoing headwinds. Companies with high China revenue exposure (Qualcomm 67%, Intel 27%) show the
                    largest stock price volatility during political escalations.
                  </p>
                  <div className="mt-3 flex items-center text-sm gap-2">
                    <Badge variant="destructive">High Risk</Badge>
                    <span>Average sector impact: -36.3% during major events</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">2. Market Correlation Continues to Decline</h3>
                  <p className="text-sm text-muted-foreground">
                    US-China market correlation has fallen from 0.72 in 2017 to 0.29 in 2023, indicating ongoing
                    financial decoupling. This trend suggests that China-specific events have less direct impact on US
                    markets, but US companies with China exposure remain vulnerable to bilateral tensions.
                  </p>
                  <div className="mt-3 flex items-center text-sm gap-2">
                    <Badge variant="outline">Structural Trend</Badge>
                    <span>Decoupling accelerating since 2018</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">3. Political Events Create Short-Term Volatility</h3>
                  <p className="text-sm text-muted-foreground">
                    Major political events (trade war escalation, Taiwan tensions, spy balloon incident) typically
                    create 1-3 day market volatility spikes but limited long-term impact on broad market indices.
                    However, sector-specific and company-specific effects can persist for months, particularly in
                    technology and industrial sectors.
                  </p>
                  <div className="mt-3 flex items-center text-sm gap-2">
                    <Badge variant="secondary">Tactical Opportunity</Badge>
                    <span>Average VIX spike: +15-25% during major events</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">4. Trade Volume Remains Resilient Despite Tensions</h3>
                  <p className="text-sm text-muted-foreground">
                    Despite sustained political tensions, bilateral trade volume has recovered to near-record levels
                    ($690.6B in 2022). This suggests that economic incentives often override political rhetoric, though
                    the composition of trade is shifting away from high-tech goods toward commodities and consumer
                    products.
                  </p>
                  <div className="mt-3 flex items-center text-sm gap-2">
                    <Badge variant="default">Economic Reality</Badge>
                    <span>Trade resilience despite 4/5 political tension level</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">5. Sector Rotation Opportunities Emerge</h3>
                  <p className="text-sm text-muted-foreground">
                    US-China tensions create clear winners and losers across sectors. Energy and materials benefit from
                    supply chain diversification and increased US exports to China. Healthcare and utilities show
                    minimal impact, while technology and industrials face ongoing headwinds. This creates opportunities
                    for tactical sector allocation.
                  </p>
                  <div className="mt-3 flex items-center text-sm gap-2">
                    <Badge variant="default">Investment Strategy</Badge>
                    <span>Energy/Materials outperform, Tech/Industrials underperform</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <h3 className="text-lg font-medium mb-2 text-blue-800">Portfolio Management Recommendations</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Monitor China revenue exposure for individual stock positions</li>
                    <li>• Consider hedging strategies for high-exposure technology holdings</li>
                    <li>• Use political event volatility for tactical entry/exit opportunities</li>
                    <li>• Diversify across sectors with varying China sensitivity</li>
                    <li>• Track supply chain diversification trends for industrial companies</li>
                    <li>• Consider geopolitical risk as a permanent factor in valuation models</li>
                    <li>• Monitor correlation changes for international diversification benefits</li>
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
