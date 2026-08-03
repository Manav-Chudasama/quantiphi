import type { Macros } from './nutrition'

export type FitnessGoal = 'weight-loss' | 'maintenance' | 'muscle-gain'

export interface GoalPlan extends Macros {
  key: FitnessGoal
  label: string
  description: string
  barClass: string
  accentClass: string
  chipClass: string
}

export const GOAL_PLANS: Record<FitnessGoal, GoalPlan> = {
  'weight-loss': {
    key: 'weight-loss',
    label: 'Weight Loss',
    description: 'Tighter daily budget with a sharper overrun trigger.',
    calories: 1750,
    protein: 155,
    carbs: 150,
    fats: 55,
    barClass: 'from-emerald-400 via-teal-400 to-cyan-500',
    accentClass: 'bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-400/20',
    chipClass: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-50',
  },
  maintenance: {
    key: 'maintenance',
    label: 'Maintenance',
    description: 'Balanced intake that keeps the dashboard steady.',
    calories: 2250,
    protein: 165,
    carbs: 230,
    fats: 70,
    barClass: 'from-sky-400 via-cyan-400 to-blue-500',
    accentClass: 'bg-sky-500/15 text-sky-100 ring-1 ring-sky-400/20',
    chipClass: 'border-sky-400/40 bg-sky-500/10 text-sky-50',
  },
  'muscle-gain': {
    key: 'muscle-gain',
    label: 'Muscle Gain',
    description: 'Higher ceiling for a bulk-friendly calorie target.',
    calories: 2850,
    protein: 195,
    carbs: 300,
    fats: 85,
    barClass: 'from-orange-400 via-amber-400 to-rose-500',
    accentClass: 'bg-orange-500/15 text-orange-100 ring-1 ring-orange-400/20',
    chipClass: 'border-orange-400/40 bg-orange-500/10 text-orange-50',
  },
}

export function getGoalPlan(goal: FitnessGoal) {
  return GOAL_PLANS[goal]
}