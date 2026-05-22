import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  TrendingUp,
  Target,
  Search,
  Plus,
} from 'lucide-react';

import './DashboardPage.css';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';


export default function DashboardPage() {
  const [range, setRange] = useState('6m');
  const chartData = {
    '6m': [
      { name: 'Jan', income: 4000, expense: 2400 },
      { name: 'Feb', income: 3000, expense: 1398 },
      { name: 'Mar', income: 5000, expense: 3200 },
      { name: 'Apr', income: 2780, expense: 3908 },
      { name: 'May', income: 1890, expense: 2800 },
      { name: 'Jun', income: 2390, expense: 3800 },
    ],

    '12m': [
      { name: 'Jan', income: 4000, expense: 2400 },
      { name: 'Feb', income: 3000, expense: 1398 },
      { name: 'Mar', income: 5000, expense: 3200 },
      { name: 'Apr', income: 2780, expense: 3908 },
      { name: 'May', income: 1890, expense: 2800 },
      { name: 'Jun', income: 2390, expense: 3800 },
      { name: 'Jul', income: 3490, expense: 2100 },
      { name: 'Aug', income: 4200, expense: 3000 },
      { name: 'Sep', income: 2800, expense: 2600 },
      { name: 'Oct', income: 3900, expense: 3200 },
      { name: 'Nov', income: 4300, expense: 3500 },
      { name: 'Dec', income: 5000, expense: 4100 },
    ],

    year: [
      { name: 'Q1', income: 12000, expense: 7000 },
      { name: 'Q2', income: 14000, expense: 9000 },
      { name: 'Q3', income: 11000, expense: 8500 },
      { name: 'Q4', income: 16000, expense: 10000 },
    ],
  };
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
          <h1 className="dashboard-title">Welcome back, <span>Bill</span></h1>
          <p className="dashboard-subtitle">
            Here’s a quick overview of your financial activity.
          </p>
        </div>

        <div className="dashboard-header__actions">
          <div className="dashboard-search">
            <Search size={18} />
            <input type="text" placeholder="Search ..." />
          </div>

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
                className={`dashboard-summary-card__change ${item.positive
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

              <p>
                {range === '6m' &&
                  'Income vs expenses in the last 6 months'}

                {range === '12m' &&
                  'Income vs expenses in the last 12 months'}

                {range === 'year' &&
                  'Income vs expenses this year'}
              </p>
            </div>

            <select
              value={range}
              onChange={(event) =>
                setRange(event.target.value)
              }
            >
              <option value="6m">Last 6 Months</option>

              <option value="12m">
                Last 12 Months
              </option>

              <option value="year">This Year</option>
            </select>
          </div>

          <div className="dashboard-chart-placeholder">
            <ResponsiveContainer
              width="100%"
              maxHeight={280}
              aspect={1.618}
            >
              <BarChart data={range === '6m' ? chartData['6m'] : range === '12m' ? chartData['12m'] : chartData['year']}>
                <XAxis dataKey="name" />

                <Tooltip />

                <Bar
                  dataKey="income"
                  fill="var(--brand-400)"
                />

                <Bar
                  fill="var(--neg)"
                  dataKey="expense"
                />
              </BarChart>
            </ResponsiveContainer>
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