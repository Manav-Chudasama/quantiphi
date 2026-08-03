import type { FoodTemplate } from './nutrition'

export interface MockFoodPreset extends FoodTemplate {
  suggestedGrams: number
}

export const CUSTOM_ENTRY_PROFILE: FoodTemplate = {
  id: 'manual-baseline',
  label: 'Manual entry baseline',
  baseGrams: 100,
  calories: 185,
  protein: 11,
  carbs: 20,
  fats: 7,
}

export const MOCK_SCAN_FOODS: MockFoodPreset[] = [
  {
    id: 'salmon-rice-bowl',
    label: 'Salmon Rice Bowl',
    baseGrams: 100,
    calories: 192,
    protein: 13.5,
    carbs: 17,
    fats: 7.2,
    suggestedGrams: 320,
  },
  {
    id: 'yogurt-parfait',
    label: 'Greek Yogurt Parfait',
    baseGrams: 100,
    calories: 142,
    protein: 9.8,
    carbs: 15,
    fats: 3.4,
    suggestedGrams: 250,
  },
  {
    id: 'chicken-burrito-bowl',
    label: 'Chicken Burrito Bowl',
    baseGrams: 100,
    calories: 168,
    protein: 12.9,
    carbs: 14.5,
    fats: 5.9,
    suggestedGrams: 360,
  },
  {
    id: 'avocado-toast',
    label: 'Avocado Toast',
    baseGrams: 100,
    calories: 214,
    protein: 6.5,
    carbs: 22,
    fats: 11.8,
    suggestedGrams: 180,
  },
]