import { type NextRequest, NextResponse } from "next/server"

// Fear & Greed Index calculation based on multiple indicators
export async function GET(request: NextRequest) {
  try {
    // Fetch VIX data (volatility indicator)
    const vixData = await fetchVIXData()

    // Fetch put/call ratio
    const putCallRatio = await fetchPutCallRatio()

    // Fetch market breadth data
    const marketBreadth = await fetchMarketBreadth()

    // Fetch junk bond demand (high yield spreads)
    const junkBondDemand = await fetchJunkBondDemand()

    // Fetch safe haven demand (treasury yields)
    const safeHavenDemand = await fetchSafeHavenDemand()

    // Calculate individual component scores (0-100)
    const components = {
      stockPriceMomentum: calculateMomentumScore(),
      stockPriceStrength: calculateStrengthScore(),
      stockPriceBreadth: calculateBreadthScore(marketBreadth),
      putCallRatio: calculatePutCallScore(putCallRatio),
      junkBondDemand: calculateJunkBondScore(junkBondDemand),
      marketVolatility: calculateVolatilityScore(vixData),
      safeHavenDemand: calculateSafeHavenScore(safeHavenDemand),
    }

    // Calculate weighted Fear & Greed Index
    const weights = {
      stockPriceMomentum: 0.2,
      stockPriceStrength: 0.2,
      stockPriceBreadth: 0.1,
      putCallRatio: 0.1,
      junkBondDemand: 0.1,
      marketVolatility: 0.2,
      safeHavenDemand: 0.1,
    }

    const fearGreedIndex = Math.round(
      Object.entries(components).reduce((total, [key, value]) => {
        return total + value * weights[key as keyof typeof weights]
      }, 0),
    )

    const getLabel = (index: number) => {
      if (index <= 25) return "Extreme Fear"
      if (index <= 45) return "Fear"
      if (index <= 55) return "Neutral"
      if (index <= 75) return "Greed"
      return "Extreme Greed"
    }

    return NextResponse.json({
      index: fearGreedIndex,
      label: getLabel(fearGreedIndex),
      components: Object.entries(components).map(([name, value]) => ({
        name: name.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
        value: Math.round(value),
        weight: weights[name as keyof typeof weights] * 100,
      })),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Fear & Greed Index error:", error)
    return NextResponse.json({ error: "Failed to calculate Fear & Greed Index" }, { status: 500 })
  }
}

// Mock implementations - replace with actual data sources
async function fetchVIXData() {
  // Fetch from CBOE or financial data provider
  return { current: 18.5, average: 20.0 }
}

async function fetchPutCallRatio() {
  // Fetch from CBOE or options data provider
  return { current: 0.85, average: 1.0 }
}

async function fetchMarketBreadth() {
  // Fetch advancing vs declining stocks
  return { advancing: 1200, declining: 800, unchanged: 100 }
}

async function fetchJunkBondDemand() {
  // Fetch high yield bond spreads
  return { currentSpread: 4.2, averageSpread: 5.0 }
}

async function fetchSafeHavenDemand() {
  // Fetch treasury yields and gold prices
  return { tenYearYield: 4.5, goldPrice: 2000 }
}

function calculateMomentumScore(): number {
  // Calculate based on recent price momentum
  return 75 // Mock value
}

function calculateStrengthScore(): number {
  // Calculate based on 52-week highs vs lows
  return 70 // Mock value
}

function calculateBreadthScore(breadth: any): number {
  const ratio = breadth.advancing / (breadth.advancing + breadth.declining)
  return ratio * 100
}

function calculatePutCallScore(putCall: any): number {
  // Lower put/call ratio = more greed
  return Math.max(0, Math.min(100, (2 - putCall.current) * 50))
}

function calculateJunkBondScore(junkBond: any): number {
  // Lower spreads = more greed
  return Math.max(0, Math.min(100, (10 - junkBond.currentSpread) * 10))
}

function calculateVolatilityScore(vix: any): number {
  // Lower VIX = more greed
  return Math.max(0, Math.min(100, (50 - vix.current) * 2))
}

function calculateSafeHavenScore(safeHaven: any): number {
  // Lower safe haven demand = more greed
  return 65 // Mock value
}
