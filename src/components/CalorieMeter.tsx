import type { GoalPlan } from "../lib/goals";

interface CalorieMeterProps {
  targets: GoalPlan;
  caloriesConsumed: number;
  calorieFill: number;
  remainingCalories: number;
  validation: "within-budget" | "over-budget";
  overByCalories: number;
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
    <article className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-700">
            Daily Calorie Budget
          </p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-zinc-950 sm:text-3xl">
            {targets.calories.toLocaleString()} kcal target
          </h2>
        </div>
        <div className="min-w-[13rem] rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
          <div className="font-semibold text-zinc-950">
            {validation === "over-budget"
              ? `${overByCalories.toLocaleString()} over`
              : `${remainingCalories.toLocaleString()} remaining`}
          </div>
          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
            {validation === "over-budget" ? "Red alert active" : "Green pace active"}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="h-5 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${validation === 'over-budget' ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${Math.max(calorieFill, 7)}%` }}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-600">
          <span>{caloriesConsumed.toLocaleString()} kcal consumed</span>
          <span>{calorieFill.toFixed(1)}% of target</span>
        </div>
      </div>
    </article>
  );
}
