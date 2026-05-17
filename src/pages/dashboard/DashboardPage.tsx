import { useMemo } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  TrendingUp,
  Target,
  Bell,
  Search,
  Plus,
} from 'lucide-react';

import './DashboardPage.css';

export default function DashboardPage() {
  const summaryData = useMemo(
    () => [
      {
        title: 'Total Balance',
        amount: '$24,890.00',
        change: '+12.4%',
        positive: true,
        icon: <Wallet size={20} />,
      },
      {
        title: 'Monthly Savings',
        amount: '$4,230.00',
        change: '+8.2%',
        positive: true,
        icon: <PiggyBank size={20} />,
      },
      {
        title: 'Investments',
        amount: '$12,450.00',
        change: '-2.1%',
        positive: false,
        icon: <TrendingUp size={20} />,
      },
      {
        title: 'Goals Progress',
        amount: '78%',
        change: '+6 goals',
        positive: true,
        icon: <Target size={20} />,
      },
    ],
    []
  );

  const recentTransactions = [
    {
      title: 'Spotify Premium',
      category: 'Entertainment',
      amount: '-$12.99',
      date: 'Today',
      expense: true,
    },
    {
      title: 'Freelance Payment',
      category: 'Income',
      amount: '+$1,240.00',
      date: 'Yesterday',
      expense: false,
    },
    {
      title: 'Grab Food',
      category: 'Food & Drink',
      amount: '-$24.50',
      date: 'Yesterday',
      expense: true,
    },
    {
      title: 'Vanguard ETF',
      category: 'Investment',
      amount: '+$300.00',
      date: '2 days ago',
      expense: false,
    },
  ];

  const goals = [
    {
      title: 'Emergency Fund',
      current: '$8,000',
      target: '$10,000',
      progress: 80,
    },
    {
      title: 'Japan Trip',
      current: '$3,500',
      target: '$5,000',
      progress: 70,
    },
    {
      title: 'New Laptop',
      current: '$1,100',
      target: '$2,000',
      progress: 55,
    },
  ];

  return (
    <main className="dashboard-page">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome back, Bill 👋</h1>
          <p className="dashboard-subtitle">
            Here’s a quick overview of your financial activity.
          </p>
        </div>

        <div className="dashboard-header__actions">
          <div className="dashboard-search">
            <Search size={18} />
            <input type="text" placeholder="Search anything..." />
          </div>

          <button className="dashboard-icon-btn">
            <Bell size={18} />
          </button>

          <button className="dashboard-primary-btn">
            <Plus size={18} />
            Add Transaction
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <section className="dashboard-summary-grid">
        {summaryData.map((item) => (
          <article className="dashboard-summary-card" key={item.title}>
            <div className="dashboard-summary-card__top">
              <div className="dashboard-summary-card__icon">
                {item.icon}
              </div>

              <div
                className={`dashboard-summary-card__change ${
                  item.positive
                    ? 'dashboard-summary-card__change--positive'
                    : 'dashboard-summary-card__change--negative'
                }`}
              >
                {item.positive ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
                {item.change}
              </div>
            </div>

            <div className="dashboard-summary-card__content">
              <h3>{item.title}</h3>
              <h2>{item.amount}</h2>
            </div>
          </article>
        ))}
      </section>

      {/* Main Grid */}
      <section className="dashboard-content-grid">
        {/* Analytics */}
        <article className="dashboard-card dashboard-chart-card">
          <div className="dashboard-card__header">
            <div>
              <h2>Cash Flow Overview</h2>
              <p>Income vs expenses in the last 6 months</p>
            </div>

            <select>
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="dashboard-chart-placeholder">
            <div className="dashboard-chart-bars">
              <div className="dashboard-chart-bar" style={{ height: '40%' }} />
              <div className="dashboard-chart-bar" style={{ height: '65%' }} />
              <div className="dashboard-chart-bar" style={{ height: '52%' }} />
              <div className="dashboard-chart-bar" style={{ height: '78%' }} />
              <div className="dashboard-chart-bar" style={{ height: '92%' }} />
              <div className="dashboard-chart-bar" style={{ height: '68%' }} />
            </div>
          </div>
        </article>

        {/* Transactions */}
        <article className="dashboard-card">
          <div className="dashboard-card__header">
            <div>
              <h2>Recent Transactions</h2>
              <p>Your latest account activity</p>
            </div>

            <button className="dashboard-text-btn">View All</button>
          </div>

          <div className="dashboard-transactions">
            {recentTransactions.map((transaction) => (
              <div
                className="dashboard-transaction-item"
                key={`${transaction.title}-${transaction.date}`}
              >
                <div className="dashboard-transaction-item__left">
                  <div className="dashboard-transaction-avatar">
                    {transaction.title.charAt(0)}
                  </div>

                  <div>
                    <h4>{transaction.title}</h4>
                    <p>{transaction.category}</p>
                  </div>
                </div>

                <div className="dashboard-transaction-item__right">
                  <h4
                    className={
                      transaction.expense
                        ? 'dashboard-expense'
                        : 'dashboard-income'
                    }
                  >
                    {transaction.amount}
                  </h4>
                  <p>{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Goals */}
        <article className="dashboard-card dashboard-goals-card">
          <div className="dashboard-card__header">
            <div>
              <h2>Financial Goals</h2>
              <p>Track your savings targets</p>
            </div>

            <button className="dashboard-text-btn">Manage</button>
          </div>

          <div className="dashboard-goals-list">
            {goals.map((goal) => (
              <div className="dashboard-goal-item" key={goal.title}>
                <div className="dashboard-goal-item__top">
                  <div>
                    <h4>{goal.title}</h4>
                    <p>
                      {goal.current} / {goal.target}
                    </p>
                  </div>

                  <span>{goal.progress}%</span>
                </div>

                <div className="dashboard-progress-bar">
                  <div
                    className="dashboard-progress-bar__fill"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Insights */}
        <article className="dashboard-card dashboard-insights-card">
          <div className="dashboard-card__header">
            <div>
              <h2>Smart Insights</h2>
              <p>AI generated financial suggestions</p>
            </div>
          </div>

          <div className="dashboard-insights-list">
            <div className="dashboard-insight-item">
              <span>💡</span>
              <p>
                Your food spending increased by 18% this month compared to
                last month.
              </p>
            </div>

            <div className="dashboard-insight-item">
              <span>📈</span>
              <p>
                You are currently ahead of your emergency fund saving target.
              </p>
            </div>

            <div className="dashboard-insight-item">
              <span>🎯</span>
              <p>
                At your current pace, you can complete your Japan Trip goal in
                3 months.
              </p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}