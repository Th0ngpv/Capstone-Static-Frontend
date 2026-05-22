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

import { useLanguage } from '../../hooks/useLanguage';

import { translations } from '../../locales/translations';

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

  const { language } = useLanguage();

  const t = translations[language];

  // Mock data for charts, transactions, and goals
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
        title: t.totalBalance,
        amount: '₫635M',
        change: '+12.4%',
        positive: true,
        icon: <Wallet size={20} />,
      },
      {
        title: t.monthlySavings,
        amount: '₫108M',
        change: '+8.2%',
        positive: true,
        icon: <PiggyBank size={20} />,
      },
      {
        title: t.investments,
        amount: '₫317M',
        change: '-2.1%',
        positive: false,
        icon: <TrendingUp size={20} />,
      },
      {
        title: t.goalsProgress,
        amount: '78%',
        change: '+6.0 %',
        positive: true,
        icon: <Target size={20} />,
      },
    ],
    [t]
  );

  const recentTransactions = [
    {
      title: 'Spotify Premium',
      category: t.entertainment,
      amount: '-₫329K',
      date: t.today,
      expense: true,
    },
    {
      title: 'Freelance Payment',
      category: t.income,
      amount: '+₫31.5M',
      date: t.yesterday,
      expense: false,
    },
    {
      title: 'Grab Food',
      category: t.foodDrink,
      amount: '-₫620K',
      date: t.yesterday,
      expense: true,
    },
    {
      title: 'Vanguard ETF',
      category: t.investment,
      amount: '+₫7.6M',
      date: t.twoDaysAgo,
      expense: false,
    },
  ];

  const goals = [
    {
      title: t.emergencyFund,
      current: '₫205M',
      target: '₫256M',
      progress: 80,
    },
    {
      title: t.japanTrip,
      current: '₫89M',
      target: '₫128M',
      progress: 70,
    },
    {
      title: t.newLaptop,
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
          <h1 className="dashboard-title">{t.welcomeBack},{' '} <span>Bill</span></h1>
          <p className="dashboard-subtitle">
            {t.dashboardSubtitle}
          </p>
        </div>

        <div className="dashboard-header__actions">
          <div className="dashboard-search">
            <Search size={18} />
            <input type="text" placeholder={t.searchPlaceholder} />
          </div>

          <button className="dashboard-primary-btn">
            <Plus size={18} />
            {t.addTransaction}
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
              <h2>{t.cashFlowOverview}</h2>

              <p>
                {range === '6m' &&
                  t.last6Months}

                {range === '12m' &&
                  t.last12Months}

                {range === 'year' &&
                  t.incomeVsExpenserecentYears}
              </p>
            </div>

            <select
              value={range}
              onChange={(event) =>
                setRange(event.target.value)
              }
            >
              <option value="6m">
                {t.last6Months}
              </option>

              <option value="12m">
                {t.last12Months}
              </option>

              <option value="year">
                {t.recentYears}
              </option>
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
              <h2>{t.recentTransactions}</h2>
              <p>{t.latestAccountActivity}</p>
            </div>

            <button
              className="dashboard-text-btn"
              onClick={() => navigate('/cashflow')}
            >
              {t.viewAll}
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
              <h2>{t.financialGoals}</h2>
              <p>{t.trackSavingsTargets}</p>
            </div>

            <button className="dashboard-text-btn">{t.manage}</button>
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
              <h2>{t.smartInsights}</h2>
              <p>{t.aiGeneratedSuggestions}</p>
            </div>
          </div>

          <div className="dashboard-insights-list">
            <div className="dashboard-insight-item">
              <span>💡</span>
              <p>
                {t.foodSpendingInsight}
              </p>
            </div>

            <div className="dashboard-insight-item">
              <span>📈</span>
              <p>
                {t.emergencyFundInsight}
              </p>
            </div>

            <div className="dashboard-insight-item">
              <span>🎯</span>
              <p>
                {t.japanTripInsight}
              </p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}