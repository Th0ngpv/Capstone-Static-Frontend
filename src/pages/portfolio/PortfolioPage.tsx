import { useMemo, useState } from 'react';

import {
  Pie,
  PieChart,
  Cell,
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

interface Asset {
  id: string;
  category: string;
  name: string;
  value: number;
  icon: string;
}

const mockAssets: Asset[] = [
  {
    id: '1',
    category: 'Chứng khoán',
    name: 'VCB',
    value: 500000000,
    icon: '📈',
  },
  {
    id: '2',
    category: 'Chứng khoán',
    name: 'FPT',
    value: 700000000,
    icon: '📈',
  },
  {
    id: '3',
    category: 'Crypto',
    name: 'Bitcoin',
    value: 300000000,
    icon: '₿',
  },
  {
    id: '4',
    category: 'Tiền mặt',
    name: 'Savings',
    value: 950000000,
    icon: '💵',
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PortfolioPage() {
  const [showModal, setShowModal] = useState(false);

  const [activeTab, setActiveTab] =
    useState<'overview' | 'plan'>('overview');

  const assets = mockAssets;

  const totalAssets = useMemo(() => {
    return assets.reduce(
      (sum, asset) => sum + asset.value,
      0,
    );
  }, [assets]);

  const groupedAssets = useMemo(() => {
    return assets.reduce(
      (groups, asset) => {
        if (!groups[asset.category]) {
          groups[asset.category] = [];
        }

        groups[asset.category].push(asset);

        return groups;
      },
      {} as Record<string, Asset[]>,
    );
  }, [assets]);

  const chartData = useMemo(() => {
    return Object.entries(groupedAssets).map(
      ([category, items]) => ({
        name: category,
        value: items.reduce(
          (sum, item) => sum + item.value,
          0,
        ),
      }),
    );
  }, [groupedAssets]);

  return (
    <div className="portfolio-page">
      {/* HEADER */}
      <div className="portfolio-header">
        <div>
          <span className="portfolio-breadcrumb">
            Portfolio
          </span>

          <h1>Tài sản</h1>
        </div>

        <button
          type="button"
          className="portfolio-btn-add"
          onClick={() => setShowModal(true)}
        >
          + Thêm tài sản
        </button>
      </div>

      {/* TABS */}
      <div className="portfolio-tabs">
        <button
          type="button"
          className={
            activeTab === 'overview'
              ? 'active'
              : ''
          }
          onClick={() =>
            setActiveTab('overview')
          }
        >
          Tổng quan
        </button>

        <button
          type="button"
          className={
            activeTab === 'plan'
              ? 'active'
              : ''
          }
          onClick={() =>
            setActiveTab('plan')
          }
        >
          Kế hoạch
        </button>
      </div>

      {/* TOTAL */}
      <div className="portfolio-total-card">
        <span className="portfolio-total-label">
          Tổng tài sản
        </span>

        <h2 className="portfolio-total-value">
          {formatCurrency(totalAssets)}
        </h2>
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="portfolio-grid">
          {/* CHART */}
          <div className="portfolio-donut-section">
            <div className="portfolio-card-header">
              <h3>Phân bổ tài sản</h3>

              <p>
                Tỷ trọng tài sản hiện tại
              </p>
            </div>

            <div className="portfolio-chart-wrapper">
              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={120}
                    paddingAngle={2}
                  >
                    {chartData.map(
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
                </PieChart>
              </ResponsiveContainer>

              <div className="portfolio-chart-center">
                <span>Tổng tài sản</span>

                <strong>
                  {(
                    totalAssets /
                    1000000000
                  ).toFixed(2)}
                  B
                </strong>
              </div>
            </div>

            {/* LEGEND */}
            <div className="portfolio-legend">
              {chartData.map(
                (item, index) => {
                  const percent = (
                    (item.value /
                      totalAssets) *
                    100
                  ).toFixed(0);

                  return (
                    <div
                      key={item.name}
                      className="portfolio-legend-item"
                    >
                      <div className="portfolio-legend-left">
                        <div
                          className="portfolio-legend-dot"
                          style={{
                            background:
                              COLORS[
                                index %
                                  COLORS.length
                              ],
                          }}
                        />

                        <span className="portfolio-legend-name">
                          {item.name}
                        </span>
                      </div>

                      <span className="portfolio-legend-pct">
                        {percent}%
                      </span>
                    </div>
                  );
                },
              )}
            </div>
          </div>

          {/* ASSETS */}
          <div className="portfolio-assets-section">
            <div className="portfolio-card-header">
              <h3>Danh sách tài sản</h3>

              <p>
                Các tài sản đang sở hữu
              </p>
            </div>

            <div className="portfolio-assets-list">
              {Object.entries(
                groupedAssets,
              ).map(
                ([category, items]) => {
                  const total =
                    items.reduce(
                      (sum, item) =>
                        sum + item.value,
                      0,
                    );

                  return (
                    <div
                      key={category}
                      className="portfolio-asset-group"
                    >
                      <div className="portfolio-asset-group-header">
                        <div className="portfolio-asset-icon">
                          {items[0].icon}
                        </div>

                        <div className="portfolio-asset-group-name">
                          {category}
                        </div>

                        <div className="portfolio-asset-group-total">
                          {formatCurrency(
                            total,
                          )}
                        </div>
                      </div>

                      {items.map((asset) => (
                        <div
                          key={asset.id}
                          className="portfolio-asset-item"
                        >
                          <div className="portfolio-asset-left">
                            <div className="portfolio-asset-icon">
                              {asset.icon}
                            </div>

                            <div>
                              <h4>
                                {asset.name}
                              </h4>

                              <span>
                                {
                                  asset.category
                                }
                              </span>
                            </div>
                          </div>

                          <div className="portfolio-asset-value">
                            {formatCurrency(
                              asset.value,
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                },
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

              <p>
                Phân bổ mục tiêu dài hạn
              </p>
            </div>

            <div className="portfolio-chart-wrapper">
              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    innerRadius={70}
                    outerRadius={120}
                  >
                    {chartData.map(
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
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="portfolio-plan-goals">
            <div className="portfolio-card-header">
              <h3>Mục tiêu tài chính</h3>

              <p>
                Theo dõi tiến độ tích lũy
              </p>
            </div>

            <div>
              <strong>
                Tự do tài chính
              </strong>

              <p>65% hoàn thành</p>
            </div>

            <div>
              <strong>
                Quỹ khẩn cấp
              </strong>

              <p>80% hoàn thành</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div
          className="portfolio-overlay"
          onClick={() =>
            setShowModal(false)
          }
        >
          <div
            className="portfolio-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="portfolio-modal-header">
              <div>
                <h2>Thêm tài sản</h2>
              </div>

              <button
                type="button"
                className="portfolio-modal-close"
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>
            </div>

            <form className="portfolio-form">
              <div className="portfolio-form-row">
                <div className="portfolio-field">
                  <label>
                    Tên tài sản
                  </label>

                  <input
                    className="portfolio-input"
                    placeholder="Ví dụ: VCB"
                  />
                </div>

                <div className="portfolio-field">
                  <label>
                    Giá trị
                  </label>

                  <input
                    className="portfolio-input"
                    placeholder="500000000"
                  />
                </div>
              </div>

              <div className="portfolio-field">
                <label>Ghi chú</label>

                <textarea
                  className="portfolio-input portfolio-textarea"
                  placeholder="Mô tả thêm..."
                />
              </div>
            </form>

            <div className="portfolio-modal-footer">
              <button
                type="button"
                className="portfolio-btn-cancel"
                onClick={() =>
                  setShowModal(false)
                }
              >
                Hủy
              </button>

              <button
                type="button"
                className="portfolio-btn-save"
              >
                Lưu tài sản
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}