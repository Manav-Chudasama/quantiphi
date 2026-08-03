import type { FitnessGoal } from './goals'
import type { MealItem } from './types'

export interface StoredSession {
  meals: MealItem[]
  goal: FitnessGoal
}

const STORAGE_KEY = 'quantiphi-calorie-tracker-session'

export function loadSession(): StoredSession | null {
  if (typeof window === 'undefined') {
    return null
  }

  const rawSession = window.localStorage.getItem(STORAGE_KEY)

  if (!rawSession) {
    return null
  }

  try {
    return JSON.parse(rawSession) as StoredSession
  } catch {
    return null
  }
}

export function saveSession(session: StoredSession) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}