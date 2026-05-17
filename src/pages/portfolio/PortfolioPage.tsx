import { useMemo, useState } from 'react';

import {
  Pie,
  PieChart,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import './PortfolioPage.css';

const COLORS = [
  '#22c55e',
  '#3b82f6',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
];

// ── Asset class picker data ──────────────────────────────────────────────────
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
}

const mockAssets: Asset[] = [
  { id: '1', category: 'Cổ phiếu / ETF', name: 'VCB',     value: 500000000, icon: '📈' },
  { id: '2', category: 'Cổ phiếu / ETF', name: 'FPT',     value: 700000000, icon: '📈' },
  { id: '3', category: 'Tiền mặt / Tiết kiệm', name: 'Tiết kiệm ACB', value: 950000000, icon: '💵' },
  { id: '4', category: 'Vàng / Kim loại', name: 'Vàng SJC', value: 300000000, icon: '✨' },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PortfolioPage() {
  const [allAssets, setAllAssets] = useState<Asset[]>(mockAssets);
  const [step, setStep] = useState<'closed' | 'pick' | 'form'>('closed');
  const [pickedClass, setPickedClass] = useState<AssetClass>('stocks');
  const [entryMode, setEntryMode] = useState<EntryMode>('manual');
  const [ticker, setTicker] = useState('');
  const [form, setForm] = useState({ name: '', quantity: '', value: '', note: '' });
  const [csvRows, setCsvRows] = useState<{ name: string; quantity: string; value: string }[]>([]);
  const [csvError, setCsvError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'plan'>('overview');

  const assets = allAssets;

  const classMeta = (cls: AssetClass) => ASSET_CLASSES.find((c) => c.key === cls)!;

  function handlePick(cls: AssetClass) {
    setPickedClass(cls);
    setEntryMode('manual');
    setTicker('');
    setForm({ name: '', quantity: '', value: '', note: '' });
    setCsvRows([]);
    setCsvError('');
    setStep('form');
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (entryMode === 'csv') {
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
      setAllAssets((prev) => [...prev, {
        id: crypto.randomUUID(),
        category: classMeta(pickedClass).label,
        name,
        value: qty * unitVal,
        icon: classMeta(pickedClass).icon,
      }]);
    }
    setStep('closed');
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

  const totalAssets = useMemo(() => assets.reduce((sum, a) => sum + a.value, 0), [assets]);

  const groupedAssets = useMemo(() =>
    assets.reduce((groups, asset) => {
      if (!groups[asset.category]) groups[asset.category] = [];
      groups[asset.category].push(asset);
      return groups;
    }, {} as Record<string, Asset[]>),
  [assets]);

  const chartData = useMemo(() =>
    Object.entries(groupedAssets).map(([category, items]) => ({
      name: category,
      value: items.reduce((sum, item) => sum + item.value, 0),
    })),
  [groupedAssets]);

  return (
    <div className="portfolio-page">
      {/* HEADER */}
      <div className="portfolio-header">
        <div>
          <span className="portfolio-breadcrumb">Portfolio</span>
          <h1>Tài sản</h1>
        </div>
        <button type="button" className="portfolio-btn-add" onClick={() => setStep('pick')}>
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
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={85} outerRadius={120} paddingAngle={2} stroke="none"
                    activeShape={false} isAnimationActive={true}>
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [formatCurrency(Number(value ?? 0)), '']}
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
                <strong>{(totalAssets / 1000000000).toFixed(2)}B</strong>
              </div>
            </div>
            <div className="portfolio-legend">
              {chartData.map((item, index) => (
                <div key={item.name} className="portfolio-legend-item">
                  <div className="portfolio-legend-left">
                    <div className="portfolio-legend-dot" style={{ background: COLORS[index % COLORS.length] }} />
                    <span className="portfolio-legend-name">{item.name}</span>
                  </div>
                  <span className="portfolio-legend-pct">{((item.value / totalAssets) * 100).toFixed(0)}%</span>
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
                            <span>{asset.category}</span>
                          </div>
                        </div>
                        <div className="portfolio-asset-value">{formatCurrency(asset.value)}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
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
                    formatter={(value) => [formatCurrency(Number(value ?? 0)), '']}
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
            </div>
          </div>
          <div className="portfolio-plan-goals">
            <div className="portfolio-card-header">
              <h3>Mục tiêu tài chính</h3>
              <p>Theo dõi tiến độ tích lũy</p>
            </div>
            <div><strong>Tự do tài chính</strong><p>65% hoàn thành</p></div>
            <div><strong>Quỹ khẩn cấp</strong><p>80% hoàn thành</p></div>
          </div>
        </div>
      )}

      {/* ── STEP 1: Pick asset class ── */}
      {step === 'pick' && (
        <div className="portfolio-overlay" onClick={() => setStep('closed')}>
          <div className="portfolio-modal" onClick={(e) => e.stopPropagation()}>
            <div className="portfolio-modal-header">
              <div>
                <span className="portfolio-modal-eyebrow">+ TÀI SẢN MỚI</span>
                <h2>Bạn muốn thêm gì?</h2>
              </div>
              <button type="button" className="portfolio-modal-close" onClick={() => setStep('closed')}>✕</button>
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
              <button type="button" className="portfolio-btn-cancel" onClick={() => setStep('closed')}>Huỷ</button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Fill asset details ── */}
      {step === 'form' && (
        <div className="portfolio-overlay" onClick={() => setStep('closed')}>
          <div className="portfolio-modal" onClick={(e) => e.stopPropagation()}>
            <div className="portfolio-modal-header">
              <div>
                <span className="portfolio-modal-eyebrow">+ TÀI SẢN MỚI · {classMeta(pickedClass).label.toUpperCase()}</span>
                <h2>Chi tiết tài sản</h2>
              </div>
              <button type="button" className="portfolio-modal-close" onClick={() => setStep('closed')}>✕</button>
            </div>

            <form onSubmit={handleSave} className="portfolio-form">
              {/* Entry mode toggle */}
              <div className="portfolio-form-section">
                <span className="portfolio-form-label">CÁCH NHẬP</span>
                <div className="portfolio-entry-toggle">
                  <button type="button" className={entryMode === 'manual' ? 'active' : ''} onClick={() => setEntryMode('manual')}>Thủ công</button>
                  <button type="button" className={entryMode === 'ticker' ? 'active' : ''} onClick={() => setEntryMode('ticker')}>Tra mã CK</button>
                  <button type="button" className={entryMode === 'csv' ? 'active' : ''} onClick={() => setEntryMode('csv')}>Từ CSV</button>
                </div>
              </div>

              {/* MANUAL */}
              {entryMode === 'manual' && (
                <>
                  <div className="portfolio-form-section">
                    <span className="portfolio-form-label">TÊN TÀI SẢN</span>
                    <input className="portfolio-input" type="text" placeholder={`VD: ${classMeta(pickedClass).sub}`}
                      value={form.name} required onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="portfolio-form-row">
                    <div className="portfolio-form-section">
                      <span className="portfolio-form-label">SỐ LƯỢNG</span>
                      <input className="portfolio-input" type="number" min="0" placeholder="0"
                        value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} />
                    </div>
                    <div className="portfolio-form-section">
                      <span className="portfolio-form-label">GIÁ TRỊ / ĐƠN VỊ (VND)</span>
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
              {entryMode === 'ticker' && (
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
              {entryMode === 'csv' && (
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
                <button type="button" className="portfolio-btn-cancel" onClick={() => setStep('pick')}>← Quay lại</button>
                <button type="button" className="portfolio-btn-cancel" onClick={() => setStep('closed')}>Huỷ</button>
                <button type="submit" className="portfolio-btn-save"
                  disabled={entryMode === 'csv' && csvRows.length === 0}>
                  ✓ Lưu tài sản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
