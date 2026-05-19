import { useEffect, useMemo, useState } from 'react';

import {
  Pie,
  PieChart,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import './PortfolioPage.css';

const COLORS = [
  '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#f97316', '#ec4899', '#14b8a6', '#a855f7',
];

type AssetClass = 'stocks' | 'cash' | 'real_estate' | 'gold' | 'insurance' | 'skill';
type EntryMode = 'manual' | 'ticker' | 'csv';

const ASSET_CLASSES: { key: AssetClass; label: string; sub: string; icon: string }[] = [
  { key: 'stocks',      label: 'Cổ phiếu / ETF',      sub: 'Danh mục theo mã',        icon: '📈' },
  { key: 'cash',        label: 'Tiền mặt / Tiết kiệm', sub: 'Tài khoản tiết kiệm',     icon: '💵' },
  { key: 'real_estate', label: 'Bất động sản',          sub: 'Nhà đất, REIT',           icon: '🏠' },
  { key: 'gold',        label: 'Vàng / Kim loại',       sub: 'Vàng vật chất hoặc giấy', icon: '✨' },
  { key: 'insurance',   label: 'Bảo hiểm',              sub: 'Hợp đồng có giá trị',     icon: '🛡️' },
  { key: 'skill',       label: 'Tài sản kỹ năng',       sub: 'Khoá học, chứng chỉ',     icon: '🎓' },
];

interface Asset {
  id: string;
  category: string;
  name: string;
  value: number;
  icon: string;
  note?: string;
}

const mockAssets: Asset[] = [
  { id: '1', category: 'Cổ phiếu / ETF',       name: 'VCB',          value: 500000000, icon: '📈' },
  { id: '2', category: 'Cổ phiếu / ETF',       name: 'FPT',          value: 700000000, icon: '📈' },
  { id: '3', category: 'Tiền mặt / Tiết kiệm', name: 'Tiết kiệm ACB', value: 950000000, icon: '💵' },
  { id: '4', category: 'Vàng / Kim loại',       name: 'Vàng SJC',     value: 300000000, icon: '✨' },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompact(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)} tỷ`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} tr`;
  return formatCurrency(value);
}

export default function PortfolioPage() {
  // ── Persist to localStorage ──
  const [allAssets, setAllAssets] = useState<Asset[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio-assets');
      return saved ? (JSON.parse(saved) as Asset[]) : mockAssets;
    } catch { return mockAssets; }
  });

  useEffect(() => {
    localStorage.setItem('portfolio-assets', JSON.stringify(allAssets));
  }, [allAssets]);

  const [step, setStep] = useState<'closed' | 'pick' | 'form'>('closed');
  const [pickedClass, setPickedClass] = useState<AssetClass>('stocks');
  const [entryMode, setEntryMode] = useState<EntryMode>('manual');
  const [ticker, setTicker] = useState('');
  const [form, setForm] = useState({ name: '', quantity: '', value: '', note: '' });
  const [csvRows, setCsvRows] = useState<{ name: string; quantity: string; value: string }[]>([]);
  const [csvError, setCsvError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'plan'>('overview');

  // ── Edit state ──
  const [editingId, setEditingId] = useState<string | null>(null);

  // ── Delete confirm ──
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null); // asset id

  const classMeta = (cls: AssetClass) => ASSET_CLASSES.find((c) => c.key === cls)!;

  function openAdd() {
    setEditingId(null);
    setEntryMode('manual');
    setTicker('');
    setForm({ name: '', quantity: '', value: '', note: '' });
    setCsvRows([]);
    setCsvError('');
    setStep('pick');
  }

  function handlePick(cls: AssetClass) {
    setPickedClass(cls);
    setEntryMode('manual');
    setTicker('');
    setForm({ name: '', quantity: '', value: '', note: '' });
    setCsvRows([]);
    setCsvError('');
    setStep('form');
  }

  function openEdit(asset: Asset) {
    setEditingId(asset.id);
    // Find which asset class matches
    const cls = ASSET_CLASSES.find((c) => c.label === asset.category)?.key ?? 'stocks';
    setPickedClass(cls);
    setEntryMode('manual');
    setTicker('');
    setForm({ name: asset.name, quantity: '1', value: String(asset.value), note: asset.note ?? '' });
    setCsvRows([]);
    setCsvError('');
    setStep('form');
  }

  function closeModal() {
    setStep('closed');
    setEditingId(null);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (editingId) {
      // Update existing
      setAllAssets((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? {
                ...a,
                name: form.name,
                value: Number(form.value),
                note: form.note || undefined,
                category: classMeta(pickedClass).label,
                icon: classMeta(pickedClass).icon,
              }
            : a
        )
      );
    } else if (entryMode === 'csv') {
      const newAssets = csvRows
        .filter((r) => r.name && Number(r.value) > 0)
        .map((r) => ({
          id: crypto.randomUUID(),
          category: classMeta(pickedClass).label,
          name: r.name,
          value: (Number(r.quantity) || 1) * Number(r.value),
          icon: classMeta(pickedClass).icon,
        }));
      setAllAssets((prev) => [...prev, ...newAssets]);
    } else {
      const qty = Number(form.quantity) || 1;
      const unitVal = Number(form.value) || 0;
      const name = entryMode === 'ticker' ? `${ticker} — ${form.name}` : form.name;
      setAllAssets((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          category: classMeta(pickedClass).label,
          name,
          value: qty * unitVal,
          icon: classMeta(pickedClass).icon,
          note: form.note || undefined,
        },
      ]);
    }
    closeModal();
  }

  function handleDelete() {
    if (!deleteConfirm) return;
    setAllAssets((prev) => prev.filter((a) => a.id !== deleteConfirm));
    setDeleteConfirm(null);
  }

  function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    setCsvError('');
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.trim().split('\n').filter(Boolean);
      const rows = lines.slice(1).map((line) => {
        const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
        return { name: cols[0] ?? '', quantity: cols[1] ?? '1', value: cols[2] ?? '0' };
      }).filter((r) => r.name);
      if (rows.length === 0) {
        setCsvError('Không tìm thấy dữ liệu. Định dạng: tên, số lượng, giá trị/đơn vị');
        return;
      }
      setCsvRows(rows);
    };
    reader.readAsText(file);
  }

  const totalAssets = useMemo(() => allAssets.reduce((sum, a) => sum + a.value, 0), [allAssets]);

  const groupedAssets = useMemo(() =>
    allAssets.reduce((groups, asset) => {
      if (!groups[asset.category]) groups[asset.category] = [];
      groups[asset.category].push(asset);
      return groups;
    }, {} as Record<string, Asset[]>),
  [allAssets]);

  const chartData = useMemo(() =>
    Object.entries(groupedAssets).map(([category, items]) => ({
      name: category,
      value: items.reduce((sum, item) => sum + item.value, 0),
    })),
  [groupedAssets]);

  const isEditing = editingId !== null;

  return (
    <div className="portfolio-page">
      {/* HEADER */}
      <div className="portfolio-header">
        <div>
          <span className="portfolio-breadcrumb">Portfolio</span>
          <h1>Tài sản</h1>
        </div>
        <button type="button" className="portfolio-btn-add" onClick={openAdd}>
          + Thêm tài sản
        </button>
      </div>

      {/* TABS */}
      <div className="portfolio-tabs">
        <button type="button" className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
          Tổng quan
        </button>
        <button type="button" className={activeTab === 'plan' ? 'active' : ''} onClick={() => setActiveTab('plan')}>
          Kế hoạch
        </button>
      </div>

      {/* TOTAL */}
      <div className="portfolio-total-card">
        <span className="portfolio-total-label">Tổng tài sản</span>
        <h2 className="portfolio-total-value">{formatCurrency(totalAssets)}</h2>
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="portfolio-grid">
          {/* CHART */}
          <div className="portfolio-donut-section">
            <div className="portfolio-card-header">
              <h3>Phân bổ tài sản</h3>
              <p>Tỷ trọng tài sản hiện tại</p>
            </div>
            <div className="portfolio-chart-wrapper">
              <ResponsiveContainer width="100%" height={320} style={{ background: 'transparent' }}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%"
                    innerRadius={85} outerRadius={120}
                    paddingAngle={2}
                    stroke="none"
                    isAnimationActive={true}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [formatCurrency(Number(value ?? 0)), name]}
                    contentStyle={{
                      borderRadius: '0.75rem',
                      border: '1px solid #e1e7ee',
                      fontSize: '0.8rem',
                      fontFamily: 'inherit',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    itemStyle={{ color: '#1f2530' }}
                    labelStyle={{ display: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="portfolio-chart-center">
                <span>Tổng tài sản</span>
                <strong>{formatCompact(totalAssets)}</strong>
              </div>
            </div>
            <div className="portfolio-legend">
              {chartData.map((item, index) => (
                <div key={item.name} className="portfolio-legend-item">
                  <div className="portfolio-legend-left">
                    <div className="portfolio-legend-dot" style={{ background: COLORS[index % COLORS.length] }} />
                    <span className="portfolio-legend-name">{item.name}</span>
                  </div>
                  <div className="portfolio-legend-right">
                    <span className="portfolio-legend-val">{formatCurrency(item.value)}</span>
                    <span className="portfolio-legend-pct">{((item.value / totalAssets) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ASSETS LIST */}
          <div className="portfolio-assets-section">
            <div className="portfolio-card-header">
              <h3>Danh sách tài sản</h3>
              <p>Các tài sản đang sở hữu</p>
            </div>
            <div className="portfolio-assets-list">
              {Object.entries(groupedAssets).map(([category, items]) => {
                const total = items.reduce((sum, item) => sum + item.value, 0);
                return (
                  <div key={category} className="portfolio-asset-group">
                    <div className="portfolio-asset-group-header">
                      <div className="portfolio-asset-icon">{items[0].icon}</div>
                      <div className="portfolio-asset-group-name">{category}</div>
                      <div className="portfolio-asset-group-total">{formatCurrency(total)}</div>
                    </div>
                    {items.map((asset) => (
                      <div key={asset.id} className="portfolio-asset-item">
                        <div className="portfolio-asset-left">
                          <div className="portfolio-asset-icon">{asset.icon}</div>
                          <div>
                            <h4>{asset.name}</h4>
                            {asset.note && <span className="portfolio-asset-note">{asset.note}</span>}
                            <span>{asset.category}</span>
                          </div>
                        </div>
                        <div className="portfolio-asset-right">
                          <div className="portfolio-asset-value">{formatCurrency(asset.value)}</div>
                          <div className="portfolio-asset-actions">
                            <button
                              type="button"
                              className="portfolio-btn-edit"
                              onClick={() => openEdit(asset)}
                            >
                              Sửa
                            </button>
                            <button
                              type="button"
                              className="portfolio-btn-delete"
                              onClick={() => setDeleteConfirm(asset.id)}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
              {allAssets.length === 0 && (
                <div className="portfolio-empty">
                  <p>Chưa có tài sản nào. Nhấn "+ Thêm tài sản" để bắt đầu.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PLAN */}
      {activeTab === 'plan' && (
        <div className="portfolio-grid">
          <div className="portfolio-plan-chart-card">
            <div className="portfolio-card-header">
              <h3>Kế hoạch đầu tư</h3>
              <p>Phân bổ mục tiêu dài hạn</p>
            </div>
            <div className="portfolio-chart-wrapper">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={chartData} dataKey="value" innerRadius={70} outerRadius={120}>
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [formatCurrency(Number(value ?? 0)), name]}
                    contentStyle={{
                      borderRadius: '0.75rem',
                      border: '1px solid #e1e7ee',
                      fontSize: '0.8rem',
                      fontFamily: 'inherit',
                    }}
                    itemStyle={{ color: '#1f2530' }}
                    labelStyle={{ display: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="portfolio-plan-goals">
            <div className="portfolio-card-header">
              <h3>Mục tiêu tài chính</h3>
              <p>Theo dõi tiến độ tích lũy</p>
            </div>
            <div className="portfolio-goal-item">
              <div className="portfolio-goal-header">
                <strong>Tự do tài chính</strong>
                <span>65%</span>
              </div>
              <div className="portfolio-goal-bar"><div className="portfolio-goal-fill" style={{ width: '65%' }} /></div>
            </div>
            <div className="portfolio-goal-item">
              <div className="portfolio-goal-header">
                <strong>Quỹ khẩn cấp</strong>
                <span>80%</span>
              </div>
              <div className="portfolio-goal-bar"><div className="portfolio-goal-fill" style={{ width: '80%' }} /></div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 1: Pick asset class ── */}
      {step === 'pick' && (
        <div className="portfolio-overlay" onClick={closeModal}>
          <div className="portfolio-modal" onClick={(e) => e.stopPropagation()}>
            <div className="portfolio-modal-header">
              <div>
                <span className="portfolio-modal-eyebrow">+ TÀI SẢN MỚI</span>
                <h2>Bạn muốn thêm gì?</h2>
              </div>
              <button type="button" className="portfolio-modal-close" onClick={closeModal}>✕</button>
            </div>
            <p className="portfolio-modal-sub">Chọn loại tài sản. Bạn có thể thêm nhiều mục sau.</p>
            <div className="portfolio-class-grid">
              {ASSET_CLASSES.map((cls) => (
                <button key={cls.key} type="button" className="portfolio-class-btn" onClick={() => handlePick(cls.key)}>
                  <span className="portfolio-class-icon">{cls.icon}</span>
                  <div className="portfolio-class-text">
                    <strong>{cls.label}</strong>
                    <span>{cls.sub}</span>
                  </div>
                  <span className="portfolio-class-arrow">›</span>
                </button>
              ))}
            </div>
            <div className="portfolio-broker-banner">
              <span>✦ Nhanh hơn: kết nối môi giới</span>
              <p>Liên kết tài khoản để nhập danh mục tự động.</p>
            </div>
            <div className="portfolio-modal-footer">
              <button type="button" className="portfolio-btn-cancel" onClick={closeModal}>Huỷ</button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Fill asset details ── */}
      {step === 'form' && (
        <div className="portfolio-overlay" onClick={closeModal}>
          <div className="portfolio-modal" onClick={(e) => e.stopPropagation()}>
            <div className="portfolio-modal-header">
              <div>
                <span className="portfolio-modal-eyebrow">
                  {isEditing ? 'CHỈNH SỬA TÀI SẢN' : `+ TÀI SẢN MỚI · ${classMeta(pickedClass).label.toUpperCase()}`}
                </span>
                <h2>{isEditing ? 'Cập nhật tài sản' : 'Chi tiết tài sản'}</h2>
              </div>
              <button type="button" className="portfolio-modal-close" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSave} className="portfolio-form">
              {/* Entry mode toggle — hidden when editing */}
              {!isEditing && (
                <div className="portfolio-form-section">
                  <span className="portfolio-form-label">CÁCH NHẬP</span>
                  <div className="portfolio-entry-toggle">
                    <button type="button" className={entryMode === 'manual' ? 'active' : ''} onClick={() => setEntryMode('manual')}>Thủ công</button>
                    <button type="button" className={entryMode === 'ticker' ? 'active' : ''} onClick={() => setEntryMode('ticker')}>Tra mã CK</button>
                    <button type="button" className={entryMode === 'csv' ? 'active' : ''} onClick={() => setEntryMode('csv')}>Từ CSV</button>
                  </div>
                </div>
              )}

              {/* MANUAL / EDIT */}
              {(entryMode === 'manual' || isEditing) && (
                <>
                  <div className="portfolio-form-section">
                    <span className="portfolio-form-label">TÊN TÀI SẢN</span>
                    <input className="portfolio-input" type="text" placeholder={`VD: ${classMeta(pickedClass).sub}`}
                      value={form.name} required onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="portfolio-form-row">
                    {!isEditing && (
                      <div className="portfolio-form-section">
                        <span className="portfolio-form-label">SỐ LƯỢNG</span>
                        <input className="portfolio-input" type="number" min="0" placeholder="1"
                          value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} />
                      </div>
                    )}
                    <div className="portfolio-form-section">
                      <span className="portfolio-form-label">{isEditing ? 'GIÁ TRỊ (VND)' : 'GIÁ TRỊ / ĐƠN VỊ (VND)'}</span>
                      <div className="portfolio-input-prefix">
                        <span>₫</span>
                        <input type="number" min="0" placeholder="0"
                          value={form.value} required onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                  <div className="portfolio-form-section">
                    <span className="portfolio-form-label">GHI CHÚ (TUỲ CHỌN)</span>
                    <textarea className="portfolio-input portfolio-textarea" placeholder="Mục đích, chiến lược, chi tiết lô..."
                      value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} />
                  </div>
                </>
              )}

              {/* TICKER */}
              {entryMode === 'ticker' && !isEditing && (
                <>
                  <div className="portfolio-form-section">
                    <span className="portfolio-form-label">MÃ CK / TICKER</span>
                    <input className="portfolio-input" type="text" placeholder="VD: VNM, FPT, VIC"
                      value={ticker} required onChange={(e) => setTicker(e.target.value.toUpperCase())} />
                  </div>
                  <div className="portfolio-form-section">
                    <span className="portfolio-form-label">TÊN TÀI SẢN</span>
                    <input className="portfolio-input" type="text" placeholder="VD: Vinamilk, FPT Corp..."
                      value={form.name} required onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="portfolio-form-row">
                    <div className="portfolio-form-section">
                      <span className="portfolio-form-label">SỐ CỔ PHIẾU</span>
                      <input className="portfolio-input" type="number" min="0" placeholder="0"
                        value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} />
                    </div>
                    <div className="portfolio-form-section">
                      <span className="portfolio-form-label">GIÁ VỐN / CỔ PHIẾU (VND)</span>
                      <div className="portfolio-input-prefix">
                        <span>₫</span>
                        <input type="number" min="0" placeholder="0"
                          value={form.value} required onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* CSV */}
              {entryMode === 'csv' && !isEditing && (
                <>
                  <div className="portfolio-form-section">
                    <span className="portfolio-form-label">TẢI LÊN FILE CSV</span>
                    <p style={{ fontSize: '0.8rem', color: '#6c7786', margin: '0 0 0.5rem' }}>
                      Định dạng cột: <code>tên, số lượng, giá trị/đơn vị</code>
                    </p>
                    <label className="portfolio-csv-drop">
                      <input type="file" accept=".csv" onChange={handleCsvUpload} style={{ display: 'none' }} />
                      <span style={{ fontSize: '1.5rem' }}>📂</span>
                      <span>Nhấn để chọn file CSV</span>
                    </label>
                    {csvError && <p style={{ color: '#d4453b', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>{csvError}</p>}
                  </div>
                  {csvRows.length > 0 && (
                    <div className="portfolio-form-section">
                      <span className="portfolio-form-label">XEM TRƯỚC ({csvRows.length} mục)</span>
                      <div className="portfolio-csv-preview">
                        {csvRows.map((r, i) => (
                          <div key={i} className="portfolio-csv-row">
                            <span>{r.name}</span>
                            <span>×{r.quantity} · {Number(r.value).toLocaleString()} VND</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="portfolio-modal-footer">
                {!isEditing && (
                  <button type="button" className="portfolio-btn-cancel" onClick={() => setStep('pick')}>← Quay lại</button>
                )}
                <button type="button" className="portfolio-btn-cancel" onClick={closeModal}>Huỷ</button>
                <button type="submit" className="portfolio-btn-save"
                  disabled={entryMode === 'csv' && !isEditing && csvRows.length === 0}>
                  {isEditing ? '✓ Cập nhật' : '✓ Lưu tài sản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION ── */}
      {deleteConfirm && (
        <div className="portfolio-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="portfolio-modal portfolio-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="portfolio-modal-header">
              <h2>Xác nhận xoá</h2>
              <button type="button" className="portfolio-modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <div className="portfolio-confirm-body">
              <p>Bạn có chắc muốn xoá tài sản này không? Hành động này không thể hoàn tác.</p>
              <div className="portfolio-confirm-actions">
                <button type="button" className="portfolio-btn-cancel" onClick={() => setDeleteConfirm(null)}>Huỷ</button>
                <button type="button" className="portfolio-btn-danger" onClick={handleDelete}>Xoá</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
