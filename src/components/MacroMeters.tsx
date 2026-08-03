interface MacroMetersProps {
  protein: {
    current: number;
    target: number;
    fill: number;
  };
  carbs: {
    current: number;
    target: number;
    fill: number;
  };
  fats: {
    current: number;
    target: number;
    fill: number;
  };
}

export function MacroMeters({ protein, carbs, fats }: MacroMetersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[
        {
          label: "Protein",
          current: protein.current,
          target: protein.target,
          fill: protein.fill,
          tint: "bg-blue-500",
        },
        {
          label: "Carbs",
          current: carbs.current,
          target: carbs.target,
          fill: carbs.fill,
          tint: "bg-yellow-500",
        },
        {
          label: "Fats",
          current: fats.current,
          target: fats.target,
          fill: fats.fill,
          tint: "bg-zinc-900",
        },
      ].map((meter) => (
        <article
          key={meter.label}
          className="rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                {meter.label}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-zinc-950">
                {meter.current.toFixed(1)} g
              </h3>
            </div>
            <div className="text-right text-xs text-zinc-500">
              Target {meter.target.toFixed(0)} g
            </div>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${meter.tint}`}
              style={{ width: `${Math.max(meter.fill, 8)}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            {meter.fill.toFixed(1)}% of the current goal
          </p>
        </article>
      ))}
    </div>
  );
}
