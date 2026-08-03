interface MacroMetersProps {
  protein: {
    current: number
    target: number
    fill: number
  }
  carbs: {
    current: number
    target: number
    fill: number
  }
  fats: {
    current: number
    target: number
    fill: number
  }
}

export function MacroMeters({ protein, carbs, fats }: MacroMetersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[
        { label: 'Protein', current: protein.current, target: protein.target, fill: protein.fill, tint: 'from-emerald-400 to-green-500' },
        { label: 'Carbs', current: carbs.current, target: carbs.target, fill: carbs.fill, tint: 'from-sky-400 to-blue-500' },
        { label: 'Fats', current: fats.current, target: fats.target, fill: fats.fill, tint: 'from-amber-400 to-orange-500' },
      ].map((meter) => (
        <article key={meter.label} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{meter.label}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{meter.current.toFixed(1)} g</h3>
            </div>
            <div className="text-right text-xs text-slate-400">Target {meter.target.toFixed(0)} g</div>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-900 ring-1 ring-white/10">
            <div className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${meter.tint}`} style={{ width: `${Math.max(meter.fill, 8)}%` }} />
          </div>
          <p className="mt-3 text-xs text-slate-400">{meter.fill.toFixed(1)}% of the current goal</p>
        </article>
      ))}
    </div>
  )
}