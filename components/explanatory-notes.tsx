"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BarChart2, LineChart, BarChart, PieChart } from "lucide-react"

export function ExplanatoryNotes() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">📝 Explanatory Notes</h2>
        <p className="text-muted-foreground">Understanding the tools and metrics used in behavioral finance analysis</p>
      </div>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="indicators">Sentiment Indicators</TabsTrigger>
          <TabsTrigger value="tools">Analysis Tools</TabsTrigger>
          <TabsTrigger value="glossary">Glossary</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Core Valuation Metrics</CardTitle>
              <CardDescription>Fundamental measures used to assess market valuation</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="shiller-pe">
                  <AccordionTrigger className="text-lg font-medium">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-blue-500" />
                      Shiller P/E (CAPE) Ratio
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm space-y-2">
                    <p>
                      <strong>Definition:</strong> The Cyclically Adjusted Price-to-Earnings ratio (CAPE), also known as
                      the Shiller P/E, measures the price of the S&P 500 relative to its inflation-adjusted average
                      earnings over the past 10 years.
                    </p>
                    <p>
                      <strong>Purpose:</strong> By using a 10-year average of earnings, the Shiller P/E smooths out
                      short-term fluctuations in corporate profits caused by business cycles, providing a more stable
                      valuation metric than the traditional P/E ratio.
                    </p>
                    <p>
                      <strong>Interpretation:</strong> A high Shiller P/E (above historical average of ~16.9) suggests
                      the market may be overvalued, while a low ratio suggests potential undervaluation. The metric has
                      been a reliable predictor of long-term (10+ year) market returns.
                    </p>
                    <p>
                      <strong>Limitations:</strong> Critics note that accounting standards have changed over time, and
                      the 10-year window may not always be appropriate. The metric also doesn't account for changes in
                      interest rates, which affect fair valuations.
                    </p>
                    <div className="p-3 bg-muted rounded-lg mt-2">
                      <p className="font-medium">Historical Context:</p>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        <li>Pre-1929 Crash: ~30</li>
                        <li>2000 Dot-Com Peak: ~44</li>
                        <li>2009 Financial Crisis Low: ~15</li>
                        <li>Current (2023): ~30-33</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fear-greed">
                  <AccordionTrigger className="text-lg font-medium">
                    <div className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-green-500" />
                      Fear & Greed Index
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm space-y-2">
                    <p>
                      <strong>Definition:</strong> The Fear & Greed Index is a composite indicator that measures
                      investor sentiment using multiple market metrics, including volatility, put/call ratios, market
                      momentum, and junk bond demand.
                    </p>
                    <p>
                      <strong>Purpose:</strong> The index aims to quantify market psychology, based on the premise that
                      extreme fear often represents buying opportunities, while extreme greed suggests markets may be
                      due for a correction.
                    </p>
                    <p>
                      <strong>Interpretation:</strong> The index ranges from 0 (Extreme Fear) to 100 (Extreme Greed),
                      with values below 25 indicating extreme fear and values above 75 indicating extreme greed.
                    </p>
                    <p>
                      <strong>Components:</strong> The index typically includes:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Stock Price Momentum (S&P 500 vs 125-day moving average)</li>
                      <li>Stock Price Strength (number of stocks hitting 52-week highs vs lows)</li>
                      <li>Stock Price Breadth (advancing vs declining volume)</li>
                      <li>Put/Call Ratio (options trading volume)</li>
                      <li>Junk Bond Demand (spread between yields on investment grade and junk bonds)</li>
                      <li>Market Volatility (VIX)</li>
                      <li>Safe Haven Demand (difference in returns for stocks vs treasuries)</li>
                    </ul>
                    <div className="p-3 bg-muted rounded-lg mt-2">
                      <p className="font-medium">Contrarian Signal:</p>
                      <p className="mt-1">
                        The Fear & Greed Index is most valuable as a contrarian indicator at extremes. When the index
                        shows "Extreme Fear," markets have often been near bottoms. Conversely, "Extreme Greed" has
                        often preceded corrections.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="sentiment-analysis">
                  <AccordionTrigger className="text-lg font-medium">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-purple-500" />
                      Sentiment Analysis
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm space-y-2">
                    <p>
                      <strong>Definition:</strong> Sentiment analysis uses natural language processing and machine
                      learning to evaluate the emotional tone and attitude expressed in text data from sources like
                      social media, news articles, and forum posts.
                    </p>
                    <p>
                      <strong>Purpose:</strong> In financial markets, sentiment analysis quantifies investor mood and
                      opinion, which can influence market movements independent of fundamental factors.
                    </p>
                    <p>
                      <strong>Methodology:</strong> Modern sentiment analysis typically involves:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Text collection from relevant sources (Twitter, Reddit, financial news)</li>
                      <li>Pre-processing to clean and standardize text</li>
                      <li>Analysis using lexicon-based methods or machine learning models</li>
                      <li>Scoring on scales like positive/negative or bullish/bearish</li>
                      <li>Aggregation into sentiment indices</li>
                    </ul>
                    <p>
                      <strong>Interpretation:</strong> Sentiment scores typically range from 0-100, with higher numbers
                      indicating more positive sentiment. Extreme readings or rapid changes in sentiment can signal
                      potential market turning points.
                    </p>
                    <div className="p-3 bg-muted rounded-lg mt-2">
                      <p className="font-medium">Behavioral Finance Context:</p>
                      <p className="mt-1">
                        Sentiment analysis helps quantify the emotional aspects of markets that traditional financial
                        theory often ignores. It can identify periods when markets are driven more by psychology than
                        fundamentals, potentially creating mispricing opportunities.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="correlation-analysis">
                  <AccordionTrigger className="text-lg font-medium">
                    <div className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-orange-500" />
                      Correlation Analysis
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm space-y-2">
                    <p>
                      <strong>Definition:</strong> Correlation analysis measures the statistical relationship between
                      two variables, such as sentiment indicators and market returns, or between different asset
                      classes.
                    </p>
                    <p>
                      <strong>Purpose:</strong> In behavioral finance, correlation analysis helps identify relationships
                      between psychological factors and market movements, potentially revealing causal connections or
                      predictive patterns.
                    </p>
                    <p>
                      <strong>Measurement:</strong> Correlation is typically measured using the Pearson correlation
                      coefficient (r), which ranges from -1 (perfect negative correlation) to +1 (perfect positive
                      correlation), with 0 indicating no correlation.
                    </p>
                    <p>
                      <strong>Interpretation:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Strong positive correlation (0.7 to 1.0): Variables move strongly together</li>
                      <li>Moderate positive correlation (0.3 to 0.7): Variables tend to move together</li>
                      <li>Weak positive correlation (0 to 0.3): Variables have slight tendency to move together</li>
                      <li>Negative correlations: Variables move in opposite directions</li>
                    </ul>
                    <div className="p-3 bg-muted rounded-lg mt-2">
                      <p className="font-medium">Important Caveats:</p>
                      <p className="mt-1">
                        Correlation does not imply causation. A strong correlation between sentiment and market
                        movements doesn't necessarily mean one causes the other. Additionally, correlations can change
                        over time, especially during market stress periods when many assets become more correlated.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="indicators" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Indicators</CardTitle>
              <CardDescription>Tools for measuring market psychology and investor behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Social Media Sentiment</h3>
                  <p className="text-sm text-muted-foreground">
                    Analysis of posts, comments, and discussions on platforms like Twitter, Reddit, and StockTwits to
                    gauge retail investor sentiment. Natural language processing algorithms identify bullish/bearish
                    language, emotional content, and topic trends.
                  </p>
                  <div className="mt-3">
                    <h4 className="text-sm font-medium">Key Platforms:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                      <li>Reddit (r/investing, r/wallstreetbets, r/stocks)</li>
                      <li>Twitter (cashtags like $AAPL, financial influencers)</li>
                      <li>StockTwits (dedicated stock discussion platform)</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">News Sentiment Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Algorithmic analysis of financial news articles, press releases, and analyst reports to quantify
                    sentiment. More sophisticated than social media analysis, news sentiment often incorporates context,
                    source credibility, and topic relevance.
                  </p>
                  <div className="mt-3">
                    <h4 className="text-sm font-medium">Measurement Approaches:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                      <li>Volume analysis (number of positive vs. negative stories)</li>
                      <li>Intensity scoring (strength of positive/negative language)</li>
                      <li>Topic modeling (identifying key themes and concerns)</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Technical Sentiment Indicators</h3>
                  <p className="text-sm text-muted-foreground">
                    Market-derived metrics that reflect investor positioning and sentiment through actual trading
                    behavior rather than expressed opinions.
                  </p>
                  <div className="mt-3 space-y-3">
                    <div>
                      <h4 className="text-sm font-medium">Put/Call Ratio:</h4>
                      <p className="text-sm text-muted-foreground">
                        Measures the volume of put options relative to call options. High ratios indicate bearish
                        sentiment (investors buying protection), while low ratios suggest bullish sentiment.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">VIX (Volatility Index):</h4>
                      <p className="text-sm text-muted-foreground">
                        Often called the "fear gauge," the VIX measures expected market volatility implied by S&P 500
                        options prices. High VIX readings (above 30) indicate fear, while low readings (below 20)
                        suggest complacency.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">AAII Investor Sentiment Survey:</h4>
                      <p className="text-sm text-muted-foreground">
                        Weekly survey of individual investors categorized as bullish, bearish, or neutral. Extreme
                        readings (over 50% in either direction) often serve as contrarian indicators.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Positioning Indicators</h3>
                  <p className="text-sm text-muted-foreground">
                    Metrics that reveal how different market participants are positioned, which can indicate sentiment
                    extremes and potential reversals.
                  </p>
                  <div className="mt-3 space-y-3">
                    <div>
                      <h4 className="text-sm font-medium">Commitment of Traders (COT):</h4>
                      <p className="text-sm text-muted-foreground">
                        Weekly report showing positions of commercial hedgers, large speculators, and small traders in
                        futures markets. Extreme positioning by any group can signal potential market turns.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Fund Manager Survey:</h4>
                      <p className="text-sm text-muted-foreground">
                        Monthly survey of institutional investors' asset allocation, risk positioning, and economic
                        outlook. Extreme readings in cash levels or equity allocations often precede market shifts.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Short Interest:</h4>
                      <p className="text-sm text-muted-foreground">
                        Measures the percentage of a stock's float that is sold short. High short interest indicates
                        bearish sentiment but can also create conditions for a "short squeeze" if sentiment improves.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Tools</CardTitle>
              <CardDescription>How to use the dashboard's features for behavioral finance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Sentiment Tracker</h3>
                  <p className="text-sm text-muted-foreground">
                    The Sentiment Tracker aggregates sentiment data from multiple sources (social media, news, surveys)
                    to provide a comprehensive view of market psychology. It's particularly useful for identifying
                    sentiment extremes that may signal potential market turning points.
                  </p>
                  <div className="mt-3">
                    <h4 className="text-sm font-medium">How to Use:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                      <li>Monitor for extreme readings (above 80 or below 20) as potential contrarian signals</li>
                      <li>Compare sentiment across different platforms to identify divergences</li>
                      <li>Track sentiment trends over time relative to market performance</li>
                      <li>Use topic analysis to identify emerging narratives and concerns</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Shiller P/E Tracker</h3>
                  <p className="text-sm text-muted-foreground">
                    The Shiller P/E Tracker monitors the Cyclically Adjusted Price-to-Earnings ratio over time,
                    comparing current levels to historical averages and previous market peaks/troughs. This tool helps
                    assess long-term market valuation and potential future returns.
                  </p>
                  <div className="mt-3">
                    <h4 className="text-sm font-medium">How to Use:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                      <li>Compare current Shiller P/E to historical average (16.9) to gauge valuation</li>
                      <li>Review expected returns based on current valuation levels</li>
                      <li>Examine historical market cycles to understand valuation patterns</li>
                      <li>Use percentile ranking to assess relative valuation context</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Fear & Greed Index</h3>
                  <p className="text-sm text-muted-foreground">
                    The Fear & Greed Index combines multiple market indicators to measure investor sentiment on a scale
                    from extreme fear to extreme greed. This composite indicator provides a quick snapshot of market
                    psychology and potential turning points.
                  </p>
                  <div className="mt-3">
                    <h4 className="text-sm font-medium">How to Use:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                      <li>Use extreme readings (below 25 or above 75) as potential contrarian signals</li>
                      <li>Examine individual components to understand what's driving sentiment</li>
                      <li>Track changes in the index for early warning signs of sentiment shifts</li>
                      <li>Compare current readings to historical patterns during similar market conditions</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Sentiment-Market Correlation</h3>
                  <p className="text-sm text-muted-foreground">
                    The Correlation Analysis tool examines the statistical relationship between sentiment indicators and
                    market performance. This helps identify which sentiment metrics have predictive power and under what
                    conditions.
                  </p>
                  <div className="mt-3">
                    <h4 className="text-sm font-medium">How to Use:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                      <li>Analyze correlation strength to determine which sentiment sources are most reliable</li>
                      <li>Examine scatter plots to identify non-linear relationships and outliers</li>
                      <li>Compare correlations across different time periods and market conditions</li>
                      <li>Use statistical significance measures to assess reliability of correlations</li>
                      <li>Look for leading indicators where sentiment changes precede market moves</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Custom Stock Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    The Custom Stock Analysis tool allows you to apply behavioral finance principles to individual
                    stocks or portfolios. It combines technical indicators, sentiment data, and correlation analysis for
                    specific securities.
                  </p>
                  <div className="mt-3">
                    <h4 className="text-sm font-medium">How to Use:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                      <li>Enter ticker symbols for stocks you want to analyze</li>
                      <li>Compare stock-specific sentiment to broader market sentiment</li>
                      <li>Analyze correlations between your stocks and macro factors</li>
                      <li>Identify potential behavioral biases affecting specific stocks</li>
                      <li>Monitor technical indicators for signs of sentiment extremes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="glossary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Behavioral Finance Glossary</CardTitle>
              <CardDescription>Key terms and concepts in behavioral economics and finance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium">Anchoring Bias</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The tendency to rely too heavily on the first piece of information encountered (the "anchor"). In
                    investing, this often manifests as anchoring to purchase prices or recent highs/lows when making
                    decisions.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium">Availability Bias</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The tendency to overweight information that comes readily to mind. Investors often give too much
                    importance to recent, dramatic, or personally experienced events when assessing probabilities.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium">Confirmation Bias</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The tendency to search for, interpret, and recall information that confirms one's pre-existing
                    beliefs. Investors often seek out information that supports their investment thesis while ignoring
                    contradictory evidence.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium">Herding Behavior</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The tendency of individuals to mimic the actions of a larger group. In markets, this leads to
                    momentum trading, bubbles, and crashes as investors follow others rather than conducting independent
                    analysis.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium">Loss Aversion</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The tendency to prefer avoiding losses over acquiring equivalent gains. Research shows that the pain
                    of losing is psychologically about twice as powerful as the pleasure of gaining, leading to
                    risk-averse behavior.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium">Overconfidence Bias</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The tendency to overestimate one's knowledge, abilities, and the precision of one's forecasts. In
                    investing, this leads to excessive trading, inadequate diversification, and underestimation of
                    risks.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium">Recency Bias</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The tendency to place greater importance on recent events and extrapolate recent trends into the
                    future. This can lead investors to chase performance and buy high/sell low.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium">Disposition Effect</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The tendency to sell winning investments too early to lock in gains and hold losing investments too
                    long in hopes of breaking even. This behavior is explained by prospect theory and mental accounting.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium">Narrative Fallacy</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The tendency to create explanatory stories that connect unrelated facts and random events. In
                    markets, this leads to overinterpretation of market movements and attribution of causality where
                    none exists.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium">Home Bias</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The tendency to invest disproportionately in domestic markets due to familiarity. This leads to
                    suboptimal portfolio diversification and increased country-specific risk.
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
