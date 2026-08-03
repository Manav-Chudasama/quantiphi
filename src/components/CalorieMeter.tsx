import type { GoalPlan } from '../lib/goals'

interface CalorieMeterProps {
  targets: GoalPlan
  caloriesConsumed: number
  calorieFill: number
  remainingCalories: number
  validation: 'within-budget' | 'over-budget'
  overByCalories: number
}

export function CalorieMeter({
  targets,
  caloriesConsumed,
  calorieFill,
  remainingCalories,
  validation,
  overByCalories,
}: CalorieMeterProps) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/80">
            Daily Calorie Budget
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            {targets.calories.toLocaleString()} kcal target
          </h2>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
          <div className="font-semibold text-white">
            {validation === 'over-budget'
              ? `${overByCalories.toLocaleString()} over`
              : `${remainingCalories.toLocaleString()} remaining`}
          </div>
          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
            {validation === 'over-budget' ? 'Crimson alert active' : 'Calm pace still green'}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="h-6 overflow-hidden rounded-full bg-slate-900 ring-1 ring-white/10">
          <div
            className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${validation === 'over-budget' ? 'from-rose-500 to-red-500' : targets.barClass}`}
            style={{ width: `${Math.max(calorieFill, 7)}%` }}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
          <span>{caloriesConsumed.toLocaleString()} kcal consumed</span>
          <span>{calorieFill.toFixed(1)}% of target</span>
        </div>
      </div>
    </article>
  )
}