import { expect, test } from "bun:test";
import { CUSTOM_ENTRY_PROFILE } from "./mockFoods";
import { percentOf, scaleNutrition, sumMacros } from "./nutrition";

test("scaleNutrition scales macros relative to the base gram amount", () => {
  const scaled = scaleNutrition(CUSTOM_ENTRY_PROFILE, 200);

  expect(scaled.calories).toBe(370);
  expect(scaled.protein).toBe(22);
  expect(scaled.carbs).toBe(40);
  expect(scaled.fats).toBe(14);
});

test("sumMacros adds multiple macro rows together", () => {
  const totals = sumMacros([
    { calories: 150, protein: 10, carbs: 12, fats: 5 },
    { calories: 250, protein: 20, carbs: 30, fats: 10 },
  ]);

  expect(totals).toEqual({ calories: 400, protein: 30, carbs: 42, fats: 15 });
});

test("percentOf returns zero for empty targets and percentages otherwise", () => {
  expect(percentOf(50, 0)).toBe(0);
  expect(percentOf(50, 200)).toBe(25);
});
