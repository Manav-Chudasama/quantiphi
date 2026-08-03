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
        <div
          className={`inline-flex self-start rounded-full border px-3 py-2 text-xs font-medium ${validation === "over-budget" ? "border-red-200 bg-red-50 text-red-700" : "border-zinc-200 bg-zinc-50 text-zinc-600"}`}
        >
          {validation === "over-budget" ? "Over budget" : "Within budget"}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        {meals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
            No meals yet. Use the form or the mock upload button to seed the
            dashboard.
          </div>
        ) : (
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                <th className="px-4 pb-1 font-medium">Meal</th>
                <th className="px-4 pb-1 font-medium">Source</th>
                <th className="px-4 pb-1 font-medium">Grams</th>
                <th className="px-4 pb-1 font-medium">Kcal</th>
                <th className="px-4 pb-1 font-medium">Protein</th>
                <th className="px-4 pb-1 font-medium">Carbs</th>
                <th className="px-4 pb-1 font-medium">Fats</th>
                <th className="px-4 pb-1 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal) => (
                <tr
                  key={meal.id}
                  className="rounded-2xl border border-zinc-200 bg-white shadow-sm"
                >
                  <td className="px-4 py-4 align-middle">
                    <p className="max-w-[14rem] truncate text-base font-semibold text-zinc-950">
                      {meal.name}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
                      {meal.source === "image"
                        ? "Mock image scan"
                        : "Manual entry"}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <StatCell
                      value={`${meal.grams}g`}
                      label="grams"
                      accent="yellow"
                    />
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <StatCell
                      value={`${meal.calories}`}
                      label="kcal"
                      accent="red"
                    />
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <StatCell
                      value={meal.protein.toFixed(1)}
                      label="protein"
                      accent="blue"
                    />
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <StatCell
                      value={meal.carbs.toFixed(1)}
                      label="carbs"
                      accent="green"
                    />
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <StatCell
                      value={meal.fats.toFixed(1)}
                      label="fats"
                      accent="zinc"
                    />
                  </td>
                  <td className="px-4 py-4 align-middle text-right">
                    <button
                      type="button"
                      onClick={() => onDelete(meal.id)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-red-600 transition hover:bg-red-50 hover:text-red-700"
                      aria-label={`Delete ${meal.name}`}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  label: string;
  value: string;
  accent: "red" | "blue" | "green" | "yellow" | "zinc";
}) {
  const accentClasses =
    accent === "red"
      ? "border-red-200 bg-red-50 text-red-700"
      : accent === "blue"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : accent === "green"
          ? "border-green-200 bg-green-50 text-green-700"
          : accent === "yellow"
            ? "border-yellow-200 bg-yellow-50 text-yellow-700"
            : "border-zinc-200 bg-zinc-50 text-zinc-700";

  return (
    <div
      className={`min-w-[7rem] rounded-2xl border px-3 py-2 text-sm ${accentClasses}`}
    >
      <div className="text-[10px] uppercase tracking-[0.16em] opacity-75">
        {label}
      </div>
      <div className="mt-1 font-semibold leading-none text-zinc-950">
        {value}
      </div>
    </div>
  );
}
