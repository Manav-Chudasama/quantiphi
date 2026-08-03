export interface Macros {
  calories: number
  protein: number
  carbs: number
  fats: number
}

export interface FoodTemplate extends Macros {
  id: string
  label: string
  baseGrams: number
}

export function scaleNutrition(template: FoodTemplate, grams: number): Macros {
  const factor = grams / template.baseGrams

  return {
    calories: round(template.calories * factor, 0),
    protein: round(template.protein * factor),
    carbs: round(template.carbs * factor),
    fats: round(template.fats * factor),
  }
}

export function sumMacros(entries: Array<Pick<Macros, 'calories' | 'protein' | 'carbs' | 'fats'>>): Macros {
  return entries.reduce<Macros>(
    (totals, entry) => ({
      calories: round(totals.calories + entry.calories, 0),
      protein: round(totals.protein + entry.protein),
      carbs: round(totals.carbs + entry.carbs),
      fats: round(totals.fats + entry.fats),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 },
  )
}

export function percentOf(current: number, target: number) {
  if (target <= 0) {
    return 0
  }

  return (current / target) * 100
}

function round(value: number, precision = 1) {
  const multiplier = 10 ** precision

  return Math.round(value * multiplier) / multiplier
}