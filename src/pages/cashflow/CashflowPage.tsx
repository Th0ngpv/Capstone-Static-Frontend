import { useMemo, useState } from 'react';

import './CashflowPage.css';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CHART_FONT =
  "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

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

const mockIncomes: Income[] = [
  { id: '1', incomeType: 'lương',    name: 'Lương công ty',      amount: 25000000, frequency: 'hàng tháng', note: 'Lương chính' },
  { id: '2', incomeType: 'freelance', name: 'Thiết kế freelance', amount: 8000000,  frequency: 'hàng tháng', note: 'Thu nhập phụ' },
];

const mockExpenses: Expense[] = [
  { id: '1', expenseType: 'nhà ở',   name: 'Tiền thuê nhà', amount: 7000000, frequency: 'hàng tháng', isEssential: true },
  { id: '2', expenseType: 'ăn uống', name: 'Ăn uống',       amount: 3500000, frequency: 'hàng tháng', isEssential: true },
  { id: '3', expenseType: 'giải trí', name: 'Netflix + Spotify', amount: 500000, frequency: 'hàng tháng', isEssential: false },
];

const COLORS = ['#22c55e', '#3b82f6', '#f97316', '#eab308'];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

const INCOME_TYPES: IncomeType[] = ['lương', 'kinh doanh', 'freelance', 'cổ tức', 'cho thuê', 'lãi suất', 'khác'];
const EXPENSE_TYPES: ExpenseType[] = ['nhà ở', 'ăn uống', 'di chuyển', 'giải trí', 'subscription', 'tiền nước', 'tiền điện', 'tiền điện thoại', 'khác'];
const FREQUENCIES: Frequency[] = ['hàng tuần', 'hàng tháng', 'hàng quý', 'hàng năm', 'một lần'];

export default function CashflowPage() {
  const [incomes, setIncomes] = useState<Income[]>(mockIncomes);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [showForm, setShowForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'income' | 'expense'>('income');

  // Form state
  const [formType, setFormType] = useState<'income' | 'expense'>('income');
  const [form, setForm] = useState({
    name: '',
    amount: '',
    frequency: 'hàng tháng' as Frequency,
    incomeType: 'lương' as IncomeType,
    expenseType: 'nhà ở' as ExpenseType,
    isEssential: false,
    note: '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formType === 'income') {
      setIncomes((prev) => [...prev, {
        id: crypto.randomUUID(),
        incomeType: form.incomeType,
        name: form.name,
        amount: Number(form.amount),
        frequency: form.frequency,
        note: form.note || undefined,
      }]);
    } else {
      setExpenses((prev) => [...prev, {
        id: crypto.randomUUID(),
        expenseType: form.expenseType,
        name: form.name,
        amount: Number(form.amount),
        frequency: form.frequency,
        isEssential: form.isEssential,
        note: form.note || undefined,
      }]);
    }
    setForm({ name: '', amount: '', frequency: 'hàng tháng', incomeType: 'lương', expenseType: 'nhà ở', isEssential: false, note: '' });
    setShowForm(false);
  }

  const totalIncome = useMemo(() => incomes.reduce((sum, i) => sum + i.amount, 0), [incomes]);
  const totalExpense = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const totalNet = totalIncome - totalExpense;

  const expenseChartData = expenses.map((e) => ({ name: e.name, value: e.amount }));

  return (
    <div className="cashflow-page">
      <div className="cashflow-container">
        {/* header */}
        <div className="cashflow-header">
          <div>
            <h1>Dòng tiền</h1>
            <p>Theo dõi thu nhập và chi tiêu</p>
          </div>
          <button className="cashflow-btn-add" onClick={() => setShowForm(true)}>
            + Thêm giao dịch
          </button>
        </div>

        {/* summary */}
        <div className="cashflow-summary">
          <div className="cashflow-summary-card">
            <span>Tổng thu nhập</span>
            <h2>{formatCurrency(totalIncome)}</h2>
          </div>
          <div className="cashflow-summary-card">
            <span>Tổng chi tiêu</span>
            <h2>{formatCurrency(totalExpense)}</h2>
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
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={expenseChartData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label>
                    {expenseChartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: '1px solid var(--border)', fontFamily: CHART_FONT }}
                    formatter={(value) => [formatCurrency(Number(value)), 'Chi tiêu']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* tabs */}
        <div className="cashflow-tabs">
          <button className={selectedTab === 'income' ? 'active' : ''} onClick={() => setSelectedTab('income')}>
            Thu nhập
          </button>
          <button className={selectedTab === 'expense' ? 'active' : ''} onClick={() => setSelectedTab('expense')}>
            Chi tiêu
          </button>
        </div>

        {/* income cards */}
        {selectedTab === 'income' && (
          <div className="cashflow-grid">
            {incomes.map((income) => (
              <div key={income.id} className="cashflow-card">
                <div className="cashflow-card-top">
                  <span className="cashflow-badge income">{income.incomeType}</span>
                  <strong>+{formatCurrency(income.amount)}</strong>
                </div>
                <h3>{income.name}</h3>
                <p>{income.note}</p>
                <div className="cashflow-card-footer">
                  <span>{income.frequency}</span>
                  <button type="button">Sửa</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* expense cards */}
        {selectedTab === 'expense' && (
          <div className="cashflow-grid">
            {expenses.map((expense) => (
              <div key={expense.id} className="cashflow-card">
                <div className="cashflow-card-top">
                  <span className="cashflow-badge expense">{expense.expenseType}</span>
                  <strong>-{formatCurrency(expense.amount)}</strong>
                </div>
                <h3>{expense.name}</h3>
                <p>{expense.isEssential ? 'Chi tiêu cần thiết' : 'Chi tiêu không cần thiết'}</p>
                <div className="cashflow-card-footer">
                  <span>{expense.frequency}</span>
                  <button type="button">Sửa</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MODAL with working form ── */}
      {showForm && (
        <div className="cashflow-overlay" onClick={() => setShowForm(false)}>
          <div className="cashflow-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cashflow-modal-header">
              <h2>Thêm giao dịch</h2>
              <button type="button" onClick={() => setShowForm(false)}>✕</button>
            </div>

            <form className="cashflow-form" onSubmit={handleSubmit}>
              {/* Income / Expense toggle */}
              <div className="cashflow-form-toggle">
                <button type="button" className={formType === 'income' ? 'active' : ''} onClick={() => setFormType('income')}>
                  Thu nhập
                </button>
                <button type="button" className={formType === 'expense' ? 'active' : ''} onClick={() => setFormType('expense')}>
                  Chi tiêu
                </button>
              </div>

              <div className="cashflow-form-field">
                <label>Tên</label>
                <input type="text" placeholder="VD: Lương tháng"
                  value={form.name} required
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>

              <div className="cashflow-form-row">
                <div className="cashflow-form-field">
                  <label>Số tiền (VND)</label>
                  <input type="number" min="0" placeholder="0"
                    value={form.amount} required
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
                </div>
                <div className="cashflow-form-field">
                  <label>Tần suất</label>
                  <select value={form.frequency}
                    onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value as Frequency }))}>
                    {FREQUENCIES.map((freq) => <option key={freq} value={freq}>{freq}</option>)}
                  </select>
                </div>
              </div>

              <div className="cashflow-form-field">
                <label>Danh mục</label>
                {formType === 'income' ? (
                  <select value={form.incomeType}
                    onChange={(e) => setForm((f) => ({ ...f, incomeType: e.target.value as IncomeType }))}>
                    {INCOME_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                ) : (
                  <select value={form.expenseType}
                    onChange={(e) => setForm((f) => ({ ...f, expenseType: e.target.value as ExpenseType }))}>
                    {EXPENSE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                )}
              </div>

              {formType === 'expense' && (
                <div className="cashflow-form-field">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.isEssential}
                      onChange={(e) => setForm((f) => ({ ...f, isEssential: e.target.checked }))}
                      style={{ width: 'auto' }} />
                    Chi tiêu thiết yếu
                  </label>
                </div>
              )}

              <div className="cashflow-form-field">
                <label>Ghi chú (tuỳ chọn)</label>
                <textarea placeholder="Thông tin thêm..."
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} />
              </div>

              <button type="submit">Lưu giao dịch</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
