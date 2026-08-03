import type { FitnessGoal } from './goals'
import type { Macros } from './nutrition'

export type MealSource = 'manual' | 'image'

export interface MealItem extends Macros {
  id: string
  name: string
  grams: number
  source: MealSource
  createdAt: number
  templateId: string
}

export interface DraftMeal {
  name: string
  grams: string
}

export interface AppSnapshot {
  meals: MealItem[]
  goal: FitnessGoal
}