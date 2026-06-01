import { useMemo, useState, useEffect } from 'react';

import './GoalsPage.css';
import { Area, ResponsiveContainer, ReferenceLine, AreaChart, Tooltip, YAxis, XAxis } from 'recharts';
import type {
  TooltipContentProps,
} from 'recharts';

import type {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

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

  return new Intl.DateTimeFormat('en-GB', {
    year: '2-digit',
    month: '2-digit',
  }).format(date);
}

// Table Legend Helper
const formatGoalCurrency = (
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

  if (value >= 1_000) {
    return `${(
      value / 1_000
    ).toFixed(0)}K`;
  }

  return value.toString();
};

//Custom tooltip for chart
const GoalChartTooltip = ({
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
      <div className="goal-chart-tooltip">
        <p className="goal-chart-tooltip-label">
          {label}
        </p>

        <div className="goal-chart-tooltip-row">
          <span>Projected</span>

          <strong>
            {formatGoalCurrency(
              Number(payload[0].value),
            )}{' '}
            VND
          </strong>
        </div>
      </div>
    );
  }

  return null;
};

export default function GoalsPage() {
  // goals state
  const [goals, setGoals] = useState<Goal[]>(() => {
    const savedGoals = localStorage.getItem('capstone_goals');
    if (savedGoals) {
      try {
        return JSON.parse(savedGoals);
      } catch (e) {
        console.error('Failed to parse goals from local storage', e);
      }
    }
    return mockGoals;
  });

  // selected goal state
  const [selectedGoalId, setSelectedGoalId] =
    useState<string>('1');

  // sync goals to local storage
  useEffect(() => {
    localStorage.setItem('capstone_goals', JSON.stringify(goals));
  }, [goals]);

  // form toggle state
  const [isFormOpen, setIsFormOpen] =
    useState(false);

  // new goal form state
  const [formData, setFormData] = useState<Partial<Goal>>({
    goalTitle: '',
    goalType: 'khác',
    goalPriority: 'P3',
    note: '',
    lumpSumAmountByDeadline: 0,
    deadline: '',
  });

  // handle form submission (Create & Update)
  const handleSubmitGoal = () => {
    console.log('[handleSubmitGoal] triggered with formData:', formData);
    if (formData.id) {
      console.log('[handleSubmitGoal] updating existing goal ID:', formData.id);
      setGoals((prev) =>
        prev.map((g) => (g.id === formData.id ? ({ ...g, ...formData } as Goal) : g))
      );
    } else {
      const newGoal: Goal = {
        ...(formData as Goal),
        id: Date.now().toString(), // Generate a simple unique ID
      };
      console.log('[handleSubmitGoal] creating new goal:', newGoal);
      setGoals((prev) => [...prev, newGoal]);
      setSelectedGoalId(newGoal.id); // Auto-select the newly created goal
    }
    setIsFormOpen(false);
  };

  // handle editing a goal (Populate form & open modal)
  const handleEditGoal = (goal: Goal) => {
    console.log('[handleEditGoal] populating form with goal:', goal);
    setFormData(goal);
    setIsFormOpen(true);
  };

  // handle deleting a goal
  const handleDeleteGoal = (id: string) => {
    console.log('[handleDeleteGoal] deleting goal ID:', id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // selected goal
  const selectedGoal =
    goals.find(
      (goal) => goal.id === selectedGoalId,
    ) ?? goals[0] ?? { id: 'empty', goalTitle: 'Chưa có mục tiêu', goalPriority: 'P3', goalType: 'khác', note: 'Hãy tạo mục tiêu mới.', lumpSumAmountByDeadline: 0, deadline: new Date().toISOString().split('T')[0] };

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

  const chartMax =
    chartTarget * 1.15;

  const projectionMonths = Array.from(
    {
      length:
        selectedMonthsLeft + 5,
    },
    (_, index) => index,
  );

  const chartData = projectionMonths.map(
    (month) => ({
      month: formatProjectionDate(month),

      savings: Math.min(
        monthlyContribution * month,
        chartMax,
      ),

      target: chartMax,
    }),
  );

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
          onClick={() => {
            console.log('[Open Create Modal] Resetting form data');
            setFormData({
              goalTitle: '',
              goalType: 'khác',
              goalPriority: 'P3',
              note: '',
              lumpSumAmountByDeadline: 0,
              deadline: '',
            });
            setIsFormOpen(true);
          }}
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

            {/* TODO: Bind these inputs to formData & onChange */}
            <form className="goals-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Mua căn hộ"
                value={formData.goalTitle}
                onChange={(e) => setFormData({...formData, goalTitle: e.target.value})}
              />

              <select
                value={formData.goalType}
                onChange={(e) => setFormData({...formData, goalType: e.target.value as GoalType})}
              >
                <option>Mua nhà</option>
              </select>

              <select 
                value={formData.goalPriority}
                onChange={(e) => setFormData({...formData, goalPriority: e.target.value as Goal['goalPriority']})}
              >
                <option>P1 - Quan trọng</option>
              </select>

              <textarea
                placeholder="Tiết kiệm để mua căn hộ đầu tiên"
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
              />

              <input
                type="number"
                value={formData.lumpSumAmountByDeadline}
                onChange={(e) => setFormData({...formData, lumpSumAmountByDeadline: Number(e.target.value)})}
              />

              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              />

              <button
                className="goals-submit-btn"
                type="button"
                onClick={handleSubmitGoal}
              >
                Thêm mục tiêu
              </button>
            </form>
          </div>
        </div>
      )}

      {/* goals grid */}
      <section className="goals-grid"
        onWheel={(event) => {
          event.currentTarget.scrollLeft += event.deltaY;
        }}>
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
              onClick={() => {
                console.log('[Select Goal] Selected goal ID:', goal.id);
                setSelectedGoalId(goal.id)
              }}
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
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleEditGoal(goal); }}>
                    Sửa
                  </button>

                  <button type="button" onClick={(e) => { e.stopPropagation(); handleDeleteGoal(goal.id); }}>
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
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData}>


                <XAxis dataKey="month"
                  tick={{
                    fontSize: 12,
                  }} />

                <YAxis tickFormatter={formatGoalCurrency}
                  tick={{
                    fontSize: 12,
                  }} />

                <Tooltip content={GoalChartTooltip} />

                <ReferenceLine
                  y={chartTarget}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                />

                <Area
                  type="monotone"
                  dataKey="savings"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>

            <div className="goal-chart__caption">
              <span>Dự đoán</span>

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