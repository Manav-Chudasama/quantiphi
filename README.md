# Calorie Tracker & Macro Dashboard

A frontend-only health tracking prototype built with React, TypeScript, Vite, Tailwind CSS, and Bun.

The app runs entirely in browser memory, with optional `localStorage` persistence. It does not use a backend server.

## How To Run It

1. Install dependencies:

```bash
bun install
```

2. Start the website locally:

```bash
bun run dev
```

3. Open the local URL printed by Vite in your browser.

4. To verify the project before sharing it, run:

```bash
bun test
bun run build
```

## What The App Does

The dashboard tracks:

- Daily calorie budget
- Protein, carb, and fat progress
- Manual meal logging
- Mock image upload meal logging
- Meal deletion
- Fitness goal switching
- Over-budget warning modal
- Session persistence with `localStorage`

## Step-By-Step Walkthrough

### 1. Choose A Fitness Goal

At the top of the page, you will see three goal buttons:

- Weight Loss
- Maintenance
- Muscle Gain

What to test:

1. Click each goal one by one.
2. Watch the calorie target change immediately.
3. Notice that your logged meals stay on the screen.
4. Confirm the macro targets also update with the selected goal.

Expected result:

- The dashboard recalculates thresholds instantly.
- No meals are deleted when the goal changes.

### 2. Check The Daily Calorie Bar

The large progress bar at the top shows how much of your calorie budget has been used.

What to test:

1. Start with no meals logged.
2. Add a meal manually or with the mock upload button.
3. Watch the bar fill up in real time.
4. Keep adding meals until you go over the target.

Expected result:

- The bar stays calm green or blue while you are under budget.
- The bar turns crimson red when you exceed the target.
- The text beside it changes from remaining calories to over-budget calories.

### 3. Review The Macro Meters

Below the calorie bar are three smaller meters for protein, carbs, and fats.

What to test:

1. Add a meal manually.
2. Add another meal with the mock upload button.
3. Watch all three macro meters update after each addition.
4. Delete a meal and confirm the meters lower immediately.

Expected result:

- Each meter reflects the current total versus the current goal.
- The percentages update instantly after every change.

### 4. Add A Meal Manually

The logging panel on the right lets you enter a meal by hand.

What to test:

1. Type a food name in the text field.
2. Enter a gram amount in the number field.
3. Click Add meal.
4. Look for the meal to appear in the history list.

Expected result:

- The meal is added to the daily history.
- The calorie and macro totals update immediately.
- The dashboard uses the baseline nutrition profile and scales it by the grams you entered.

### 5. Use The Mock Image Upload Button

The Image Upload button simulates scanning a food photo.

What to test:

1. Click Image Upload.
2. Watch the app auto-fill a mock meal name and gram amount.
3. Confirm the meal is added instantly without manual typing.
4. Click it several times to see different preset food items cycle in.

Expected result:

- A predefined mock meal is added through the same logic as manual entry.
- The form fields update to show the selected mock meal values.
- The totals change immediately.

### 6. Check The Daily History List

The meal history panel shows every meal logged for the day.

Each row contains:

- Meal name
- Portion weight in grams
- Calories
- Protein
- Carbs
- Fats
- Source label
- Delete button

What to test:

1. Add a few meals.
2. Confirm each one appears as a separate row.
3. Compare the source label between manual and mock-upload meals.

Expected result:

- Every active meal is listed in order.
- The source label tells you whether it came from manual entry or the mock scanner.

### 7. Delete A Meal

Each meal row has a trash icon button.

What to test:

1. Add at least two meals.
2. Click the trash icon on one meal.
3. Watch the row disappear.
4. Confirm the calorie and macro meters lower immediately.

Expected result:

- Deleting a meal instantly updates the dashboard totals.
- If you were over budget, deleting enough meals can bring the app back under budget.

### 8. Trigger The Warning Modal

When your total calories go above the current goal, a warning modal appears.

What to test:

1. Choose the Weight Loss goal.
2. Add meals until the calorie bar turns red.
3. Confirm the modal appears with the message Daily Budget Exceeded!
4. Dismiss the modal.
5. Leave the meals in place and confirm the dashboard still shows the over-budget state.

Expected result:

- The modal appears only when you cross the calorie limit.
- Dismissing the modal does not clear the meals.
- The red state stays visible until your totals drop back under the target.

### 9. Refresh The Page

The app stores the current meals and goal in browser memory with optional `localStorage` restore.

What to test:

1. Log a few meals.
2. Refresh the page.
3. Check whether the state comes back after reload.

Expected result:

- Your current session is restored from `localStorage`.
- If you clear site data, the app returns to the default empty state.

## Quick Demo Script

If you want to show the website quickly, follow this sequence:

1. Start on Maintenance.
2. Add one manual meal.
3. Add one mock-upload meal.
4. Switch to Weight Loss and show the budget tightening.
5. Add enough meals to trigger the red warning state.
6. Delete one meal and show the totals drop.
7. Switch to Muscle Gain and show the threshold increase without losing meals.

## Validation Checklist

- Goal switching updates targets without clearing meals
- Manual meal entry updates calorie and macro totals
- Mock image upload adds a predefined meal
- Delete button removes a meal and lowers totals
- Daily calorie bar changes color when over budget
- Warning modal appears when the calorie target is exceeded
- Refresh restores session state when `localStorage` is available

## Project Commands

```bash
bun run dev
bun test
bun run build
```
