import { useNavigate } from 'react-router-dom';

import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero__content">
          <span className="home-badge">Smart Financial Planning Platform</span>

          <h1 className="home-title">
            Take Control Of Your
            <span> Financial Future</span>
          </h1>

          <p className="home-description">
            Track your cashflow, manage your portfolio, create savings goals,
            and receive AI-powered financial coaching all in one platform.
          </p>

          <div className="home-actions">
            <button
              className="home-primary-btn"
              onClick={() => navigate('/login')}
            >
              Get Started
            </button>

            <button
              className="home-secondary-btn"
              onClick={() => navigate('/dashboard')}
            >
              View Demo
            </button>
          </div>
        </div>

        <div className="home-hero__card">
          <div className="hero-card">
            <div className="hero-card__header">
              <div>
                <p className="hero-card__label">Monthly Savings</p>
                <h3>$4,250</h3>
              </div>

              <span className="hero-card__trend">+12.5%</span>
            </div>

            <div className="hero-card__chart">
              <div className="chart-bar chart-bar--1"></div>
              <div className="chart-bar chart-bar--2"></div>
              <div className="chart-bar chart-bar--3"></div>
              <div className="chart-bar chart-bar--4"></div>
              <div className="chart-bar chart-bar--5"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="home-features">
        <div className="section-heading">
          <span>Platform Features</span>
          <h2>Everything You Need In One Place</h2>
        </div>

        <div className="features-grid">
          <article className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Cashflow Tracking</h3>
            <p>
              Monitor your income, expenses, and monthly financial trends with
              beautiful visual dashboards.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Goal Planning</h3>
            <p>
              Create financial goals and track your progress with intelligent
              recommendations.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Portfolio Management</h3>
            <p>
              Manage investments and monitor your portfolio performance in
              real-time.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Financial Coach</h3>
            <p>
              Receive personalized insights and suggestions powered by AI.
            </p>
          </article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="home-cta">
        <div className="home-cta__content">
          <h2>Ready To Start Your Financial Journey?</h2>

          <p>
            Join our platform today and begin building smarter financial habits.
          </p>

          <button
            className="home-primary-btn"
            onClick={() => navigate('/login')}
          >
            Go To Login
          </button>
        </div>
      </section>
    </main>
  );
}