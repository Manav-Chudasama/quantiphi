import { FiTrash2 } from "react-icons/fi";
import type { MealItem } from "../lib/types";

interface MealHistoryProps {
  meals: MealItem[];
  validation: "within-budget" | "over-budget";
  onDelete: (id: string) => void;
}

export function MealHistory({ meals, validation, onDelete }: MealHistoryProps) {
  return (
    <article className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Daily History
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
            {meals.length} logged meals
          </h2>
        </div>
        <div className={`inline-flex self-start rounded-full border px-3 py-2 text-xs font-medium ${validation === 'over-budget' ? 'border-red-200 bg-red-50 text-red-700' : 'border-zinc-200 bg-zinc-50 text-zinc-600'}`}>
          {validation === "over-budget" ? "Over budget" : "Within budget"}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {meals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
            No meals yet. Use the form or the mock upload button to seed the
            dashboard.
          </div>
        ) : (
          meals.map((meal) => (
            <div
              key={meal.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-zinc-950">
                    {meal.name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
                    {meal.source === "image" ? "Mock image scan" : "Manual entry"}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5 xl:gap-2 flex-1">
                  <StatCell value={`${meal.grams}g`} label="grams" accent="yellow" />
                  <StatCell value={`${meal.calories}`} label="kcal" accent="red" />
                  <StatCell value={meal.protein.toFixed(1)} label="protein" accent="blue" />
                  <StatCell value={meal.carbs.toFixed(1)} label="carbs" accent="green" />
                  <StatCell value={meal.fats.toFixed(1)} label="fats" accent="zinc" />
                </div>

                <button
                  type="button"
                  onClick={() => onDelete(meal.id)}
                  className="inline-flex h-11 w-11 items-center justify-center self-start rounded-full border border-zinc-200 bg-white text-red-600 transition hover:bg-red-50 hover:text-red-700 lg:self-center"
                  aria-label={`Delete ${meal.name}`}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
}

function StatCell({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent: 'red' | 'blue' | 'green' | 'yellow' | 'zinc'
}) {
  const accentClasses =
    accent === 'red'
      ? 'border-red-200 bg-red-50 text-red-700'
      : accent === 'blue'
        ? 'border-blue-200 bg-blue-50 text-blue-700'
        : accent === 'green'
          ? 'border-green-200 bg-green-50 text-green-700'
          : accent === 'yellow'
            ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
            : 'border-zinc-200 bg-zinc-50 text-zinc-700'

  return (
    <div className={`rounded-2xl border px-3 py-2 text-sm ${accentClasses}`}>
      <div className="text-[10px] uppercase tracking-[0.16em] opacity-75">{label}</div>
      <div className="mt-1 font-semibold leading-none text-zinc-950">{value}</div>
    </div>
  );
}
