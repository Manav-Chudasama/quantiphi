# Calorie Tracker & Macro Dashboard - Implementation Plan

## Goal

Build a health-tracking prototype with a React + Vite frontend and no backend server, storing all data in browser memory. The app must support food logging, live calorie and macro tracking, meal deletion, a simulated image-upload flow, and a fitness goal toggle that recalculates thresholds without clearing existing meals.

## Proposed Architecture

### Frontend

- React with Vite and TypeScript
- Tailwind CSS for layout and visual states
- Axios is not required for the no-backend version
- React Icons for trash, upload, and status indicators

### State Layer

- React state and reducers for meals, goal, and nutrition totals
- Optional `localStorage` persistence for session continuity
- Derived selectors for totals, progress percentages, and validation status

## Core Data Model

### Meal Item

- id
- name
- grams
- calories
- protein
- carbs
- fats
- source (`manual` or `image`)
- createdAt

### App State

- meals: array of meal items
- fitnessGoal: `weight-loss` | `maintenance` | `muscle-gain`
- baseTargets: calorie and macro targets derived from the selected goal
- totals: running aggregate calories, protein, carbs, fats
- validation: `within-budget` | `over-budget`

## State Responsibilities

### 1. Nutrition Scaling Engine

Create a reusable function that accepts a base food record and a gram amount, then scales calories, protein, carbs, and fats proportionally.

- Example: if the standard reference is 100g, and the user enters 200g, all nutrients should double.
- Keep this logic in a dedicated utility so both manual entry and image-upload mock data can reuse it.

### 2. Goal Threshold Engine

Map each fitness goal to different calorie and macro targets.

- Weight Loss: lowest calorie budget, tighter warning threshold
- Maintenance: balanced budget
- Muscle Gain: highest calorie budget, higher macro allowances

Changing the goal should update targets only, not delete meals or reset totals.

### 3. In-Memory Meal Store

Maintain meals and aggregate totals in browser memory.

- Add meal
- Delete meal by id
- Recompute totals after any change
- Recompute validation status after any change

### 4. Mock Image Upload Flow

For the placeholder image button:

- Trigger a predefined mock food payload in the frontend
- Auto-fill name, grams, and nutrition values
- Submit it through the same add-meal reducer path as manual entry

## Frontend Responsibilities

### 1. Main Layout

Build a single-page dashboard with:

- Fitness goal toggle at the top
- Large daily calorie progress bar
- Three smaller macro bars for protein, carbs, and fats
- Logging panel for food entry and mock image upload
- Daily history table/grid with delete controls
- Warning modal when budget is exceeded

### 2. Fitness Goal Toggle

Implement a three-option segmented control:

- Weight Loss
- Maintenance
- Muscle Gain

Behavior:

- On change, update the goal state locally
- Re-render target percentages immediately
- Preserve all logged meals
- Update warning threshold and progress colors instantly

### 3. Logging Panel

Provide two entry paths:

- Manual food entry: name text box + grams number input
- Image Upload placeholder button: loads mock data and submits automatically

Validation:

- Prevent empty names
- Require a positive gram amount for manual entry
- Disable submit while local state update is in progress, if needed

### 4. Dashboard Visualization

Daily calorie bar:

- Fill according to current calories divided by target calories
- Use calming green or blue while under budget
- Switch to crimson red immediately when over budget

Macro bars:

- Show current protein, carbs, and fats relative to their targets
- Update in real time after add/delete operations

### 5. Daily History Table

Each meal row should show:

- Food name
- Portion grams
- Calories
- Protein
- Carbs
- Fats
- Source
- Delete icon button

Deleting a meal should instantly refresh totals and all progress bars.

### 6. Warning Modal

When a newly added meal pushes totals over the target:

- Open a modal
- Show: `Daily Budget Exceeded!`
- Keep the modal dismissible, but retain the red status until the totals go back under budget

## Implementation Order

### Phase 1 - Project Setup

- Scaffold Vite React app
- Add Tailwind and React Icons
- Set up local app state architecture and reusable nutrition utilities

### Phase 2 - Frontend State and Data Model

- Define the in-memory store in React context, a reducer, or a custom hook
- Implement nutrition scaling utility
- Implement goal-target mapping
- Add meal CRUD actions
- Add goal update action
- Ensure every mutation recomputes totals and validation state

### Phase 3 - Frontend Shell

- Build dashboard layout
- Create goal toggle component
- Create calorie and macro meter components
- Create meal entry panel
- Create meal history table
- Create warning modal

### Phase 4 - Data Wiring

- Connect components to local state/actions
- Initialize from default state or `localStorage`
- Wire add meal, mock upload, delete meal, and goal change actions
- Reflect state changes immediately in UI

### Phase 5 - Visual States and UX

- Implement green/blue under-budget state
- Implement red over-budget state
- Animate bar transitions smoothly
- Ensure modal and table update without page refresh

### Phase 6 - Validation

- Test manual entry scaling
- Test mock upload path
- Test delete behavior
- Test goal switching without losing meals
- Test budget exceed warning behavior
- Test optional `localStorage` restore if persistence is included

## Acceptance Criteria

- Users can add meals manually by name and gram amount
- Users can add meals through the simulated image upload button
- The dashboard updates calories and macros in real time
- The calorie bar changes to red when the daily budget is exceeded
- A warning modal appears with the required message when over budget
- Meal deletion updates all totals immediately
- Switching fitness goals recalculates targets without clearing meals
- Everything runs entirely in browser memory with no database or backend server

## Suggested File Structure

- `src/` - React frontend source
- `src/state/` - in-memory store and reducers
- `src/utils/` - nutrition scaling and goal logic
- `client/src/components/` - dashboard UI components
- `client/src/api/` - no longer needed; replace with local action helpers if desired

## Risks and Notes

- In-memory storage means all data resets on page refresh unless `localStorage` is added
- Because this is a prototype, meal items should be designed to be deterministic and easy to mock
- Keep nutrition scaling centralized so manual and image-upload flows do not diverge
- If persistence is added, keep it optional and write through the same reducer path as live state updates
