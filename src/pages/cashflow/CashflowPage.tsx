import { useMemo, useState } from 'react';

import './CashflowPage.css';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// chart font
const CHART_FONT =
  "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

// types declaration
type IncomeType =
  | 'lương'
  | 'kinh doanh'
  | 'freelance'
  | 'cổ tức'
  | 'cho thuê'
  | 'lãi suất'
  | 'khác';

type ExpenseType =
  | 'nhà ở'
  | 'ăn uống'
  | 'di chuyển'
  | 'giải trí'
  | 'subscription'
  | 'tiền nước'
  | 'tiền điện'
  | 'tiền điện thoại'
  | 'khác';

type Frequency =
  | 'hàng tuần'
  | 'hàng tháng'
  | 'hàng quý'
  | 'hàng năm'
  | 'một lần';

interface Income {
  id: string;
  incomeType: IncomeType;
  name: string;
  amount: number;
  frequency: Frequency;
  note?: string;
}

interface Expense {
  id: string;
  expenseType: ExpenseType;
  name: string;
  amount: number;
  frequency: Frequency;
  isEssential: boolean;
  note?: string;
}

// mock data
const mockIncomes: Income[] = [
  {
    id: '1',
    incomeType: 'lương',
    name: 'Lương công ty',
    amount: 25000000,
    frequency: 'hàng tháng',
    note: 'Lương chính',
  },
  {
    id: '2',
    incomeType: 'freelance',
    name: 'Thiết kế freelance',
    amount: 8000000,
    frequency: 'hàng tháng',
    note: 'Thu nhập phụ',
  },
];

const mockExpenses: Expense[] = [
  {
    id: '1',
    expenseType: 'nhà ở',
    name: 'Tiền thuê nhà',
    amount: 7000000,
    frequency: 'hàng tháng',
    isEssential: true,
  },
  {
    id: '2',
    expenseType: 'ăn uống',
    name: 'Ăn uống',
    amount: 3500000,
    frequency: 'hàng tháng',
    isEssential: true,
  },
  {
    id: '3',
    expenseType: 'giải trí',
    name: 'Netflix + Spotify',
    amount: 500000,
    frequency: 'hàng tháng',
    isEssential: false,
  },
];

// chart colors
const COLORS = [
  '#22c55e',
  '#3b82f6',
  '#f97316',
  '#eab308',
];

// currency formatter
function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CashflowPage() {
  const [incomes] =
    useState<Income[]>(mockIncomes);

  const [expenses] =
    useState<Expense[]>(mockExpenses);

  const [showForm, setShowForm] =
    useState(false);

  const [selectedTab, setSelectedTab] =
    useState<'income' | 'expense'>(
      'income',
    );

  // totals
  const totalIncome = useMemo(() => {
    return incomes.reduce(
      (sum, income) =>
        sum + income.amount,
      0,
    );
  }, [incomes]);

  const totalExpense = useMemo(() => {
    return expenses.reduce(
      (sum, expense) =>
        sum + expense.amount,
      0,
    );
  }, [expenses]);

  const totalNet =
    totalIncome - totalExpense;

  // chart data
  const expenseChartData = expenses.map(
    (expense) => ({
      name: expense.name,
      value: expense.amount,
    }),
  );

  return (
    <div className="cashflow-page">
  <div className="cashflow-container">
      {/* header */}
      <div className="cashflow-header">
        <div>
          <h1>Dòng tiền</h1>

          <p>
            Theo dõi thu nhập và chi tiêu
          </p>
        </div>

        <button
          className="cashflow-btn-add"
          onClick={() => setShowForm(true)}
        >
          + Thêm giao dịch
        </button>
      </div>

      {/* summary */}
      <div className="cashflow-summary">
        <div className="cashflow-summary-card">
          <span>Tổng thu nhập</span>

          <h2>
            {formatCurrency(totalIncome)}
          </h2>
        </div>

        <div className="cashflow-summary-card">
          <span>Tổng chi tiêu</span>

          <h2>
            {formatCurrency(totalExpense)}
          </h2>
        </div>

        <div className="cashflow-summary-card">
          <span>Số dư</span>

          <h2>{formatCurrency(totalNet)}</h2>
        </div>
      </div>

      {/* chart */}
      <section className="cashflow-chart-section">
        <div className="cashflow-chart-card">
          <div className="cashflow-chart-header">
            <h2>Phân bổ chi tiêu</h2>
          </div>

          <div className="cashflow-chart-wrapper">
            <ResponsiveContainer
                width="100%"
                height={320}
            >
              <PieChart>
                <Pie
                  data={expenseChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label
                >
                  {expenseChartData.map(
                    (_, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />
                    ),
                  )}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border:
                      '1px solid var(--border)',
                    fontFamily: CHART_FONT,
                  }}
                  formatter={(value) => [
                    formatCurrency(
                      Number(value),
                    ),
                    'Chi tiêu',
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* tabs */}
      <div className="cashflow-tabs">
        <button
          className={
            selectedTab === 'income'
              ? 'active'
              : ''
          }
          onClick={() =>
            setSelectedTab('income')
          }
        >
          Thu nhập
        </button>

        <button
          className={
            selectedTab === 'expense'
              ? 'active'
              : ''
          }
          onClick={() =>
            setSelectedTab('expense')
          }
        >
          Chi tiêu
        </button>
      </div>

      {/* incomes */}
      {selectedTab === 'income' && (
        <div className="cashflow-grid">
          {incomes.map((income) => (
            <div
              key={income.id}
              className="cashflow-card"
            >
              <div className="cashflow-card-top">
                <span className="cashflow-badge income">
                  {income.incomeType}
                </span>

                <strong>
                  +
                  {formatCurrency(
                    income.amount,
                  )}
                </strong>
              </div>

              <h3>{income.name}</h3>

              <p>{income.note}</p>

              <div className="cashflow-card-footer">
                <span>
                  {income.frequency}
                </span>

                <button type="button">
                  Sửa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* expenses */}
      {selectedTab === 'expense' && (
        <div className="cashflow-grid">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="cashflow-card"
            >
              <div className="cashflow-card-top">
                <span className="cashflow-badge expense">
                  {expense.expenseType}
                </span>

                <strong>
                  -
                  {formatCurrency(
                    expense.amount,
                  )}
                </strong>
              </div>

              <h3>{expense.name}</h3>

              <p>
                {expense.isEssential
                  ? 'Chi tiêu cần thiết'
                  : 'Chi tiêu không cần thiết'}
              </p>

              <div className="cashflow-card-footer">
                <span>
                  {expense.frequency}
                </span>

                <button type="button">
                  Sửa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    {/* modal */}
      {showForm && (
        <div
          className="cashflow-overlay"
          onClick={() =>
            setShowForm(false)
          }
        >
          <div
            className="cashflow-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="cashflow-modal-header">
              <h2>Thêm giao dịch</h2>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                ✕
              </button>
            </div>

            <form className="cashflow-form">
              <input
                type="text"
                value="Lương tháng"
                readOnly
              />

              <input
                type="number"
                value="25000000"
                readOnly
              />

              <select disabled>
                <option>
                  Hàng tháng
                </option>
              </select>

              <textarea
                value="Thu nhập chính"
                readOnly
              />

              <button type="button">
                Lưu giao dịch
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}