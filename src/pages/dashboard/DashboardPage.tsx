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
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

import type {
  TooltipContentProps,
} from 'recharts';

import type {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import { useNavigate } from 'react-router-dom';

const formatCurrency = (
  value?: number | string
) => {
  const amount = Number(value) || 0;

  return amount.toLocaleString(
    "vi-VN",
    {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }
  );
};

const formatCompactCurrency = (
  value: number,
) => {
  if (value >= 1_000_000_000) {
    return `${(
      value / 1_000_000_000
    ).toFixed(1)}B`;
  }

  if (value >= 1_000_000) {
    return `${(
      value / 1_000_000
    ).toFixed(0)}M`;
  }

  return `${(
    value / 1_000
  ).toFixed(0)}K`;
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipContentProps<
  ValueType,
  NameType
>) => {
  if (
    active &&
    payload &&
    payload.length
  ) {
    return (
      <div className="dashboard-chart-tooltip">
        <p className="dashboard-chart-tooltip__label">
          {label}
        </p>

        <div className="dashboard-chart-tooltip__item">
          <span>Income</span>

          <strong style={{ color: '#22c55e' }}>
            {formatCurrency(
              Number(payload?.[0]?.value ?? 0)
            )}
          </strong>
        </div>

        <div className="dashboard-chart-tooltip__item">
          <span>Expense</span>

          <strong style={{ color: '#ef4444' }}>
            {formatCurrency(
              Number(payload?.[1]?.value ?? 0)
            )}
          </strong>
        </div>
      </div>
    );
  }

  return null;
};

export default function DashboardPage() {
  const [range, setRange] = useState('6m');
  const navigate = useNavigate();
  const chartData = {
    '6m': [
      {
        name: 'Jan',
        income: 32000000,
        expense: 18000000,
      },
      {
        name: 'Feb',
        income: 28000000,
        expense: 15000000,
      },
      {
        name: 'Mar',
        income: 41000000,
        expense: 24000000,
      },
      {
        name: 'Apr',
        income: 36000000,
        expense: 21000000,
      },
      {
        name: 'May',
        income: 47000000,
        expense: 26000000,
      },
      {
        name: 'Jun',
        income: 39000000,
        expense: 23000000,
      },
    ],

    '12m': [
      {
        name: 'Jan',
        income: 32000000,
        expense: 18000000,
      },
      {
        name: 'Feb',
        income: 28000000,
        expense: 15000000,
      },
      {
        name: 'Mar',
        income: 41000000,
        expense: 24000000,
      },
      {
        name: 'Apr',
        income: 36000000,
        expense: 21000000,
      },
      {
        name: 'May',
        income: 47000000,
        expense: 26000000,
      },
      {
        name: 'Jun',
        income: 39000000,
        expense: 23000000,
      },
      {
        name: 'Jul',
        income: 52000000,
        expense: 29000000,
      },
      {
        name: 'Aug',
        income: 48000000,
        expense: 27000000,
      },
      {
        name: 'Sep',
        income: 43000000,
        expense: 25000000,
      },
      {
        name: 'Oct',
        income: 58000000,
        expense: 32000000,
      },
      {
        name: 'Nov',
        income: 61000000,
        expense: 34000000,
      },
      {
        name: 'Dec',
        income: 72000000,
        expense: 41000000,
      },
    ],

    year: [
      {
        name: '2023',
        income: 420000000,
        expense: 250000000,
      },
      {
        name: '2024',
        income: 510000000,
        expense: 310000000,
      },
      {
        name: '2025',
        income: 640000000,
        expense: 370000000,
      },
      {
        name: '2026',
        income: 720000000,
        expense: 430000000,
      },
    ],
  };
  const summaryData = useMemo(
    () => [
      {
        title: 'Total Balance',
        amount: '₫635M',
        change: '+12.4%',
        positive: true,
        icon: <Wallet size={20} />,
      },
      {
        title: 'Monthly Savings',
        amount: '₫108M',
        change: '+8.2%',
        positive: true,
        icon: <PiggyBank size={20} />,
      },
      {
        title: 'Investments',
        amount: '₫317M',
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
      amount: '-₫329K',
      date: 'Today',
      expense: true,
    },
    {
      title: 'Freelance Payment',
      category: 'Income',
      amount: '+₫31.5M',
      date: 'Yesterday',
      expense: false,
    },
    {
      title: 'Grab Food',
      category: 'Food & Drink',
      amount: '-₫620K',
      date: 'Yesterday',
      expense: true,
    },
    {
      title: 'Vanguard ETF',
      category: 'Investment',
      amount: '+₫7.6M',
      date: '2 days ago',
      expense: false,
    },
  ];

  const goals = [
    {
      title: 'Emergency Fund',
      current: '₫205M',
      target: '₫256M',
      progress: 80,
    },
    {
      title: 'Japan Trip',
      current: '₫89M',
      target: '₫128M',
      progress: 70,
    },
    {
      title: 'New Laptop',
      current: '₫28M',
      target: '₫51M',
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
              <BarChart
                data={
                  range === '6m'
                    ? chartData['6m']
                    : range === '12m'
                      ? chartData['12m']
                      : chartData['year']
                }
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.1}
                />

                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(
                    value,
                  ) =>
                    formatCompactCurrency(value)
                  }
                />

                <Tooltip
                  cursor={{
                    fill: 'rgba(255,255,255,0.03)',
                  }}
                  offset={60}
                  allowEscapeViewBox={{ x: false, y: true }}
                  content={CustomTooltip}
                />

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

            <button
              className="dashboard-text-btn"
              onClick={() => navigate('/cashflow')}
            >
              View All
            </button>
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