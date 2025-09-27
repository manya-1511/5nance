/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from '@google/genai';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, LabelList } from 'recharts';
import './index.css';

// --- Reusable UI Components ---

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

const ThemeToggle = ({ theme, onToggle }) => {
    return (
        <button onClick={onToggle} className="theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
    );
};


const LineChart = ({ data, positive }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const width = 300;
  const height = 80;
  const padding = 5;

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue === 0 ? 1 : maxValue - minValue;

  const points = data.map((point, i) => {
    const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
    const y = height - padding - ((point - minValue) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  const pathD = `M ${points}`;
  const areaD = `${pathD} V ${height} L ${padding},${height} Z`;

  const lineColor = positive ? 'var(--success-color)' : 'var(--error-color)';
  const gradientId = `area-gradient-${positive ? 'positive' : 'negative'}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity={0.2} />
          <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradientId})`} stroke="none" />
      <polyline
        fill="none"
        stroke={lineColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

const Navbar = ({ page, setPage, isAuthenticated, onLogout, theme, onToggleTheme }) => {
    const handleNavClick = (e, targetPage) => {
        e.preventDefault();
        setPage(targetPage);
    };

    const handleLogoutClick = (e) => {
        e.preventDefault();
        onLogout();
    }

    return (
        <nav className="navbar">
            <div className="nav-container">
                <a href="#" className="nav-logo" onClick={(e) => handleNavClick(e, 'home')}>5nance</a>
                <ul className="nav-menu">
                    <li className="nav-item">
                        <a href="#" className={`nav-link ${page === 'home' ? 'active' : ''}`} onClick={(e) => handleNavClick(e, 'home')}>Home</a>
                    </li>
                    {isAuthenticated && (
                         <li className="nav-item">
                            <a href="#" className={`nav-link ${page === 'dashboard' ? 'active' : ''}`} onClick={(e) => handleNavClick(e, 'dashboard')}>Dashboard</a>
                        </li>
                    )}
                </ul>
                <ul className="nav-menu nav-menu-right">
                    {isAuthenticated ? (
                        <>
                             <li className="nav-item">
                                <span className="nav-user">Welcome!</span>
                            </li>
                            <li className="nav-item">
                                <a href="#" className="nav-button-logout" onClick={handleLogoutClick}>Logout</a>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <a href="#" className="nav-link" onClick={(e) => handleNavClick(e, 'login')}>Login</a>
                            </li>
                            <li className="nav-item">
                                <a href="#" className="nav-button-signup" onClick={(e) => handleNavClick(e, 'signup')}>Sign Up</a>
                            </li>
                        </>
                    )}
                    <li className="nav-item">
                        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                    </li>
                </ul>
            </div>
        </nav>
    );
}

const HeroIllustration = () => (
    <svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'var(--primary-color)', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: 'var(--success-color)', stopOpacity: 1}} />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <rect width="500" height="400" fill="transparent" />
        <path d="M 50 350 Q 150 100 250 200 T 450 50" stroke="url(#grad1)" strokeWidth="8" fill="none" strokeLinecap="round" filter="url(#glow)" />
        <path d="M 50 300 Q 120 200 220 250 T 450 150" stroke="var(--path-secondary-color)" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="250" cy="200" r="15" fill="var(--primary-color)" />
        <circle cx="450" cy="50" r="10" fill="var(--success-color)" />
        <circle cx="50" cy="350" r="10" fill="var(--warning-color)" />
    </svg>
);


// --- Page Components ---

const HomePage = ({ onNavigate }) => {
    const features = [
        { title: "Understand the Basics", description: "New to mutual funds? We break down complex topics into simple, digestible concepts to build your confidence." },
        { title: "AI-Powered Insights", description: "Leverage cutting-edge AI to analyze market sentiment and get tailored recommendations based on your risk profile." },
        { title: "Compare with Confidence", description: "Visualize fund performance side-by-side with interactive charts that make complex data easy to understand." }
    ];

    const concepts = [
        { title: "Diversification", description: "The practice of spreading your investments around so that your exposure to any one type of asset is limited. This helps to reduce risk." },
        { title: "Expense Ratio", description: "The annual fee that all funds charge their shareholders. It is the percentage of assets deducted each fiscal year for fund expenses." },
        { title: "Volatility", description: "A statistical measure of the dispersion of returns for a given security or market index. In most cases, the higher the volatility, the riskier the security." }
    ];

    return (
        <div className="home-page">
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-text slide-in-left">
                        <h1>Unlock the World of Mutual Funds</h1>
                        <p>Make smarter investment decisions with AI-powered analysis. Understand risk, track performance, and get personalized insights, all in one place.</p>
                        <button onClick={() => onNavigate('signup')} className="cta-button">Get Started for Free</button>
                    </div>
                     <div className="hero-image slide-in-right">
                        <HeroIllustration />
                    </div>
                </div>
            </section>
            <section className="features-section">
                <h2>Why 5nance?</h2>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card" style={{animationDelay: `${index * 150}ms`}}>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>
             <section className="concepts-section">
                <h2>Key Concepts for Beginners</h2>
                <div className="concepts-grid">
                     {concepts.map((concept, index) => (
                        <div key={index} className="concept-card" style={{animationDelay: `${index * 150}ms`}}>
                            <h4>{concept.title}</h4>
                            <p>{concept.description}</p>
                        </div>
                     ))}
                </div>
            </section>
        </div>
    );
};


const LoginPage = ({ onLogin, onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call for better UX
        setTimeout(() => {
            onLogin();
            // No need to set isLoading to false as the component will unmount
        }, 1000);
    };

    const handleNavClick = (e, page) => {
        e.preventDefault();
        onNavigate(page);
    };

    return (
        <div className="auth-page">
            <div className="auth-form-container">
                <h2>Welcome Back</h2>
                <p>Login to access your dashboard.</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                     <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="analyze-button auth-button" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="auth-switch">Don't have an account? <a href="#" onClick={(e) => handleNavClick(e, 'signup')}>Sign Up</a></p>
            </div>
        </div>
    );
};

const SignupPage = ({ onSignup, onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call for better UX
        setTimeout(() => {
            onSignup();
            // No need to set isLoading to false as the component will unmount
        }, 1000);
    };

    const handleNavClick = (e, page) => {
        e.preventDefault();
        onNavigate(page);
    };

    return (
         <div className="auth-page">
            <div className="auth-form-container">
                <h2>Create Your Account</h2>
                <p>Start your journey to smarter investing.</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                     <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="analyze-button auth-button" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                <p className="auth-switch">Already have an account? <a href="#" onClick={(e) => handleNavClick(e, 'login')}>Login</a></p>
            </div>
        </div>
    );
};

// --- Dashboard Components ---

const FundCard = ({ fund }) => {
  const getRiskColor = (score) => {
    if (score <= 3) return '#28a745'; // Green
    if (score <= 7) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  };

  return (
    <div className="fund-card">
      <div className="card-header">
        <div>
          <h3>{fund.name}</h3>
          <span className="ticker">{fund.ticker}</span>
        </div>
      </div>
      
      <div className="metrics-grid">
        <div className="metric">
          <div className="label">1Y Return</div>
          <div className={`value ${fund.return1Y >= 0 ? 'positive' : 'negative'}`}>{fund.return1Y.toFixed(2)}%</div>
        </div>
        <div className="metric">
          <div className="label">3Y Return</div>
          <div className={`value ${fund.return3Y >= 0 ? 'positive' : 'negative'}`}>{fund.return3Y.toFixed(2)}%</div>
        </div>
        <div className="metric">
          <div className="label">Expense Ratio</div>
          <div className="value">{fund.expenseRatio.toFixed(2)}%</div>
        </div>
         <div className="metric">
          <div className="label">Volatility</div>
          <div className="value">{fund.volatility}</div>
        </div>
      </div>

      <div className="chart-container">
        <div className="label">12-Month Performance</div>
        <LineChart data={fund.historicalData} positive={fund.return1Y >= 0} />
      </div>

      <div className="risk-score">
        <div className="label">Risk Score: {fund.riskScore}/10</div>
        <div className="risk-bar-container">
          <div 
            className="risk-bar" 
            style={{ 
              width: `${fund.riskScore * 10}%`,
              backgroundColor: getRiskColor(fund.riskScore)
            }}
          ></div>
        </div>
      </div>

      <div className="sentiment-card">
         <div className="label">AI Sentiment Analysis</div>
         <span className={`sentiment-mood ${fund.sentiment.mood}`}>{fund.sentiment.mood}</span>
         <p className="headline">"{fund.sentiment.headline}"</p>
      </div>

      <div className="recommendation">
        {fund.recommendation}
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, returnType }: { active?: boolean, payload?: any[], returnType: string }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="label">{`${data.name} (${data.ticker})`}</p>
        <p className="desc">Risk Score: {data.riskScore}</p>
        <p className="desc">{`Return (${returnType}): ${data.return.toFixed(2)}%`}</p>
      </div>
    );
  }
  return null;
};

const SummaryChart = ({ funds, theme }) => {
  const [returnType, setReturnType] = useState('1Y');

  const chartData = funds.map(fund => ({
    ...fund,
    return: fund[returnType === '1Y' ? 'return1Y' : 'return3Y'],
  }));

  const tickColor = theme === 'dark' ? '#a0aec0' : '#666';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#ccc';

  return (
    <div className="summary-chart">
        <div className="chart-toggle">
            <button onClick={() => setReturnType('1Y')} className={returnType === '1Y' ? 'active' : ''}>1Y Return</button>
            <button onClick={() => setReturnType('3Y')} className={returnType === '3Y' ? 'active' : ''}>3Y Return</button>
        </div>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{
            top: 20,
            right: 30,
            bottom: 40,
            left: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis type="number" dataKey="riskScore" name="Risk Score" domain={['dataMin - 1', 'dataMax + 1']} tickCount={10} stroke={tickColor}>
             <Label value="Risk Score" offset={-25} position="insideBottom" fill={tickColor} />
          </XAxis>
          <YAxis type="number" dataKey="return" name={`Return (%) - ${returnType}`} unit="%" domain={['auto', 'auto']} stroke={tickColor}>
            <Label value={`Return (%)`} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} offset={-10} fill={tickColor} />
          </YAxis>
          <Tooltip content={<CustomTooltip returnType={returnType} />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Funds" data={chartData} fill="var(--primary-color)">
             <LabelList dataKey="ticker" position="top" offset={8} fontSize="12px" fill={tickColor} />
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

const DashboardPage = ({ theme }) => {
  const [riskProfile, setRiskProfile] = useState('Moderate');
  const [fundTickers, setFundTickers] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!fundTickers.trim()) {
      setError('Please enter at least one mutual fund ticker.');
      return;
    }
    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const tickers = fundTickers.split(',').map(t => t.trim()).join(', ');

      const prompt = `
        You are a sophisticated financial data API. For the mutual funds with these tickers: ${tickers}, provide a JSON response.
        For each fund, generate realistic mock data including: a full fund name, the ticker, a 1-year return percentage, a 3-year annual return percentage, an expense ratio percentage, volatility (Low, Medium, or High), a risk score from 1 to 10, and a historicalData array with 12 mock data points representing the fund's performance over the last 12 months.
        Also, for each fund, generate a single, recent-style financial news headline and perform a sentiment analysis on it (Positive, Negative, or Neutral).
        Finally, based on a user's risk profile of '${riskProfile}', provide a brief, one-sentence recommendation on whether the fund is suitable.
        The output must be a JSON array of objects.
      `;

      const responseSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            ticker: { type: Type.STRING },
            return1Y: { type: Type.NUMBER },
            return3Y: { type: Type.NUMBER },
            expenseRatio: { type: Type.NUMBER },
            volatility: { type: Type.STRING },
            riskScore: { type: Type.NUMBER },
            historicalData: {
              type: Type.ARRAY,
              items: { type: Type.NUMBER }
            },
            sentiment: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                mood: { type: Type.STRING },
              },
              required: ['headline', 'mood']
            },
            recommendation: { type: Type.STRING },
          },
          required: ['name', 'ticker', 'return1Y', 'return3Y', 'expenseRatio', 'volatility', 'riskScore', 'historicalData', 'sentiment', 'recommendation']
        }
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        },
      });

      const parsedResponse = JSON.parse(response.text);
      setAnalysis(parsedResponse);
    } catch (e) {
      console.error(e);
      setError('Failed to analyze funds. The model may be unable to generate data for the requested tickers. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
      <>
        <header>
            <h1>AI-Powered Mutual Fund Analysis</h1>
            <p>Your Personal dashboard for smarter investment decisions</p>
        </header>
        <div className="input-section">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="risk-profile">Your Risk Profile</label>
              <select 
                id="risk-profile" 
                className="select-field"
                value={riskProfile}
                onChange={(e) => setRiskProfile(e.target.value)}
              >
                <option>Conservative</option>
                <option>Moderate</option>
                <option>Aggressive</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="fund-tickers">Mutual Fund Tickers</label>
              <input
                type="text"
                id="fund-tickers"
                className="input-field"
                value={fundTickers}
                onChange={(e) => setFundTickers(e.target.value)}
                placeholder="e.g., VTSAX, FXAIX"
              />
            </div>
            <button onClick={handleAnalyze} disabled={loading} className="analyze-button">
              {loading ? 'Analyzing...' : 'Analyze Funds'}
            </button>
          </div>
        </div>
        
        {error && <div className="error-message" role="alert">{error}</div>}
        {loading && <div className="loader" role="status" aria-label="Analyzing funds"></div>}
        
        {analysis && analysis.length > 1 && (
          <div className="summary-section">
            <h2>Comparative Analysis: Risk vs. Return</h2>
            <SummaryChart funds={analysis} theme={theme} />
          </div>
        )}

        {analysis && (
          <div className="dashboard">
            {analysis.map(fund => <FundCard key={fund.ticker} fund={fund} />)}
          </div>
        )}
    </>
  );
}


// --- Main App Component ---

const App = () => {
    const [page, setPage] = useState('home');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'light';
    });

    useEffect(() => {
        document.body.dataset.theme = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
        setPage('dashboard');
    }

    const handleSignup = () => {
        setIsAuthenticated(true);
        setPage('dashboard');
    }

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPage('home');
    }

    const renderPage = () => {
        if (page === 'home') {
            return <HomePage onNavigate={setPage} />;
        }
        if (page === 'login') {
            return <LoginPage onLogin={handleLogin} onNavigate={setPage} />;
        }
        if (page === 'signup') {
            return <SignupPage onSignup={handleSignup} onNavigate={setPage} />;
        }
        if (page === 'dashboard') {
            if (isAuthenticated) {
                return <DashboardPage theme={theme} />;
            } else {
                // Redirect to login if not authenticated
                return <LoginPage onLogin={handleLogin} onNavigate={setPage} />;
            }
        }
        return <HomePage onNavigate={setPage} />;
    }

    // Add a class to the body based on the current page for specific styling
    useEffect(() => {
        document.body.className = ''; // Reset classes
        document.body.classList.add(`page-${page}`);
    }, [page]);

    return (
        <>
            <Navbar 
                page={page} 
                setPage={setPage} 
                isAuthenticated={isAuthenticated} 
                onLogout={handleLogout}
                theme={theme}
                onToggleTheme={toggleTheme}
            />
            <div className="container">
                <main>
                    {renderPage()}
                </main>
            </div>
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);