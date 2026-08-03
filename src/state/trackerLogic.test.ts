import { expect, test } from 'bun:test'
import { CUSTOM_ENTRY_PROFILE, MOCK_SCAN_FOODS } from '../lib/mockFoods'
import { buildTrackerState, createMealItem, applyTrackerAction } from './trackerLogic'

test('adding a meal preserves existing meals and updates totals', () => {
  const firstMeal = createMealItem(CUSTOM_ENTRY_PROFILE, 100, 'First meal', 'manual')
  const baseState = buildTrackerState([firstMeal], 'maintenance', false)
  const secondMeal = createMealItem(CUSTOM_ENTRY_PROFILE, 200, 'Second meal', 'manual')

  const nextState = applyTrackerAction(baseState, { type: 'add-meal', meal: secondMeal })

  expect(nextState.meals).toHaveLength(2)
  expect(nextState.totals.calories).toBe(firstMeal.calories + secondMeal.calories)
})

test('goal switching keeps meals and recalculates budget thresholds', () => {
  const meal = createMealItem(MOCK_SCAN_FOODS[0], MOCK_SCAN_FOODS[0].suggestedGrams, MOCK_SCAN_FOODS[0].label, 'image')
  const baseState = buildTrackerState([meal], 'weight-loss', false)

  const nextState = applyTrackerAction(baseState, { type: 'set-goal', goal: 'muscle-gain' })

  expect(nextState.meals).toHaveLength(1)
  expect(nextState.goal).toBe('muscle-gain')
  expect(nextState.targets.calories).toBeGreaterThan(baseState.targets.calories)
  expect(nextState.validation).toBe('within-budget')
})

test('over-budget additions trigger the warning state and delete actions lower totals', () => {
  const meal = createMealItem(CUSTOM_ENTRY_PROFILE, 1000, 'Overload bowl', 'manual')
  const startingState = buildTrackerState([], 'weight-loss', false)
  const overState = applyTrackerAction(startingState, { type: 'add-meal', meal })

  expect(overState.validation).toBe('over-budget')
  expect(overState.warningOpen).toBe(true)

  const clearedState = applyTrackerAction(overState, { type: 'delete-meal', id: meal.id })

  expect(clearedState.meals).toHaveLength(0)
  expect(clearedState.validation).toBe('within-budget')
  expect(clearedState.warningOpen).toBe(false)
})