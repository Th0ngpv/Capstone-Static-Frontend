// LoginPage.tsx

import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleEnterDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <main className="login">
      {/* LEFT */}
      <section className="login-left">
        <div className="login-logo">
          <div className="login-logo__icon">W</div>

          <div className="login-logo__text">
            <h2>WealthOS</h2>
            <span>AI WEALTH PLATFORM</span>
          </div>
        </div>

        <div className="login-content">
          <h1>
            Your money, <span>guided by AI.</span>
          </h1>

          <p>
            Track cash, stocks, gold, real estate, insurance and even your
            skill assets in one place — with a financial coach that actually
            understands your goals.
          </p>

          <ul className="feature-list">
            <li>6-class multi-asset portfolio tracking</li>
            <li>Goal-based planning & rebalancing</li>
            <li>AI coach powered by Gemini 1.5 Pro</li>
            <li>Marketplace of vetted financial products</li>
          </ul>
        </div>
      </section>

      {/* RIGHT */}
      <section className="login-right">
        <div className="login-right-inner">
          <div className="login-logo logo-right">
            <div className="login-logo__icon">W</div>

            <div className="login-logo__text">
              <h2>WealthOS</h2>
              <span>AI WEALTH PLATFORM</span>
            </div>
          </div>

          <div className="login-cta">
            <h2>
              Welcome to <span>WealthOS</span>
            </h2>

            <p>
              Static prototype version for user testing and frontend showcase.
            </p>
          </div>

          <div className="login-buttons">
            <button
              className="social-btn"
              type="button"
              onClick={handleEnterDashboard}
            >
              <span className="social-btn__icon">→</span>

              <span className="social-btn__text">
                Enter Dashboard
              </span>
            </button>
          </div>

          <div className="login-legal">
            <p className="login-lined-text">
              Prototype • Static Demo • No Authentication
            </p>

            <small>
              This demo is intended for UI/UX testing purposes only.
            </small>
          </div>
        </div>
      </section>
    </main>
  );
}