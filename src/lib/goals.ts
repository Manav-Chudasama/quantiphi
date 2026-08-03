import type { Macros } from "./nutrition";

export type FitnessGoal = "weight-loss" | "maintenance" | "muscle-gain";

export interface GoalPlan extends Macros {
  key: FitnessGoal;
  label: string;
  description: string;
  barClass: string;
  accentClass: string;
  chipClass: string;
}

export const GOAL_PLANS: Record<FitnessGoal, GoalPlan> = {
  "weight-loss": {
    key: "weight-loss",
    label: "Weight Loss",
    description: "Tighter daily budget with a sharper overrun trigger.",
    calories: 1750,
    protein: 155,
    carbs: 150,
    fats: 55,
    barClass: "bg-green-500",
    accentClass: "bg-green-50 text-green-700 ring-1 ring-green-200",
    chipClass: "border-green-400 bg-green-50 text-green-700",
  },
  maintenance: {
    key: "maintenance",
    label: "Maintenance",
    description: "Balanced intake that keeps the dashboard steady.",
    calories: 2250,
    protein: 165,
    carbs: 230,
    fats: 70,
    barClass: "bg-blue-500",
    accentClass: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    chipClass: "border-blue-400 bg-blue-50 text-blue-700",
  },
  "muscle-gain": {
    key: "muscle-gain",
    label: "Muscle Gain",
    description: "Higher ceiling for a bulk-friendly calorie target.",
    calories: 2850,
    protein: 195,
    carbs: 300,
    fats: 85,
    barClass: "bg-yellow-500",
    accentClass: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
    chipClass: "border-yellow-400 bg-yellow-50 text-yellow-700",
  },
};

export function getGoalPlan(goal: FitnessGoal) {
  return GOAL_PLANS[goal];
}
