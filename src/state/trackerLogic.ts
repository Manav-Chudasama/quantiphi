import { getGoalPlan, type FitnessGoal, type GoalPlan } from "../lib/goals";
import {
  scaleNutrition,
  sumMacros,
  type FoodTemplate,
  type Macros,
} from "../lib/nutrition";
import type { MealItem, MealSource } from "../lib/types";

export interface TrackerState {
  meals: MealItem[];
  goal: FitnessGoal;
  totals: Macros;
  targets: GoalPlan;
  validation: "within-budget" | "over-budget";
  warningOpen: boolean;
}

export type TrackerAction =
  | { type: "add-meal"; meal: MealItem }
  | { type: "delete-meal"; id: string }
  | { type: "set-goal"; goal: FitnessGoal }
  | { type: "dismiss-warning" };

export function buildTrackerState(
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

export function createDefaultTrackerState() {
  return buildTrackerState([], "maintenance", false);
}

export function applyTrackerAction(
  state: TrackerState,
  action: TrackerAction,
): TrackerState {
  switch (action.type) {
    case "add-meal": {
      const nextState = buildTrackerState(
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
      const nextState = buildTrackerState(
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
      const nextState = buildTrackerState(
        state.meals,
        action.goal,
        state.warningOpen,
      );

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

export function createMealItem(
  template: FoodTemplate,
  grams: number,
  name: string,
  source: MealSource,
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
