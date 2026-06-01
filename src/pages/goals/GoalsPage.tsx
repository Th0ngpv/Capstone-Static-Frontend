import { useMemo, useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../locales/translations';

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
  projectionLabel = 'Projected',
}: TooltipContentProps<
  ValueType,
  NameType
> & { projectionLabel?: string }) => {
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
          <span>{projectionLabel}</span>

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
  const { language } = useLanguage();
  const t = translations[language];

  const typeMap: Record<GoalType, string> = {
    'khác': t.typeOther,
    'mua nhà': t.typeHouse,
    'mua xe': t.typeCar,
    'quỹ hưu trí': t.typeRetirement,
    'đám cưới': t.typeWedding,
    'sửa nhà': t.typeReno,
    'giáo dục': t.typeEducation,
  };

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
    ) ?? goals[0] ?? { id: 'empty', goalTitle: t.noGoals, goalPriority: 'P3', goalType: 'khác', note: t.createNewGoal, lumpSumAmountByDeadline: 0, deadline: new Date().toISOString().split('T')[0] };

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
          <span>{t.financialPlanning}</span>

          <h1>{t.goalsOverview}</h1>
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
          {t.createGoalBtn}
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
              <h2>{t.createGoalTitle}</h2>

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
                placeholder={t.placeholderHouse}
                value={formData.goalTitle}
                onChange={(e) => setFormData({...formData, goalTitle: e.target.value})}
              />

              <select
                value={formData.goalType}
                onChange={(e) => setFormData({...formData, goalType: e.target.value as GoalType})}
              >
                <option value="khác">{t.typeOther}</option>
                <option value="mua nhà">{t.typeHouse}</option>
                <option value="mua xe">{t.typeCar}</option>
                <option value="quỹ hưu trí">{t.typeRetirement}</option>
                <option value="đám cưới">{t.typeWedding}</option>
                <option value="sửa nhà">{t.typeReno}</option>
                <option value="giáo dục">{t.typeEducation}</option>
              </select>

              <select 
                value={formData.goalPriority}
                onChange={(e) => setFormData({...formData, goalPriority: e.target.value as Goal['goalPriority']})}
              >
                <option value="P1">{t.priorityP1}</option>
                <option value="P2">{t.priorityP2}</option>
                <option value="P3">{t.priorityP3}</option>
                <option value="P4">{t.priorityP4}</option>
                <option value="P5">{t.priorityP5}</option>
              </select>

              <textarea
                placeholder={t.placeholderNote}
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
                {t.addGoal}
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
                {typeMap[goal.goalType]}
              </div>

              <p>{goal.note}</p>

              <div className="goal-card__meta">
                {t.target}{' '}
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
                  {monthsLeft} {t.monthsLeft}
                </span>
              </div>

              <div className="goal-card__progress">
                <span style={{ width: '65%' }} />
              </div>

              <div className="goal-card__footer">
                <span>{t.onSchedule}</span>

                <div>
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleEditGoal(goal); }}>
                    {t.edit}
                  </button>

                  <button type="button" onClick={(e) => { e.stopPropagation(); handleDeleteGoal(goal.id); }}>
                    {t.delete}
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
              <span>{t.projection}</span>

              <h2>
                {selectedGoal.goalTitle}
              </h2>
            </div>

            <span>{t.onPlan}</span>
          </div>

          {/* stats */}
          <div className="goal-stats">
            <article>
              <span>{t.goalTarget}</span>

              <strong>
                {formatCompactCurrency(
                  selectedTarget,
                )}
              </strong>
            </article>

            <article>
              <span>{t.perMonth}</span>

              <strong>
                {formatCompactCurrency(
                  monthlyContribution,
                )}
              </strong>
            </article>

            <article>
              <span>{t.deadlineLabel}</span>

              <strong>
                {formatTargetDate(
                  selectedGoal.deadline,
                )}
              </strong>
            </article>

            <article>
              <span>{t.totalGoalsAmount}</span>

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

                <Tooltip content={(props) => <GoalChartTooltip {...props} projectionLabel={t.projection} />} />

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
              <span>{t.projection}</span>

              <strong>
                {formatProjectionDate(
                  selectedMonthsLeft,
                )}
              </strong>
            </div>
          </div>

          <p>
            {t.savingRequired}
          </p>
        </section>

        {/* recommendations */}
        <section className="goal-recommendations">
          <h2>{t.recommendations}</h2>

          <article className="goal-recommendation">
            <strong>
              {t.increaseSavings}
            </strong>

            <span>
              {t.increaseSavingsDesc}
            </span>
          </article>

          <article className="goal-recommendation">
            <strong>
              {t.diversifyInvestments}
            </strong>

            <span>
              {t.diversifyInvestmentsDesc}
            </span>
          </article>

          <article className="goal-recommendation">
            <strong>{t.emergencyFund}</strong>

            <span>
              {t.emergencyFundDesc}
            </span>
          </article>
        </section>
      </section>
    </section>
  );
}