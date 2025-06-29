# 🌍 Global Behavioral Finance Dashboard

A comprehensive behavioral finance analysis platform inspired by Yale's Financial Markets course and Nobel laureate Robert Shiller's research. This dashboard combines live market data, sentiment analysis, geopolitical impact assessment, and educational content to provide deep insights into global market psychology and behavioral patterns.

## 🎯 Project Overview

This advanced dashboard implements cutting-edge behavioral finance concepts with real-time data integration and geopolitical analysis, providing users with:

- **Live Global Market Analysis**: Real-time stock quotes, sentiment tracking, and economic indicators across US, European, and Chinese markets
- **Geopolitical Impact Assessment**: Comprehensive analysis of how EU policies and US-China political tensions affect global markets
- **Historical Case Studies**: In-depth analysis of major market events (Dot-com bubble, 2008 crisis, COVID crash, Trade wars)
- **Educational Tools**: Comprehensive explanations of behavioral finance concepts and metrics
- **Interactive Visualizations**: Dynamic charts, correlation analysis, and geopolitical risk mapping
- **Custom Portfolio Tracking**: Personal stock analysis with macro correlation insights and geopolitical risk assessment

## 🚀 Features

### 📈 **Live Market Data Integration**
- **Real-time Stock Quotes**: 30-second refresh intervals using Financial Modeling Prep API
- **Global Sentiment Analysis**: Live news and social media sentiment tracking across regions
- **Fear & Greed Index**: Market psychology indicators with historical context
- **Shiller P/E Tracker**: Cyclically Adjusted Price-to-Earnings ratios with forecasting
- **Cross-Border Correlations**: Real-time correlation analysis between global markets

### 🌍 **Geopolitical Analysis**
- **EU Policy Impact**: How European Union decisions affect US markets
- **US-China Politics**: Comprehensive analysis of bilateral tensions and market effects
- **Trade War Timeline**: Historical analysis of trade disputes and market reactions
- **Regulatory Impact**: Cross-border effects of major policy decisions
- **Political Risk Assessment**: Quantified geopolitical risk metrics

### 📚 **Educational Content**
- **Case Studies**: Detailed analysis of historical market bubbles and crashes
- **Explanatory Notes**: Comprehensive guides to all metrics and tools
- **Behavioral Finance Principles**: Key concepts from academic research
- **Interactive Glossary**: Essential terms and definitions
- **Geopolitical Frameworks**: Understanding how politics affects markets

### 🔍 **Advanced Analysis Tools**
- **Custom Stock Analysis**: Add any global stock symbol for detailed analysis
- **Portfolio Overview**: Track multiple stocks with technical indicators and geopolitical risk
- **Sentiment vs Market Correlation**: Analyze how sentiment affects market performance
- **Bubble Visualization**: Interactive charts showing market cycles
- **News Sentiment Analysis**: AI-powered analysis of financial news across regions
- **Political Event Impact**: Quantified analysis of political events on market movements

### 📊 **Data Visualization**
- **Interactive Charts**: Built with Recharts for responsive, dynamic visualizations
- **Real-time Updates**: Live data streaming with loading states
- **Historical Comparisons**: Compare current metrics with historical averages
- **Correlation Heatmaps**: Visual representation of global asset correlations
- **Geopolitical Risk Maps**: Visual indicators of political tension levels

## 🛠 Technology Stack

### **Frontend**
- **Framework**: Next.js 14 with App Router
- **UI Library**: shadcn/ui components with Tailwind CSS
- **Charts**: Recharts for interactive data visualization
- **Icons**: Lucide React for consistent iconography
- **Styling**: Tailwind CSS with custom design system

### **Backend & APIs**
- **Runtime**: Node.js with Next.js API routes
- **Stock Data**: Financial Modeling Prep API (250 requests/day free)
- **News Data**: NewsAPI (1000 requests/day free) + GNews backup
- **Economic Data**: Federal Reserve Economic Data (FRED) API
- **Social Sentiment**: Reddit and Twitter API integration
- **European Data**: European financial news and market data

### **Data Processing**
- **Sentiment Analysis**: Custom algorithm with 40+ financial keywords
- **Technical Indicators**: RSI, MACD, Bollinger Bands calculations
- **Statistical Analysis**: Correlation coefficients and regression analysis
- **Time Series**: Historical data processing and trend analysis
- **Geopolitical Scoring**: Quantified political risk assessment

## 📊 API Integration Details

### **Primary Data Sources**
| API | Purpose | Free Tier | Refresh Rate | Coverage |
|-----|---------|-----------|--------------|----------|
| **Financial Modeling Prep** | Global stock quotes, fundamentals | 250 req/day | 30 seconds | US, EU, Asia |
| **NewsAPI** | Financial news sentiment | 1000 req/day | 15 minutes | Global |
| **GNews** | Backup news source | 100 req/day | 15 minutes | Global |
| **FRED** | Economic indicators | Unlimited | 1 hour | US, Global |
| **Alpha Vantage** | Backup stock data | 25 req/day | 1 minute | Global |

### **Data Quality System**
- **Live Data Indicators**: Visual badges showing data freshness
- **Fallback Mechanisms**: Multiple API sources prevent failures
- **Mock Data**: Realistic simulated data when APIs are unavailable
- **Error Handling**: Graceful degradation with user notifications
- **Regional Coverage**: Comprehensive global market coverage

## 🔧 Installation & Setup

### **Prerequisites**
- Node.js 18+ installed
- Git installed
- API keys from data providers (see Environment Variables section)

### **Quick Start**
\`\`\`bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/behavioral-finance-dashboard.git

# Navigate to project directory
cd behavioral-finance-dashboard

# Install dependencies
npm install

# Set up environment variables (see .env.example)
cp .env.example .env.local

# Run development server
npm run dev

# Open browser
open http://localhost:3000
\`\`\`

### **Environment Variables**
Create a \`.env.local\` file with the following variables:

\`\`\`env
# Stock Data APIs
FMP_API_KEY=your_financial_modeling_prep_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key

# News APIs
NEWS_API_KEY=your_newsapi_key
GNEWS_API_KEY=your_gnews_key

# Economic Data
FRED_API_KEY=your_fred_api_key

# Social Media APIs (Optional)
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
\`\`\`

### **Getting API Keys**

1. **Financial Modeling Prep** (Recommended for global stocks)
   - Visit: https://financialmodelingprep.com/developer/docs
   - Free tier: 250 requests/day
   - Global market coverage including EU and Asian stocks

2. **NewsAPI** (Primary news source)
   - Visit: https://newsapi.org/
   - Free tier: 1000 requests/day
   - Global news coverage with country filtering

3. **GNews** (Backup news source)
   - Visit: https://gnews.io/
   - Free tier: 100 requests/day
   - International news coverage

4. **FRED** (Economic data)
   - Visit: https://fred.stlouisfed.org/docs/api/api_key.html
   - Free with registration
   - Global economic indicators

5. **Alpha Vantage** (Backup stock data)
   - Visit: https://www.alphavantage.co/support/#api-key
   - Free tier: 25 requests/day
   - Global market coverage

## 📁 Project Structure

\`\`\`
behavioral-finance-dashboard/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── fear-greed/          # Fear & Greed Index endpoint
│   │   ├── financial/           # Financial data endpoint
│   │   ├── macro-correlations/  # Macro correlation analysis
│   │   ├── news/                # News sentiment analysis
│   │   ├── eu-news/             # European news sentiment
│   │   ├── eu-stocks/           # European stock data
│   │   ├── reddit/              # Reddit sentiment data
│   │   ├── sentiment-correlation/ # Sentiment correlation analysis
│   │   ├── shiller-pe/          # Shiller P/E data
│   │   ├── stocks/              # Stock data endpoint
│   │   └── twitter/             # Twitter sentiment data
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Main dashboard page
├── components/                   # React Components
│   ├── ui/                      # shadcn/ui components
│   │   ├── accordion.tsx        # Accordion component
│   │   ├── alert.tsx            # Alert component
│   │   ├── badge.tsx            # Badge component
│   │   ├── button.tsx           # Button component
│   │   ├── card.tsx             # Card component
│   │   ├── progress.tsx         # Progress component
│   │   ├── select.tsx           # Select component
│   │   └── tabs.tsx             # Tabs component
│   ├── app-sidebar.tsx          # Navigation sidebar
│   ├── behavioral-finance-principles.tsx # Educational content
│   ├── bubble-visualizer.tsx    # Market bubble visualization
│   ├── case-studies.tsx         # Historical case studies
│   ├── custom-stock-analysis.tsx # Custom stock analysis tool
│   ├── dashboard-overview.tsx   # Main dashboard overview
│   ├── explanatory-notes.tsx    # Tool explanations
│   ├── fear-greed-index.tsx     # Fear & Greed display
│   ├── live-fear-greed-index.tsx # Live Fear & Greed tracker
│   ├── live-sentiment-tracker.tsx # Live sentiment analysis
│   ├── live-shiller-pe-tracker.tsx # Live Shiller P/E tracker
│   ├── news-sentiment-analysis.tsx # News sentiment display
│   ├── sentiment-market-correlation.tsx # Sentiment correlation
│   ├── sentiment-tracker.tsx    # Sentiment tracking component
│   ├── shiller-pe-tracker.tsx   # Shiller P/E display
│   ├── european-sentiment-analysis.tsx # European sentiment
│   ├── european-stock-tracker.tsx # European stock tracking
│   ├── eu-policy-impact.tsx     # EU policy impact analysis
│   └── us-china-politics-impact.tsx # US-China politics analysis
├── hooks/                       # Custom React Hooks
│   └── use-live-data.ts         # Live data management hooks
├── lib/                         # Utility Libraries
│   ├── api-clients.ts           # API client configurations
│   └── utils.ts                 # Utility functions
├── public/                      # Static Assets
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── next.config.mjs              # Next.js configuration
├── package.json                 # Dependencies and scripts
├── README.md                    # This file
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
\`\`\`

## 🎓 Educational Content

### **Behavioral Finance Principles**
The dashboard implements key concepts from behavioral finance research:

1. **Market Inefficiency**: How psychological biases create market opportunities
2. **Herd Behavior**: Social proof and momentum in market movements
3. **Loss Aversion**: Why investors hold losing positions too long
4. **Overconfidence Bias**: How overconfidence leads to excessive trading
5. **Anchoring**: How past prices influence current decisions
6. **Geopolitical Risk**: How political events affect market psychology

### **Historical Case Studies**

#### **Dot-Com Bubble (1995-2002)**
- **Timeline**: Key events from Netscape IPO to market crash
- **Behavioral Factors**: Irrational exuberance, FOMO, narrative fallacy
- **Metrics**: NASDAQ performance, Shiller P/E ratios, IPO activity
- **Lessons**: Importance of fundamental analysis over hype

#### **2008 Financial Crisis**
- **Timeline**: Housing boom to global financial meltdown
- **Behavioral Factors**: Overconfidence, herding, moral hazard
- **Metrics**: Housing prices, credit spreads, volatility indices
- **Lessons**: Systemic risk and interconnectedness

#### **COVID-19 Crash & Recovery (2020)**
- **Timeline**: Pandemic panic to unprecedented recovery
- **Behavioral Factors**: Fear-driven selling, retail investor surge
- **Metrics**: Market volatility, sector rotation, retail participation
- **Lessons**: Central bank intervention and market resilience

#### **US-China Trade War (2018-Present)**
- **Timeline**: Tariff escalation to current tensions
- **Behavioral Factors**: Political risk assessment, sector rotation
- **Metrics**: Trade volumes, sector performance, correlation changes
- **Lessons**: Geopolitical risk as permanent market factor

### **Geopolitical Analysis Framework**

#### **EU Policy Impact on US Markets**
- **Monetary Policy**: ECB decisions and Fed policy divergence
- **Regulatory Spillovers**: How EU regulations affect US companies
- **Crisis Response**: Emergency measures and market reactions
- **Political Events**: Brexit, elections, and stability concerns

#### **US-China Political Tensions**
- **Trade Relations**: Tariffs, trade volumes, and economic decoupling
- **Technology Competition**: Semiconductor controls, tech restrictions
- **Geopolitical Flashpoints**: Taiwan, Hong Kong, territorial disputes
- **Market Decoupling**: Correlation changes and investment flows

## 🔍 Usage Guide

### **Dashboard Navigation**
1. **Overview**: Main dashboard with key metrics and live data
2. **Sentiment Tracker**: Real-time sentiment analysis from multiple sources
3. **News Sentiment**: AI-powered news analysis with regional filtering
4. **Custom Stocks**: Add your own stocks for detailed analysis
5. **Bubble Visualizer**: Interactive charts showing market cycles
6. **Fear & Greed**: Current market psychology indicators
7. **Shiller P/E**: Long-term valuation metrics with forecasting
8. **Sentiment Correlation**: Statistical analysis of sentiment vs markets
9. **EU Policy Impact**: How European decisions affect US markets
10. **US-China Politics**: Bilateral tension analysis and market impact
11. **Case Studies**: Historical market events and lessons
12. **Explanatory Notes**: Educational content and tool guides
13. **BF Principles**: Core behavioral finance concepts

### **Geopolitical Analysis**
1. **Policy Timeline**: Track major political events and market reactions
2. **Sector Impact**: Understand which sectors are most affected
3. **Company Exposure**: Analyze individual company geopolitical risk
4. **Correlation Tracking**: Monitor how political events affect market relationships

### **Custom Stock Analysis**
1. **Add Stocks**: Enter any global stock symbol (e.g., AAPL, ASML.AS, 000001.SZ)
2. **View Metrics**: Real-time quotes, technical indicators, fundamentals
3. **Analyze Correlations**: See how your stocks correlate with macro indicators
4. **Monitor Sentiment**: Track news and social sentiment for your stocks
5. **Technical Signals**: RSI, MACD, and other technical indicators
6. **Geopolitical Risk**: Assess political exposure for international holdings

### **Interpreting Data**
- **Green Indicators**: Positive sentiment, bullish signals
- **Red Indicators**: Negative sentiment, bearish signals
- **Yellow Indicators**: Neutral or mixed signals
- **Data Quality Badges**: Show whether data is live, mixed, or simulated
- **Political Risk Badges**: Indicate geopolitical exposure levels

## 🚀 Deployment

### **Vercel Deployment (Recommended)**
1. **Connect GitHub**: Link your repository to Vercel
2. **Set Environment Variables**: Add all API keys in Vercel dashboard
3. **Deploy**: Automatic deployment on every push to main branch
4. **Custom Domain**: Optional custom domain setup

### **Manual Deployment**
\`\`\`bash
# Build the application
npm run build

# Start production server
npm start
\`\`\`

### **Docker Deployment**
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### **Development Setup**
1. Fork the repository
2. Create a feature branch: \`git checkout -b feature/amazing-feature\`
3. Make your changes
4. Add tests if applicable
5. Commit changes: \`git commit -m 'Add amazing feature'\`
6. Push to branch: \`git push origin feature/amazing-feature\`
7. Open a Pull Request

### **Code Style**
- Use TypeScript for all new code
- Follow existing component patterns
- Add JSDoc comments for complex functions
- Use meaningful variable and function names
- Keep components focused and reusable

### **Testing**
- Test all API integrations
- Verify responsive design on multiple devices
- Check accessibility with screen readers
- Validate data accuracy with known sources

## 📊 Performance & Optimization

### **Data Caching**
- **Client-side**: React Query for API response caching
- **Server-side**: Next.js automatic static optimization
- **CDN**: Vercel Edge Network for global distribution

### **API Rate Limiting**
- **Request Batching**: Combine multiple API calls when possible
- **Intelligent Refresh**: Different refresh rates for different data types
- **Fallback Systems**: Multiple API sources prevent rate limit issues

### **Bundle Optimization**
- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Remove unused code from bundles
- **Image Optimization**: Next.js automatic image optimization
- **Lazy Loading**: Components loaded on demand

## 🔒 Security & Privacy

### **API Key Security**
- **Environment Variables**: Never commit API keys to repository
- **Server-side Only**: API keys only used in server-side code
- **Rate Limiting**: Prevent abuse with request throttling

### **Data Privacy**
- **No Personal Data**: Dashboard doesn't collect personal information
- **Public APIs Only**: All data sources are publicly available
- **HTTPS Only**: All API communications encrypted

## 📈 Roadmap

### **Upcoming Features**
- [ ] **Asian Markets Integration**: Japan, China, India market analysis
- [ ] **Cryptocurrency Analysis**: Digital asset sentiment and correlation
- [ ] **Portfolio Integration**: Connect with brokerage accounts
- [ ] **Alert System**: Custom notifications for market events
- [ ] **Machine Learning**: Predictive models for market movements
- [ ] **Mobile App**: React Native mobile application
- [ ] **Data Export**: CSV/PDF export functionality
- [ ] **Social Features**: Share analysis and insights

### **Long-term Goals**
- [ ] **Real-time Collaboration**: Multi-user analysis sessions
- [ ] **Academic Integration**: Connect with university research
- [ ] **API Marketplace**: Third-party plugin ecosystem
- [ ] **Global Expansion**: Comprehensive emerging market coverage

## 🐛 Troubleshooting

### **Common Issues**

#### **API Rate Limits**
- **Problem**: "Rate limit exceeded" errors
- **Solution**: Wait for rate limit reset or upgrade API plan
- **Prevention**: Monitor usage in dashboard

#### **Missing Data**
- **Problem**: Some stocks show "No data available"
- **Solution**: Check if symbol is valid and supported by API
- **Alternative**: Try different stock symbol or wait for data refresh

#### **Slow Loading**
- **Problem**: Dashboard takes long time to load
- **Solution**: Check internet connection and API status
- **Optimization**: Enable data caching in browser

#### **Environment Variables**
- **Problem**: "API key not found" errors
- **Solution**: Verify all environment variables are set correctly
- **Check**: Ensure .env.local file exists and contains all required keys

### **Getting Help**
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check this README for detailed information
- **Community**: Join discussions in GitHub Discussions
- **Email**: Contact maintainers for urgent issues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### **Academic Inspiration**
- **Robert Shiller**: Nobel laureate whose research inspired this project
- **Yale University**: Financial Markets course content and methodology
- **Behavioral Finance Research**: Academic papers and studies referenced

### **Data Providers**
- **Financial Modeling Prep**: Primary global stock data source
- **NewsAPI**: Financial news and sentiment data
- **Federal Reserve**: Economic data and indicators
- **Alpha Vantage**: Backup financial data

### **Open Source Libraries**
- **Next.js**: React framework for production
- **shadcn/ui**: Beautiful and accessible UI components
- **Recharts**: Composable charting library
- **Tailwind CSS**: Utility-first CSS framework

## 📞 Contact

- **GitHub**: [Your GitHub Profile](https://github.com/YOUR_USERNAME)
- **Email**: your.email@example.com
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/your-profile)
- **Twitter**: [@YourTwitterHandle](https://twitter.com/YourTwitterHandle)

---

**Built with ❤️ for the global behavioral finance community**

*This project is not financial advice. Always consult with qualified financial professionals before making investment decisions. Geopolitical analysis is for educational purposes and should not be the sole basis for investment decisions.*
