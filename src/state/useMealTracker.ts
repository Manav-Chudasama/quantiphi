import { useEffect, useReducer } from "react";
import { type FitnessGoal } from "../lib/goals";
import { loadSession, saveSession } from "../lib/storage";
import {
  buildTrackerState,
  createDefaultTrackerState,
  applyTrackerAction,
  createMealItem,
} from "./trackerLogic";
import type { FoodTemplate } from "../lib/nutrition";
import type { MealSource } from "../lib/types";

function initializeTrackerState() {
  const storedSession = loadSession();

  if (!storedSession) {
    return createDefaultTrackerState();
  }

  return buildTrackerState(storedSession.meals, storedSession.goal, false);
}

export function useMealTracker() {
  const [state, dispatch] = useReducer(
    applyTrackerAction,
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
        meal: createMealItem(template, grams, name, source),
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
