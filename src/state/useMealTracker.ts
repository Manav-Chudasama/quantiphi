import { useEffect, useReducer } from "react";
import { getGoalPlan, type FitnessGoal, type GoalPlan } from "../lib/goals";
import { loadSession, saveSession } from "../lib/storage";
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

type TrackerAction =
  | { type: "add-meal"; meal: MealItem }
  | { type: "delete-meal"; id: string }
  | { type: "set-goal"; goal: FitnessGoal }
  | { type: "dismiss-warning" };

const DEFAULT_STATE: TrackerState = buildState([], "maintenance", false);

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
    return DEFAULT_STATE;
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

function buildMeal(
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

export function useMealTracker() {
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    initializeTrackerState,
  );

  useEffect(() => {
    saveSession({
      meals: state.meals,
      goal: state.goal,
    });
  }, [state.goal, state.meals]);

  return {
    state,
    addMealFromTemplate(
      template: FoodTemplate,
      grams: number,
      name: string,
      source: MealSource,
    ) {
      dispatch({
        type: "add-meal",
        meal: buildMeal(template, grams, name, source),
      });
    },
    deleteMeal(id: string) {
      dispatch({ type: "delete-meal", id });
    },
    setGoal(goal: FitnessGoal) {
      dispatch({ type: "set-goal", goal });
    },
    dismissWarning() {
      dispatch({ type: "dismiss-warning" });
    },
  };
}
