import { useEffect, useMemo, useState } from 'react';

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

type FormState = {
  name: string;
  amount: string;
  frequency: Frequency;
  incomeType: IncomeType;
  expenseType: ExpenseType;
  isEssential: boolean;
  note: string;
};

const emptyForm: FormState = {
  name: '',
  amount: '',
  frequency: 'hàng tháng',
  incomeType: 'lương',
  expenseType: 'nhà ở',
  isEssential: false,
  note: '',
};

// Which item is being edited (null = adding new)
type EditTarget =
  | { mode: 'add' }
  | { mode: 'edit-income'; id: string }
  | { mode: 'edit-expense'; id: string };

export default function CashflowPage() {
  // ── Persist to localStorage ──
  const [incomes, setIncomes] = useState<Income[]>(() => {
    try {
      const saved = localStorage.getItem('cashflow-incomes');
      return saved ? (JSON.parse(saved) as Income[]) : mockIncomes;
    } catch {
      return mockIncomes;
    }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem('cashflow-expenses');
      return saved ? (JSON.parse(saved) as Expense[]) : mockExpenses;
    } catch {
      return mockExpenses;
    }
  });

  useEffect(() => {
    localStorage.setItem('cashflow-incomes', JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem('cashflow-expenses', JSON.stringify(expenses));
  }, [expenses]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'income' | 'expense'>('income');

  // Form state
  const [formType, setFormType] = useState<'income' | 'expense'>('income');
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editTarget, setEditTarget] = useState<EditTarget>({ mode: 'add' });

  // ── Delete confirmation ──
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'income' | 'expense'; id: string } | null>(null);

  // ── Open modal for adding ──
  function openAdd() {
    setEditTarget({ mode: 'add' });
    setFormType(selectedTab === 'income' ? 'income' : 'expense');
    setForm(emptyForm);
    setShowForm(true);
  }

  // ── Open modal pre-filled for editing ──
  function openEditIncome(income: Income) {
    setEditTarget({ mode: 'edit-income', id: income.id });
    setFormType('income');
    setForm({
      name: income.name,
      amount: String(income.amount),
      frequency: income.frequency,
      incomeType: income.incomeType,
      expenseType: 'nhà ở',
      isEssential: false,
      note: income.note ?? '',
    });
    setShowForm(true);
  }

  function openEditExpense(expense: Expense) {
    setEditTarget({ mode: 'edit-expense', id: expense.id });
    setFormType('expense');
    setForm({
      name: expense.name,
      amount: String(expense.amount),
      frequency: expense.frequency,
      incomeType: 'lương',
      expenseType: expense.expenseType,
      isEssential: expense.isEssential,
      note: expense.note ?? '',
    });
    setShowForm(true);
  }

  // ── Close modal ──
  function closeModal() {
    setShowForm(false);
    setForm(emptyForm);
    setEditTarget({ mode: 'add' });
  }

  // ── Submit: add or update ──
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editTarget.mode === 'edit-income') {
      setIncomes((prev) =>
        prev.map((i) =>
          i.id === editTarget.id
            ? {
                ...i,
                incomeType: form.incomeType,
                name: form.name,
                amount: Number(form.amount),
                frequency: form.frequency,
                note: form.note || undefined,
              }
            : i
        )
      );
    } else if (editTarget.mode === 'edit-expense') {
      setExpenses((prev) =>
        prev.map((ex) =>
          ex.id === editTarget.id
            ? {
                ...ex,
                expenseType: form.expenseType,
                name: form.name,
                amount: Number(form.amount),
                frequency: form.frequency,
                isEssential: form.isEssential,
                note: form.note || undefined,
              }
            : ex
        )
      );
    } else {
      // add new
      if (formType === 'income') {
        setIncomes((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            incomeType: form.incomeType,
            name: form.name,
            amount: Number(form.amount),
            frequency: form.frequency,
            note: form.note || undefined,
          },
        ]);
      } else {
        setExpenses((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            expenseType: form.expenseType,
            name: form.name,
            amount: Number(form.amount),
            frequency: form.frequency,
            isEssential: form.isEssential,
            note: form.note || undefined,
          },
        ]);
      }
    }

    closeModal();
  }

  // ── Delete ──
  function handleDelete() {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'income') {
      setIncomes((prev) => prev.filter((i) => i.id !== deleteConfirm.id));
    } else {
      setExpenses((prev) => prev.filter((e) => e.id !== deleteConfirm.id));
    }
    setDeleteConfirm(null);
  }

  const totalIncome = useMemo(() => incomes.reduce((sum, i) => sum + i.amount, 0), [incomes]);
  const totalExpense = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const totalNet = totalIncome - totalExpense;

  // Donut chart data — income by type
  const incomeDonutData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const i of incomes) map[i.incomeType] = (map[i.incomeType] ?? 0) + i.amount;
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [incomes]);

  // Donut chart data — expense by type
  const expenseDonutData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of expenses) map[e.expenseType] = (map[e.expenseType] ?? 0) + e.amount;
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const INCOME_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316'];
  const EXPENSE_COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#22c55e', '#06b6d4', '#f97316', '#ec4899'];

  const isEditing = editTarget.mode !== 'add';

  return (
    <div className="cashflow-page">
      <div className="cashflow-container">
        {/* header */}
        <div className="cashflow-header">
          <div>
            <h1>Dòng tiền</h1>
            <p>Theo dõi thu nhập và chi tiêu</p>
          </div>
          <button className="cashflow-btn-add" onClick={openAdd}>
            + Thêm giao dịch
          </button>
        </div>

        {/* summary */}
        <div className="cashflow-summary">
          <div className="cashflow-summary-card">
            <span>Tổng thu nhập</span>
            <h2 className="cashflow-positive">{formatCurrency(totalIncome)}</h2>
          </div>
          <div className="cashflow-summary-card">
            <span>Tổng chi tiêu</span>
            <h2 className="cashflow-negative">{formatCurrency(totalExpense)}</h2>
          </div>
          <div className="cashflow-summary-card">
            <span>Số dư</span>
            <h2 className={totalNet >= 0 ? 'cashflow-positive' : 'cashflow-negative'}>
              {formatCurrency(totalNet)}
            </h2>
          </div>
        </div>

        {/* ── CASHFLOW DASHBOARD CHART ── */}
        <section className="cashflow-chart-section">
          <div className="cashflow-chart-card">

            {/* Top row: view toggle + year nav */}
            <div className="cfc-top-row">
              <div className="cfc-net-line">
                <span className={`cfc-net${totalNet < 0 ? ' negative' : ''}`}>
                  {totalNet >= 0 ? '+' : ''}{formatCurrency(totalNet)}
                </span>
                <span className="cfc-net-label">Thu nhập ròng {new Date().getFullYear()}</span>
              </div>
              <div className="cfc-controls">
                <div className="cfc-view-toggle">
                  <button className="active">Hàng năm</button>
                  <button>Hàng tháng</button>
                </div>
                <div className="cfc-year-nav">
                  <button className="cfc-year-arrow">‹</button>
                  <span className="cfc-year-item">{new Date().getFullYear() - 1}</span>
                  <span className="cfc-year-item active">{new Date().getFullYear()}</span>
                  <span className="cfc-year-item">{new Date().getFullYear() + 1}</span>
                  <button className="cfc-year-arrow">›</button>
                </div>
              </div>
            </div>

            {/* Horizontal bars */}
            <div className="cfc-bars">
              {/* Income bar */}
              <div className="cfc-bar-block">
                <span className="cfc-bar-amount income">{formatCurrency(totalIncome)}</span>
                <div className="cfc-bar-track">
                  <div className="cfc-bar-fill income" style={{ width: '100%' }} />
                </div>
                <span className="cfc-bar-label">Thu nhập</span>
              </div>
              {/* Expense bar */}
              <div className="cfc-bar-block">
                <span className="cfc-bar-amount expense">{formatCurrency(totalExpense)}</span>
                <div className="cfc-bar-track">
                  <div
                    className="cfc-bar-fill expense"
                    style={{ width: totalIncome > 0 ? `${Math.min((totalExpense / totalIncome) * 100, 100)}%` : '0%' }}
                  />
                </div>
                <span className="cfc-bar-label">Chi tiêu</span>
              </div>
            </div>

            {/* Two donut charts */}
            <div className="cfc-donuts">
              {/* Income donut */}
              <div className="cfc-donut-card">
                <p className="cfc-donut-title">Thu nhập</p>
                <p className="cfc-donut-total income">{formatCurrency(totalIncome)}</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={incomeDonutData.length ? incomeDonutData : [{ name: 'Trống', value: 1 }]}
                      cx="50%" cy="50%"
                      innerRadius={50} outerRadius={75}
                      dataKey="value"
                      paddingAngle={3}
                    >
                      {(incomeDonutData.length ? incomeDonutData : [{ name: 'Trống', value: 1 }]).map((_, i) => (
                        <Cell key={i} fill={incomeDonutData.length ? INCOME_COLORS[i % INCOME_COLORS.length] : '#e2e8f0'} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontFamily: CHART_FONT, fontSize: 12 }}
                      formatter={(value) => [formatCurrency(Number(value))]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="cfc-donut-legend">
                  {incomeDonutData.map((d, i) => (
                    <div key={d.name} className="cfc-legend-item">
                      <span className="cfc-legend-dot" style={{ background: INCOME_COLORS[i % INCOME_COLORS.length] }} />
                      <span className="cfc-legend-name">{d.name}</span>
                      <span className="cfc-legend-val">{formatCurrency(d.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expense donut */}
              <div className="cfc-donut-card">
                <p className="cfc-donut-title">Chi tiêu</p>
                <p className="cfc-donut-total expense">{formatCurrency(totalExpense)}</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={expenseDonutData.length ? expenseDonutData : [{ name: 'Trống', value: 1 }]}
                      cx="50%" cy="50%"
                      innerRadius={50} outerRadius={75}
                      dataKey="value"
                      paddingAngle={3}
                    >
                      {(expenseDonutData.length ? expenseDonutData : [{ name: 'Trống', value: 1 }]).map((_, i) => (
                        <Cell key={i} fill={expenseDonutData.length ? EXPENSE_COLORS[i % EXPENSE_COLORS.length] : '#e2e8f0'} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontFamily: CHART_FONT, fontSize: 12 }}
                      formatter={(value) => [formatCurrency(Number(value))]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="cfc-donut-legend">
                  {expenseDonutData.map((d, i) => (
                    <div key={d.name} className="cfc-legend-item">
                      <span className="cfc-legend-dot" style={{ background: EXPENSE_COLORS[i % EXPENSE_COLORS.length] }} />
                      <span className="cfc-legend-name">{d.name}</span>
                      <span className="cfc-legend-val">{formatCurrency(d.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* tabs */}
        <div className="cashflow-tabs">
          <button className={selectedTab === 'income' ? 'active' : ''} onClick={() => setSelectedTab('income')}>
            Thu nhập ({incomes.length})
          </button>
          <button className={selectedTab === 'expense' ? 'active' : ''} onClick={() => setSelectedTab('expense')}>
            Chi tiêu ({expenses.length})
          </button>
        </div>

        {/* income cards */}
        {selectedTab === 'income' && (
          <div className="cashflow-grid">
            {incomes.map((income) => (
              <div key={income.id} className="cashflow-card">
                <div className="cashflow-card-top">
                  <span className="cashflow-badge income">{income.incomeType}</span>
                  <strong className="cashflow-positive">+{formatCurrency(income.amount)}</strong>
                </div>
                <h3>{income.name}</h3>
                {income.note && <p>{income.note}</p>}
                <div className="cashflow-card-footer">
                  <span>{income.frequency}</span>
                  <div className="cashflow-card-actions">
                    <button
                      type="button"
                      className="cashflow-btn-edit"
                      onClick={() => openEditIncome(income)}
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="cashflow-btn-delete"
                      onClick={() => setDeleteConfirm({ type: 'income', id: income.id })}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {incomes.length === 0 && (
              <div className="cashflow-empty">
                <p>Chưa có thu nhập nào. Nhấn "+ Thêm giao dịch" để bắt đầu.</p>
              </div>
            )}
          </div>
        )}

        {/* expense cards */}
        {selectedTab === 'expense' && (
          <div className="cashflow-grid">
            {expenses.map((expense) => (
              <div key={expense.id} className="cashflow-card">
                <div className="cashflow-card-top">
                  <span className="cashflow-badge expense">{expense.expenseType}</span>
                  <strong className="cashflow-negative">-{formatCurrency(expense.amount)}</strong>
                </div>
                <h3>{expense.name}</h3>
                <p>
                  <span className={`cashflow-essential-tag ${expense.isEssential ? 'essential' : 'non-essential'}`}>
                    {expense.isEssential ? '✔ Thiết yếu' : '✦ Không thiết yếu'}
                  </span>
                </p>
                {expense.note && <p className="cashflow-note">{expense.note}</p>}
                <div className="cashflow-card-footer">
                  <span>{expense.frequency}</span>
                  <div className="cashflow-card-actions">
                    <button
                      type="button"
                      className="cashflow-btn-edit"
                      onClick={() => openEditExpense(expense)}
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="cashflow-btn-delete"
                      onClick={() => setDeleteConfirm({ type: 'expense', id: expense.id })}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {expenses.length === 0 && (
              <div className="cashflow-empty">
                <p>Chưa có chi tiêu nào. Nhấn "+ Thêm giao dịch" để bắt đầu.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {showForm && (
        <div className="cashflow-overlay" onClick={closeModal}>
          <div className="cashflow-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cashflow-modal-header">
              <h2>{isEditing ? 'Chỉnh sửa giao dịch' : 'Thêm giao dịch'}</h2>
              <button type="button" onClick={closeModal}>✕</button>
            </div>

            <form className="cashflow-form" onSubmit={handleSubmit}>
              {/* Income / Expense toggle — disabled when editing (type is fixed) */}
              <div className="cashflow-form-toggle">
                <button
                  type="button"
                  className={formType === 'income' ? 'active' : ''}
                  disabled={isEditing}
                  onClick={() => setFormType('income')}
                >
                  Thu nhập
                </button>
                <button
                  type="button"
                  className={formType === 'expense' ? 'active' : ''}
                  disabled={isEditing}
                  onClick={() => setFormType('expense')}
                >
                  Chi tiêu
                </button>
              </div>

              <div className="cashflow-form-field">
                <label>Tên</label>
                <input
                  type="text"
                  placeholder="VD: Lương tháng"
                  value={form.name}
                  required
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div className="cashflow-form-row">
                <div className="cashflow-form-field">
                  <label>Số tiền (VND)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.amount}
                    required
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  />
                </div>
                <div className="cashflow-form-field">
                  <label>Tần suất</label>
                  <select
                    value={form.frequency}
                    onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value as Frequency }))}
                  >
                    {FREQUENCIES.map((freq) => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="cashflow-form-field">
                <label>Danh mục</label>
                {formType === 'income' ? (
                  <select
                    value={form.incomeType}
                    onChange={(e) => setForm((f) => ({ ...f, incomeType: e.target.value as IncomeType }))}
                  >
                    {INCOME_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                ) : (
                  <select
                    value={form.expenseType}
                    onChange={(e) => setForm((f) => ({ ...f, expenseType: e.target.value as ExpenseType }))}
                  >
                    {EXPENSE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                )}
              </div>

              {formType === 'expense' && (
                <div className="cashflow-form-field">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.isEssential}
                      onChange={(e) => setForm((f) => ({ ...f, isEssential: e.target.checked }))}
                      style={{ width: 'auto' }}
                    />
                    Chi tiêu thiết yếu
                  </label>
                </div>
              )}

              <div className="cashflow-form-field">
                <label>Ghi chú (tuỳ chọn)</label>
                <textarea
                  placeholder="Thông tin thêm..."
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                />
              </div>

              <div className="cashflow-form-actions">
                <button type="button" className="cashflow-btn-cancel" onClick={closeModal}>
                  Huỷ
                </button>
                <button type="submit">
                  {isEditing ? 'Cập nhật' : 'Lưu giao dịch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION DIALOG ── */}
      {deleteConfirm && (
        <div className="cashflow-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="cashflow-modal cashflow-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cashflow-modal-header">
              <h2>Xác nhận xoá</h2>
              <button type="button" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <div className="cashflow-confirm-body">
              <p>Bạn có chắc muốn xoá mục này không? Hành động này không thể hoàn tác.</p>
              <div className="cashflow-confirm-actions">
                <button
                  type="button"
                  className="cashflow-btn-cancel"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Huỷ
                </button>
                <button
                  type="button"
                  className="cashflow-btn-danger"
                  onClick={handleDelete}
                >
                  Xoá
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
