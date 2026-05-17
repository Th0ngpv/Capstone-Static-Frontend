import {
  Bot,
  SendHorizonal,
  Sparkles,
  TrendingUp,
  CircleDollarSign,
  Target,
  ShieldCheck,
} from 'lucide-react';

import './CoachPage.css';

const insights = [
  {
    title: 'Reduce Food Spending',
    description:
      'Your dining expenses increased by 18% this month. Consider setting a weekly budget.',
    icon: <CircleDollarSign size={20} />,
  },
  {
    title: 'Emergency Fund Progress',
    description:
      'You are 80% toward your emergency fund target. Keep saving consistently.',
    icon: <ShieldCheck size={20} />,
  },
  {
    title: 'Investment Opportunity',
    description:
      'Tech ETFs are outperforming the market this week with strong growth momentum.',
    icon: <TrendingUp size={20} />,
  },
];

const goals = [
  {
    title: 'Emergency Fund',
    progress: 80,
  },
  {
    title: 'Japan Trip',
    progress: 65,
  },
  {
    title: 'Investment Portfolio',
    progress: 48,
  },
];

export default function CoachPage() {
  return (
    <main className="coach-page">
      {/* HERO */}
      <section className="coach-hero">
        <div className="coach-hero__content">
          <span className="coach-badge">
            <Sparkles size={16} />
            AI Financial Coach
          </span>

          <h1>
            Smarter financial decisions powered by personalized AI insights.
          </h1>

          <p>
            Track spending habits, receive intelligent recommendations, and
            stay on top of your financial goals.
          </p>
        </div>

        <div className="coach-hero__card">
          <div className="coach-hero__card-icon">
            <Bot size={30} />
          </div>

          <h3>Today’s Recommendation</h3>

          <p>
            You can save an estimated $120 this month by reducing takeaway
            spending and reallocating it to your emergency fund.
          </p>
        </div>
      </section>

      {/* CHAT */}
      <section className="coach-chat-section">
        <div className="coach-section-header">
          <div>
            <h2>Ask Your AI Coach</h2>
            <p>Get instant financial guidance and recommendations</p>
          </div>
        </div>

        <div className="coach-chat-box">
          <div className="coach-message coach-message--bot">
            <div className="coach-message__avatar">
              <Bot size={18} />
            </div>

            <div className="coach-message__content">
              <p>
                Hi Bill 👋 Based on your recent activity, I noticed your food
                expenses increased this week. Would you like help creating a
                smarter spending plan?
              </p>
            </div>
          </div>

          <div className="coach-message coach-message--user">
            <div className="coach-message__content">
              <p>
                Yes, show me how much I should budget weekly for food.
              </p>
            </div>
          </div>

          <div className="coach-message coach-message--bot">
            <div className="coach-message__avatar">
              <Bot size={18} />
            </div>

            <div className="coach-message__content">
              <p>
                Based on your monthly income and savings goals, a weekly food
                budget of around $85–$100 would help you stay on track.
              </p>
            </div>
          </div>
        </div>

        <div className="coach-input-wrapper">
          <input
            type="text"
            placeholder="Ask your financial coach anything..."
          />

          <button>
            <SendHorizonal size={18} />
            Send
          </button>
        </div>
      </section>

      {/* INSIGHTS */}
      <section className="coach-grid">
        <article className="coach-panel">
          <div className="coach-section-header">
            <div>
              <h2>Smart Insights</h2>
              <p>AI generated financial recommendations</p>
            </div>
          </div>

          <div className="coach-insights-list">
            {insights.map((insight) => (
              <div className="coach-insight-item" key={insight.title}>
                <div className="coach-insight-item__icon">
                  {insight.icon}
                </div>

                <div>
                  <h4>{insight.title}</h4>
                  <p>{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="coach-panel">
          <div className="coach-section-header">
            <div>
              <h2>Goal Tracking</h2>
              <p>Your current financial progress</p>
            </div>
          </div>

          <div className="coach-goals-list">
            {goals.map((goal) => (
              <div className="coach-goal-item" key={goal.title}>
                <div className="coach-goal-item__top">
                  <h4>{goal.title}</h4>
                  <span>{goal.progress}%</span>
                </div>

                <div className="coach-progress-bar">
                  <div
                    className="coach-progress-bar__fill"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="coach-summary-card">
            <Target size={22} />

            <div>
              <h4>Financial Health Score</h4>
              <p>You are performing better than 74% of users this month.</p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}