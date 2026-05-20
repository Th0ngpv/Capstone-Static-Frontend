import { useMemo, useState } from 'react';

import './GoalsPage.css';

// types declaration
type GoalType =
  | 'quỹ hưu trí'
  | 'đám cưới'
  | 'giáo dục'
  | 'mua xe'
  | 'mua nhà'
  | 'sửa nhà'
  | 'khác';

interface Goal {
  id: string;
  goalTitle: string;
  goalPriority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
  goalType: GoalType;
  note: string;
  lumpSumAmountByDeadline: number;
  deadline: string;
}

// mock data
const mockGoals: Goal[] = [
  {
    id: '1',
    goalTitle: 'Mua căn hộ',
    goalPriority: 'P1',
    goalType: 'mua nhà',
    note: 'Tiết kiệm để mua căn hộ đầu tiên.',
    lumpSumAmountByDeadline: 2500000000,
    deadline: '2028-06-01',
  },
  {
    id: '2',
    goalTitle: 'Quỹ hưu trí',
    goalPriority: 'P2',
    goalType: 'quỹ hưu trí',
    note: 'Đầu tư dài hạn cho tương lai.',
    lumpSumAmountByDeadline: 5000000000,
    deadline: '2045-01-01',
  },
  {
    id: '3',
    goalTitle: 'Tesla Model 3',
    goalPriority: 'P3',
    goalType: 'mua xe',
    note: 'Nâng cấp sang xe điện mới.',
    lumpSumAmountByDeadline: 1200000000,
    deadline: '2027-03-01',
  },
];

// chart data
const projectionMonths = Array.from(
  { length: 24 },
  (_, index) => index,
);

// currency formatter
function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

// compact currency formatter
function formatCompactCurrency(value: number) {
  if (value >= 1000000000) {
    return `${Math.round(value / 1000000000)}B`;
  }

  if (value >= 1000000) {
    return `${Math.round(value / 1000000)}M`;
  }

  return `${Math.round(value / 1000)}K`;
}

// date formatter
function formatTargetDate(dateString: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'short',
  }).format(new Date(dateString));
}

// calculate remaining months
function getMonthsLeft(dateString: string) {
  const now = new Date();
  const deadline = new Date(dateString);

  const months =
    (deadline.getFullYear() - now.getFullYear()) *
    12 +
    deadline.getMonth() -
    now.getMonth();

  return Math.max(months, 0);
}

// projection date formatter
function formatProjectionDate(monthsFromNow: number) {
  const date = new Date();

  date.setMonth(
    date.getMonth() + Math.ceil(monthsFromNow),
  );

  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'short',
  }).format(date);
}

export default function GoalsPage() {
  // goals state
  const [goals] = useState<Goal[]>(mockGoals);

  // selected goal state
  const [selectedGoalId, setSelectedGoalId] =
    useState<string>('1');

  // form toggle state
  const [isFormOpen, setIsFormOpen] =
    useState(false);

  // selected goal
  const selectedGoal =
    goals.find(
      (goal) => goal.id === selectedGoalId,
    ) ?? goals[0];

  // total goals amount
  const totalTarget = useMemo(() => {
    return goals.reduce(
      (sum, goal) =>
        sum + goal.lumpSumAmountByDeadline,
      0,
    );
  }, [goals]);

  // current selected goal amount
  const selectedTarget =
    selectedGoal.lumpSumAmountByDeadline;

  // remaining months
  const selectedMonthsLeft = getMonthsLeft(
    selectedGoal.deadline,
  );

  // monthly saving amount
  const monthlyContribution =
    selectedTarget / selectedMonthsLeft;

  // chart calculations
  const chartTarget =
    selectedTarget > 0 ? selectedTarget : 1;

  const projectedValues = projectionMonths.map(
    (month) =>
      Math.min(
        monthlyContribution * month,
        chartTarget,
      ),
  );

  const chartMax = Math.max(
    chartTarget,
    ...projectedValues,
    1,
  );

  // chart points
  const chartPoints = projectedValues.map(
    (value, index) => {
      const x =
        34 +
        (index /
          (projectionMonths.length - 1)) *
        498;

      const y =
        176 - (value / chartMax) * 130;

      return { x, y };
    },
  );

  // chart line
  const chartLine = chartPoints
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'} ${point.x
        } ${point.y}`,
    )
    .join(' ');

  // chart area
  const chartArea = `${chartLine} L 532 176 L 34 176 Z`;

  // target line position
  const targetY =
    176 - (chartTarget / chartMax) * 130;

  return (
    <section className="goals-main">
      {/* header */}
      <section className="goals-header">
        <div>
          <span>Lập kế hoạch tài chính</span>

          <h1>Tổng quan mục tiêu</h1>
        </div>

        <button
          className="goals-create-btn"
          type="button"
          onClick={() =>
            setIsFormOpen(!isFormOpen)
          }
        >
          + Tạo mục tiêu
        </button>
      </section>

      {/* modal */}
      {isFormOpen && (
        <div
          className="goals-overlay"
          onClick={() =>
            setIsFormOpen(false)
          }
        >
          <div
            className="goals-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="goals-modal-header">
              <h2>Tạo mục tiêu</h2>

              <button
                type="button"
                onClick={() =>
                  setIsFormOpen(false)
                }
              >
                ✕
              </button>
            </div>

            <form className="goals-form">
              <input
                type="text"
                value="Mua căn hộ"
                readOnly
              />

              <select
                value="mua nhà"
                disabled
              >
                <option>Mua nhà</option>
              </select>

              <select value="P1" disabled>
                <option>P1 - Quan trọng</option>
              </select>

              <textarea
                value="Tiết kiệm để mua căn hộ đầu tiên"
                readOnly
              />

              <input
                type="number"
                value="2500000000"
                readOnly
              />

              <input
                type="date"
                value="2028-06-01"
                readOnly
              />

              <button
                className="goals-submit-btn"
                type="button"
              >
                Thêm mục tiêu
              </button>
            </form>
          </div>
        </div>
      )}

      {/* goals grid */}
      <section className="goals-grid">
        {goals.map((goal) => {
          const monthsLeft = getMonthsLeft(
            goal.deadline,
          );

          return (
            <article
              key={goal.id}
              className={`goal-card ${goal.id === selectedGoal.id
                ? 'is-selected'
                : ''
                }`}
              onClick={() =>
                setSelectedGoalId(goal.id)
              }
            >
              <div className="goal-card__top">
                <div className="goal-card__icon">
                  🎯
                </div>

                <span
                  className={`goal-card__badge priority-${goal.goalPriority}`}
                >
                  {goal.goalPriority}
                </span>
              </div>

              <h2>{goal.goalTitle}</h2>

              <div className="goal-card__meta-type">
                {goal.goalType}
              </div>

              <p>{goal.note}</p>

              <div className="goal-card__meta">
                Mục tiêu:{' '}
                {formatTargetDate(
                  goal.deadline,
                )}
              </div>

              <div className="goal-card__amount">
                <strong>
                  {formatCurrency(
                    goal.lumpSumAmountByDeadline,
                  )}
                </strong>

                <span>
                  {monthsLeft} tháng còn lại
                </span>
              </div>

              <div className="goal-card__progress">
                <span style={{ width: '65%' }} />
              </div>

              <div className="goal-card__footer">
                <span>Đúng tiến độ</span>

                <div>
                  <button type="button">
                    Sửa
                  </button>

                  <button type="button">
                    Xóa
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* lower section */}
      <section className="goals-lower-grid">
        {/* projection */}
        <section className="goal-projection">
          <div className="goal-panel-heading">
            <div>
              <span>Dự đoán</span>

              <h2>
                {selectedGoal.goalTitle}
              </h2>
            </div>

            <span>Đúng kế hoạch</span>
          </div>

          {/* stats */}
          <div className="goal-stats">
            <article>
              <span>Mục tiêu</span>

              <strong>
                {formatCompactCurrency(
                  selectedTarget,
                )}
              </strong>
            </article>

            <article>
              <span>Mỗi tháng</span>

              <strong>
                {formatCompactCurrency(
                  monthlyContribution,
                )}
              </strong>
            </article>

            <article>
              <span>Hạn</span>

              <strong>
                {formatTargetDate(
                  selectedGoal.deadline,
                )}
              </strong>
            </article>

            <article>
              <span>Tổng goals</span>

              <strong>
                {formatCompactCurrency(
                  totalTarget,
                )}
              </strong>
            </article>
          </div>

          {/* chart */}
          <div className="goal-chart">
            <svg
              className="goal-chart__svg"
              viewBox="0 0 560 220"
              fill="none"
            >
              <defs>
                <linearGradient
                  id="goalProjectionFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#22c55e"
                    stopOpacity="0.35"
                  />

                  <stop
                    offset="100%"
                    stopColor="#22c55e"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              <path
                className="goal-chart__area"
                d={chartArea}
              />

              <path
                className="goal-chart__line"
                d={chartLine}
              />

              <line
                className="goal-chart__target-line"
                x1="34"
                x2="532"
                y1={targetY}
                y2={targetY}
              />

              {chartPoints.map(
                (point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    className="goal-chart__endpoint"
                  />
                ),
              )}
            </svg>

            <div className="goal-chart__caption">
              <span>Hiện tại</span>

              <strong>
                {formatProjectionDate(
                  selectedMonthsLeft,
                )}
              </strong>
            </div>
          </div>

          <p>
            Số tiền cần tiết kiệm mỗi tháng
            để đạt mục tiêu đúng hạn.
          </p>
        </section>

        {/* recommendations */}
        <section className="goal-recommendations">
          <h2>Gợi ý</h2>

          <article className="goal-recommendation">
            <strong>
              Tăng tiền tiết kiệm hàng tháng
            </strong>

            <span>
              Tăng thêm 10% có thể giúp đạt
              mục tiêu sớm hơn.
            </span>
          </article>

          <article className="goal-recommendation">
            <strong>
              Đa dạng đầu tư
            </strong>

            <span>
              Cân nhắc quỹ index để tăng
              trưởng dài hạn.
            </span>
          </article>

          <article className="goal-recommendation">
            <strong>Quỹ khẩn cấp</strong>

            <span>
              Nên có ít nhất 6 tháng chi phí
              dự phòng.
            </span>
          </article>
        </section>
      </section>
    </section>
  );
}