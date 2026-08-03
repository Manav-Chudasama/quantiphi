import { useState, type FormEvent } from "react";
import { FiTarget } from "react-icons/fi";
import { CUSTOM_ENTRY_PROFILE, MOCK_SCAN_FOODS } from "./lib/mockFoods";
import { percentOf } from "./lib/nutrition";
import type { DraftMeal } from "./lib/types";
import { CalorieMeter } from "./components/CalorieMeter";
import { GoalToggle } from "./components/GoalToggle";
import { MacroMeters } from "./components/MacroMeters";
import { MealHistory } from "./components/MealHistory";
import { MealLogger } from "./components/MealLogger";
import { WarningModal } from "./components/WarningModal";
import { useMealTracker } from "./state/useMealTracker";

function App() {
  const { state, addMealFromTemplate, deleteMeal, setGoal, dismissWarning } =
    useMealTracker();
  const [draft, setDraft] = useState<DraftMeal>({
    name: "",
    grams: "250",
  });

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

    addMealFromTemplate(CUSTOM_ENTRY_PROFILE, grams, mealName, "manual");
    setDraft({ name: "", grams: draft.grams });
  };

  const handleMockUpload = () => {
    const preset = MOCK_SCAN_FOODS[state.meals.length % MOCK_SCAN_FOODS.length];

    setDraft({
      name: preset.label,
      grams: String(preset.suggestedGrams),
    });

    addMealFromTemplate(preset, preset.suggestedGrams, preset.label, "image");
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

            <GoalToggle goal={state.goal} onChange={setGoal} />
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.95fr]">
          <div className="space-y-6">
            <CalorieMeter
              targets={activePlan}
              caloriesConsumed={state.totals.calories}
              calorieFill={calorieFill}
              remainingCalories={remainingCalories}
              validation={state.validation}
              overByCalories={overByCalories}
            />

            <MacroMeters
              protein={{
                current: state.totals.protein,
                target: activePlan.protein,
                fill: proteinFill,
              }}
              carbs={{
                current: state.totals.carbs,
                target: activePlan.carbs,
                fill: carbsFill,
              }}
              fats={{
                current: state.totals.fats,
                target: activePlan.fats,
                fill: fatsFill,
              }}
            />
          </div>

          <aside className="space-y-6">
            <MealLogger
              draft={draft}
              onDraftChange={setDraft}
              onSubmit={handleManualSubmit}
              onMockUpload={handleMockUpload}
            />

            <MealHistory
              meals={state.meals}
              validation={state.validation}
              onDelete={deleteMeal}
            />
          </aside>
        </section>
      </div>

      <WarningModal open={state.warningOpen} onDismiss={dismissWarning} />
    </main>
  );
}

export default App;
