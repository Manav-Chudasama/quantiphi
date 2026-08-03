import { FiTrash2 } from "react-icons/fi";
import type { MealItem } from "../lib/types";

interface MealHistoryProps {
  meals: MealItem[];
  validation: "within-budget" | "over-budget";
  onDelete: (id: string) => void;
}

export function MealHistory({ meals, validation, onDelete }: MealHistoryProps) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Daily History
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {meals.length} logged meals
          </h2>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-xs text-slate-400">
          {validation === "over-budget" ? "Over budget" : "Within budget"}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {meals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center text-sm text-slate-400">
            No meals yet. Use the form or the mock upload button to seed the
            dashboard.
          </div>
        ) : (
          meals.map((meal) => (
            <div
              key={meal.id}
              className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4 md:grid-cols-[minmax(0,1.7fr)_90px_90px_90px_90px_90px_auto] md:items-center"
            >
              <div>
                <p className="font-semibold text-white">{meal.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                  {meal.source === "image" ? "Mock image scan" : "Manual entry"}
                </p>
              </div>
              <StatCell value={`${meal.grams}g`} label="grams" />
              <StatCell value={`${meal.calories}`} label="kcal" />
              <StatCell value={meal.protein.toFixed(1)} label="protein" />
              <StatCell value={meal.carbs.toFixed(1)} label="carbs" />
              <StatCell value={meal.fats.toFixed(1)} label="fats" />
              <button
                type="button"
                onClick={() => onDelete(meal.id)}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3 text-rose-200 transition hover:bg-rose-500/15 hover:text-rose-100"
                aria-label={`Delete ${meal.name}`}
              >
                <FiTrash2 />
              </button>
            </div>
          ))
        )}
      </div>
    </article>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm md:block md:bg-transparent md:px-0 md:py-0 md:text-right">
      <span className="text-xs uppercase tracking-[0.16em] text-slate-500 md:hidden">
        {label}
      </span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
