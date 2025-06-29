import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, Activity } from "lucide-react"

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Market Psychology Overview</h2>
        <p className="text-muted-foreground">
          Real-time behavioral finance indicators inspired by Prof. Robert Shiller's research
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bullish</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last week
            </p>
            <Badge variant="secondary" className="mt-2">
              Reddit: 68% Positive
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fear & Greed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72</div>
            <p className="text-xs text-muted-foreground">Greed Territory</p>
            <Badge variant="destructive" className="mt-2">
              High Risk
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shiller P/E</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">31.2</div>
            <p className="text-xs text-muted-foreground">Historical Average: 16.9</p>
            <Badge variant="outline" className="mt-2">
              Overvalued
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bubble Risk</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">High</div>
            <p className="text-xs text-muted-foreground">Tech sector divergence</p>
            <Badge variant="destructive" className="mt-2">
              Monitor Closely
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>Current market psychology indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Social Media Sentiment Surge</p>
                <p className="text-sm text-muted-foreground">
                  Reddit and Twitter showing increased bullish sentiment, particularly in tech stocks
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Elevated Valuations</p>
                <p className="text-sm text-muted-foreground">
                  Shiller P/E ratio indicates market overvaluation compared to historical norms
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Fear & Greed Imbalance</p>
                <p className="text-sm text-muted-foreground">
                  Current greed levels suggest potential market correction ahead
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Behavioral Finance Principles</CardTitle>
            <CardDescription>Key concepts from Prof. Shiller's research</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Irrational Exuberance</h4>
              <p className="text-sm text-muted-foreground">
                Market prices driven by investor psychology rather than fundamentals
              </p>
            </div>
            <div>
              <h4 className="font-medium">Narrative Economics</h4>
              <p className="text-sm text-muted-foreground">
                How stories and social media sentiment influence market behavior
              </p>
            </div>
            <div>
              <h4 className="font-medium">Mean Reversion</h4>
              <p className="text-sm text-muted-foreground">
                Long-term tendency for asset prices to return to historical averages
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
