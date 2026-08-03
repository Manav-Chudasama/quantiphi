import { getGoalPlan, type FitnessGoal } from '../lib/goals'

interface GoalToggleProps {
  goal: FitnessGoal
  onChange: (goal: FitnessGoal) => void
}

export function GoalToggle({ goal, onChange }: GoalToggleProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3 lg:w-[36rem]">
      {(['weight-loss', 'maintenance', 'muscle-gain'] as const).map((candidate) => {
        const plan = getGoalPlan(candidate)
        const active = goal === candidate

        return (
          <button
            key={candidate}
            type="button"
            onClick={() => onChange(candidate)}
            className={`rounded-2xl border px-4 py-3 text-left transition duration-200 ${active ? plan.chipClass : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'}`}
          >
            <div className="text-sm font-semibold">{plan.label}</div>
            <div className="mt-1 text-xs leading-5 opacity-80">{plan.description}</div>
          </button>
        )
      })}
    </div>
  )
}