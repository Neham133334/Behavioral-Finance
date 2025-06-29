"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, BookOpen, TrendingUp, Users, LineChart, AlertTriangle, Lightbulb } from "lucide-react"

export function BehavioralFinancePrinciples() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Behavioral Finance Principles</h2>
        <p className="text-muted-foreground">
          Key concepts from Prof. Robert Shiller's research and behavioral economics
        </p>
      </div>

      <Tabs defaultValue="core" className="space-y-4">
        <TabsList>
          <TabsTrigger value="core">Core Concepts</TabsTrigger>
          <TabsTrigger value="biases">Cognitive Biases</TabsTrigger>
          <TabsTrigger value="applications">Market Applications</TabsTrigger>
          <TabsTrigger value="research">Shiller's Research</TabsTrigger>
        </TabsList>

        <TabsContent value="core" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  Irrational Exuberance
                </CardTitle>
                <CardDescription>Coined by Alan Greenspan, popularized by Shiller</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Irrational exuberance refers to investor enthusiasm that drives asset prices higher than fundamentals
                  justify. Shiller's groundbreaking work demonstrated how psychological factors and social dynamics can
                  create unsustainable market bubbles. His book "Irrational Exuberance" (2000) predicted both the
                  dot-com crash and the housing crisis.
                </p>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Key Insight</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    "The market is not driven by facts but by how investors perceive and react to those facts, often in
                    a social context that amplifies certain narratives."
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-500" />
                  Narrative Economics
                </CardTitle>
                <CardDescription>How stories drive economic events</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Narrative Economics examines how popular stories and explanations spread like epidemics and influence
                  economic behavior. Shiller argues that these narratives can significantly impact markets and the
                  broader economy. The virality of financial stories on social media and news platforms can trigger
                  market movements disconnected from fundamental changes.
                </p>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Key Insight</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    "Popular narratives can change rapidly, causing major economic events that traditional economic
                    models fail to predict or explain."
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  Mean Reversion
                </CardTitle>
                <CardDescription>The tendency of prices to return to average</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Mean reversion is the theory that asset prices and returns eventually move back toward their
                  historical average or mean. Shiller's research on long-term market valuations, particularly through
                  the Shiller P/E (CAPE) ratio, demonstrates that markets tend to correct after periods of significant
                  deviation from historical norms.
                </p>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Key Insight</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    "In the short run, markets are a voting machine, but in the long run, they are a weighing machine.
                    Prices eventually reflect fundamental value."
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  Herd Behavior
                </CardTitle>
                <CardDescription>Social influence in financial decisions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Herd behavior describes how individuals tend to follow the actions of a larger group. In financial
                  markets, this manifests as investors buying or selling assets based on what others are doing rather
                  than on independent analysis. This behavior can amplify market trends and contribute to bubbles and
                  crashes.
                </p>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Key Insight</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    "Even professional investors are susceptible to social influence, often making decisions based on
                    what their peers are doing rather than on fundamental analysis."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="biases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cognitive Biases in Investing</CardTitle>
              <CardDescription>Psychological factors that influence financial decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium">Overconfidence Bias</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Investors systematically overestimate their knowledge and abilities, leading to excessive trading,
                    inadequate diversification, and underestimation of risks. Studies show that more confident investors
                    often achieve lower returns due to higher transaction costs and poor timing decisions.
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium">Loss Aversion</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    The tendency to prefer avoiding losses over acquiring equivalent gains. Kahneman and Tversky's
                    research shows that the pain of losing is psychologically about twice as powerful as the pleasure of
                    gaining. This leads investors to hold losing positions too long and sell winners too early.
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium">Recency Bias</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    The tendency to place too much importance on recent events while underestimating the significance of
                    long-term trends. This causes investors to chase performance, buying assets that have recently
                    performed well and avoiding those with poor recent returns, regardless of fundamentals.
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium">Confirmation Bias</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    The tendency to search for, interpret, and recall information that confirms one's pre-existing
                    beliefs. Investors often seek out information that supports their investment thesis while ignoring
                    contradictory evidence, leading to poor risk assessment and decision-making.
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium">Anchoring Bias</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    The tendency to rely too heavily on the first piece of information encountered (the "anchor").
                    Investors often anchor to purchase prices, historical highs, or arbitrary price levels when making
                    decisions, rather than evaluating current fundamentals objectively.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-blue-500" />
                  Market Bubbles and Crashes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Behavioral finance provides a framework for understanding market bubbles and crashes that traditional
                  efficient market theories struggle to explain. Shiller's research demonstrates how psychological
                  factors and social dynamics create feedback loops that drive prices far from fundamental values.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Formation Phase</p>
                      <p className="text-xs text-muted-foreground">
                        Initial price increases attract attention, creating narratives that draw in more investors
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Expansion Phase</p>
                      <p className="text-xs text-muted-foreground">
                        FOMO (fear of missing out) drives broader participation and media amplification
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Euphoria Phase</p>
                      <p className="text-xs text-muted-foreground">
                        Irrational exuberance takes hold as investors justify extreme valuations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Crash Phase</p>
                      <p className="text-xs text-muted-foreground">
                        Sentiment shifts rapidly, triggering panic selling and price collapse
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Contrarian Investing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Behavioral finance principles support contrarian investing strategies that exploit market
                  inefficiencies created by psychological biases and herd behavior. By recognizing when sentiment has
                  driven prices away from fundamental values, investors can position themselves against the crowd.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Fear & Greed Indicators</p>
                      <p className="text-xs text-muted-foreground">
                        Extreme sentiment readings often signal potential market turning points
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Valuation Metrics</p>
                      <p className="text-xs text-muted-foreground">
                        Tools like the Shiller P/E help identify when markets deviate significantly from historical
                        norms
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Media Analysis</p>
                      <p className="text-xs text-muted-foreground">
                        Excessive optimism or pessimism in financial media often signals potential reversal points
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Institutional Positioning</p>
                      <p className="text-xs text-muted-foreground">
                        Extreme positioning by institutional investors can signal crowded trades ready for reversal
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Practical Applications for Investors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Recognize Your Biases</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Self-awareness is the first step to overcoming cognitive biases. Keep an investment journal to
                      track your decision-making process and emotional states. Review periodically to identify patterns
                      of bias.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Develop a Systematic Approach</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create and follow a well-defined investment process that incorporates both fundamental analysis
                      and sentiment indicators. Having a system helps reduce emotional decision-making during market
                      extremes.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Monitor Sentiment Indicators</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track sentiment metrics like the Fear & Greed Index, put/call ratios, and investor surveys. These
                      can provide valuable contrarian signals when they reach extreme levels.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Evaluate Valuation Context</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Use long-term valuation metrics like the Shiller P/E to assess market conditions. Remember that
                      reversion to the mean is a powerful force in financial markets over the long term.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Analyze Prevailing Narratives</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Critically examine popular market narratives. When a single story dominates financial media,
                      consider whether it's fully priced in or creating potential opportunities for contrarian
                      positions.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Embrace Diversification</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Diversification is the practical application of humility in investing. It acknowledges that our
                      predictions are often wrong and protects against the overconfidence bias that affects most
                      investors.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="research" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Robert Shiller's Key Research Contributions</CardTitle>
              <CardDescription>Nobel Prize-winning work in behavioral finance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Cyclically Adjusted Price-to-Earnings (CAPE) Ratio</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Developed by Shiller and John Campbell in the late 1980s, the CAPE ratio (also known as the Shiller
                    P/E) measures stock prices against the average of ten years of earnings, adjusted for inflation.
                    This metric provides a more stable measure of valuation by smoothing out short-term earnings
                    fluctuations and business cycles.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    The CAPE ratio has proven to be one of the most effective predictors of long-term stock market
                    returns. Shiller demonstrated that when the CAPE is high, subsequent 10-year returns tend to be
                    lower, and vice versa.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Housing Market Analysis</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Shiller pioneered the study of housing markets through a behavioral lens. He co-created the
                    Case-Shiller Home Price Index, which has become the standard benchmark for U.S. residential real
                    estate prices. His research identified the housing bubble in the early 2000s, warning of its
                    potential collapse years before the 2008 crisis.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    His work demonstrated that housing prices, like stock prices, can deviate significantly from
                    fundamental values due to psychological factors and social dynamics, challenging the conventional
                    wisdom that housing was always a safe investment.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Market Volatility Research</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Shiller's early research focused on why stock markets are more volatile than would be predicted by
                    efficient market theories. His 1981 paper "Do Stock Prices Move Too Much to be Justified by
                    Subsequent Changes in Dividends?" demonstrated that stock price movements far exceed what would be
                    justified by changes in fundamental information.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This groundbreaking work challenged the Efficient Market Hypothesis and laid the foundation for
                    behavioral finance by suggesting that psychological factors play a significant role in market
                    movements.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Narrative Economics</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    In recent years, Shiller has focused on how popular narratives influence economic behavior and
                    market movements. His 2019 book "Narrative Economics" explores how stories spread like epidemics and
                    can drive major economic events.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This work integrates insights from epidemiology, psychology, and sociology to understand how
                    narratives go viral and influence collective economic behavior. Shiller argues that economists must
                    study changing popular narratives to better understand and predict economic events.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
