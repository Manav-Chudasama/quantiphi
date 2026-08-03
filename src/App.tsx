import { useEffect, useReducer, useState, type FormEvent } from "react";
import { FiAlertTriangle, FiCamera, FiTrash2, FiTarget } from "react-icons/fi";
import { getGoalPlan, type FitnessGoal, type GoalPlan } from "./lib/goals";
import { MOCK_SCAN_FOODS, CUSTOM_ENTRY_PROFILE } from "./lib/mockFoods";
import { loadSession, saveSession } from "./lib/storage";
import type { DraftMeal, MealItem } from "./lib/types";
import {
  percentOf,
  scaleNutrition,
  sumMacros,
  type Macros,
} from "./lib/nutrition";

interface TrackerState {
  meals: MealItem[];
  goal: FitnessGoal;
  totals: Macros;
  targets: GoalPlan;
  validation: "within-budget" | "over-budget";
  warningOpen: boolean;
}

type TrackerAction =
  | { type: "add-meal"; meal: MealItem }
  | { type: "delete-meal"; id: string }
  | { type: "set-goal"; goal: FitnessGoal }
  | { type: "dismiss-warning" };

const STORAGE_FALLBACK: TrackerState = buildState([], "maintenance", false);

function buildState(
  meals: MealItem[],
  goal: FitnessGoal,
  warningOpen: boolean,
): TrackerState {
  const targets = getGoalPlan(goal);
  const totals = sumMacros(meals);
  const validation =
    totals.calories > targets.calories ? "over-budget" : "within-budget";

  return {
    meals,
    goal,
    totals,
    targets,
    validation,
    warningOpen: warningOpen && validation === "over-budget",
  };
}

function initializeTrackerState() {
  const storedSession = loadSession();

  if (!storedSession) {
    return STORAGE_FALLBACK;
  }

  return buildState(storedSession.meals, storedSession.goal, false);
}

function reducer(state: TrackerState, action: TrackerAction): TrackerState {
  switch (action.type) {
    case "add-meal": {
      const nextState = buildState(
        [action.meal, ...state.meals],
        state.goal,
        state.warningOpen,
      );

      return {
        ...nextState,
        warningOpen:
          state.validation === "within-budget" &&
          nextState.validation === "over-budget"
            ? true
            : state.warningOpen,
      };
    }
    case "delete-meal": {
      const nextState = buildState(
        state.meals.filter((meal) => meal.id !== action.id),
        state.goal,
        state.warningOpen,
      );

      return {
        ...nextState,
        warningOpen:
          nextState.validation === "over-budget" ? state.warningOpen : false,
      };
    }
    case "set-goal": {
      const nextState = buildState(state.meals, action.goal, state.warningOpen);

      return {
        ...nextState,
        warningOpen:
          state.validation === "within-budget" &&
          nextState.validation === "over-budget"
            ? true
            : state.warningOpen && nextState.validation === "over-budget",
      };
    }
    case "dismiss-warning": {
      return { ...state, warningOpen: false };
    }
    default: {
      return state;
    }
  }
}

function createMeal(
  template: typeof CUSTOM_ENTRY_PROFILE,
  grams: number,
  name: string,
  source: "manual" | "image",
): MealItem {
  const nutrition = scaleNutrition(template, grams);

  return {
    id: crypto.randomUUID(),
    name,
    grams,
    source,
    createdAt: Date.now(),
    templateId: template.id,
    ...nutrition,
  };
}

function App() {
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    initializeTrackerState,
  );
  const [draft, setDraft] = useState<DraftMeal>({
    name: "",
    grams: "250",
  });

  useEffect(() => {
    saveSession({
      meals: state.meals,
      goal: state.goal,
    });
  }, [state.goal, state.meals]);

  useEffect(() => {
    if (state.validation === "within-budget" && state.warningOpen) {
      dispatch({ type: "dismiss-warning" });
    }
  }, [state.validation, state.warningOpen]);

  const activePlan = state.targets;
  const remainingCalories = Math.max(
    activePlan.calories - state.totals.calories,
    0,
  );
  const overByCalories = Math.max(
    state.totals.calories - activePlan.calories,
    0,
  );
  const calorieFill = Math.min(
    percentOf(state.totals.calories, activePlan.calories),
    100,
  );
  const proteinFill = Math.min(
    percentOf(state.totals.protein, activePlan.protein),
    100,
  );
  const carbsFill = Math.min(
    percentOf(state.totals.carbs, activePlan.carbs),
    100,
  );
  const fatsFill = Math.min(percentOf(state.totals.fats, activePlan.fats), 100);

  const handleManualSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const mealName = draft.name.trim();
    const grams = Number(draft.grams);

    if (!mealName || Number.isNaN(grams) || grams <= 0) {
      return;
    }

    dispatch({
      type: "add-meal",
      meal: createMeal(CUSTOM_ENTRY_PROFILE, grams, mealName, "manual"),
    });

    setDraft({ name: "", grams: draft.grams });
  };

  const handleMockUpload = () => {
    const preset = MOCK_SCAN_FOODS[state.meals.length % MOCK_SCAN_FOODS.length];

    setDraft({
      name: preset.label,
      grams: String(preset.suggestedGrams),
    });

    dispatch({
      type: "add-meal",
      meal: createMeal(preset, preset.suggestedGrams, preset.label, "image"),
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_30%),linear-gradient(180deg,_rgba(15,23,42,0.96),_rgba(2,6,23,1))]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/90">
                <FiTarget />
                Daily Nutrition Dashboard
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Calorie Tracker & Macro Dashboard
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Track meals in memory, scale nutrition by portion, and watch
                  the budget shift in real time as your goal changes.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:w-[36rem]">
              {(["weight-loss", "maintenance", "muscle-gain"] as const).map(
                (goal) => {
                  const plan = getGoalPlan(goal);
                  const active = state.goal === goal;

                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => dispatch({ type: "set-goal", goal })}
                      className={`rounded-2xl border px-4 py-3 text-left transition duration-200 ${active ? plan.chipClass : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"}`}
                    >
                      <div className="text-sm font-semibold">{plan.label}</div>
                      <div className="mt-1 text-xs leading-5 opacity-80">
                        {plan.description}
                      </div>
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.95fr]">
          <div className="space-y-6">
            <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/80">
                    Daily Calorie Budget
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                    {activePlan.calories.toLocaleString()} kcal target
                  </h2>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
                  <div className="font-semibold text-white">
                    {state.validation === "over-budget"
                      ? `${overByCalories.toLocaleString()} over`
                      : `${remainingCalories.toLocaleString()} remaining`}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                    {state.validation === "over-budget"
                      ? "Crimson alert active"
                      : "Calm pace still green"}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="h-6 overflow-hidden rounded-full bg-slate-900 ring-1 ring-white/10">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${state.validation === "over-budget" ? "from-rose-500 to-red-500" : activePlan.barClass}`}
                    style={{ width: `${Math.max(calorieFill, 7)}%` }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
                  <span>
                    {state.totals.calories.toLocaleString()} kcal consumed
                  </span>
                  <span>{calorieFill.toFixed(1)}% of target</span>
                </div>
              </div>
            </article>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Protein",
                  current: state.totals.protein,
                  target: activePlan.protein,
                  fill: proteinFill,
                  tint: "from-emerald-400 to-green-500",
                },
                {
                  label: "Carbs",
                  current: state.totals.carbs,
                  target: activePlan.carbs,
                  fill: carbsFill,
                  tint: "from-sky-400 to-blue-500",
                },
                {
                  label: "Fats",
                  current: state.totals.fats,
                  target: activePlan.fats,
                  fill: fatsFill,
                  tint: "from-amber-400 to-orange-500",
                },
              ].map((meter) => (
                <article
                  key={meter.label}
                  className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                >
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {meter.label}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-white">
                        {meter.current.toFixed(1)} g
                      </h3>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      Target {meter.target.toFixed(0)} g
                    </div>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-900 ring-1 ring-white/10">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${meter.tint}`}
                      style={{ width: `${Math.max(meter.fill, 8)}%` }}
                    />
                  </div>
                  <p className="mt-3 text-xs text-slate-400">
                    {meter.fill.toFixed(1)}% of the current goal
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Logging Panel
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Add a meal
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleMockUpload}
                  className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
                >
                  <FiCamera />
                  Image Upload
                </button>
              </div>

              <form className="mt-5 space-y-4" onSubmit={handleManualSubmit}>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-200">
                    Food name
                  </span>
                  <input
                    value={draft.name}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
                    placeholder="e.g. Chicken wrap"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-200">
                    Portion weight (grams)
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={draft.grams}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        grams: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
                    placeholder="250"
                  />
                </label>

                <p className="text-xs leading-5 text-slate-400">
                  Manual entries use a standard baseline profile so the calories
                  and macros scale directly with the grams you enter.
                </p>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                >
                  Add meal
                </button>
              </form>
            </article>

            <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Daily History
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {state.meals.length} logged meals
                  </h2>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-xs text-slate-400">
                  {state.validation === "over-budget"
                    ? "Over budget"
                    : "Within budget"}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {state.meals.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center text-sm text-slate-400">
                    No meals yet. Use the form or the mock upload button to seed
                    the dashboard.
                  </div>
                ) : (
                  state.meals.map((meal) => (
                    <div
                      key={meal.id}
                      className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4 md:grid-cols-[minmax(0,1.7fr)_90px_90px_90px_90px_90px_auto] md:items-center"
                    >
                      <div>
                        <p className="font-semibold text-white">{meal.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                          {meal.source === "image"
                            ? "Mock image scan"
                            : "Manual entry"}
                        </p>
                      </div>
                      <StatCell value={`${meal.grams}g`} label="grams" />
                      <StatCell value={`${meal.calories}`} label="kcal" />
                      <StatCell
                        value={meal.protein.toFixed(1)}
                        label="protein"
                      />
                      <StatCell value={meal.carbs.toFixed(1)} label="carbs" />
                      <StatCell value={meal.fats.toFixed(1)} label="fats" />
                      <button
                        type="button"
                        onClick={() =>
                          dispatch({ type: "delete-meal", id: meal.id })
                        }
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
          </aside>
        </section>
      </div>

      {state.warningOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-rose-400/30 bg-slate-950 p-6 shadow-2xl shadow-black/50">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-rose-500/15 p-3 text-rose-200 ring-1 ring-rose-400/20">
                <FiAlertTriangle size={22} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-white">
                  Daily Budget Exceeded!
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  The current meal list is above the selected goal threshold.
                  Delete an item or switch to a higher budget to calm the
                  dashboard back down.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => dispatch({ type: "dismiss-warning" })}
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Dismiss warning
            </button>
          </div>
        </div>
      ) : null}
    </main>
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

export default App;
