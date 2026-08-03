import type { Dispatch, FormEvent, SetStateAction } from "react";
import { FiCamera } from "react-icons/fi";
import type { DraftMeal } from "../lib/types";

interface MealLoggerProps {
  draft: DraftMeal;
  onDraftChange: Dispatch<SetStateAction<DraftMeal>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onMockUpload: () => void;
}

export function MealLogger({
  draft,
  onDraftChange,
  onSubmit,
  onMockUpload,
}: MealLoggerProps) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Logging Panel
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Add a meal</h2>
        </div>
        <button
          type="button"
          onClick={onMockUpload}
          className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
        >
          <FiCamera />
          Image Upload
        </button>
      </div>

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">Food name</span>
          <input
            value={draft.name}
            onChange={(event) =>
              onDraftChange({ ...draft, name: event.target.value })
            }
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
            placeholder="e.g. Chicken wrap"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-200">
            Portion weight (grams)
          </span>
          <input
            type="number"
            min="1"
            step="1"
            value={draft.grams}
            onChange={(event) =>
              onDraftChange({ ...draft, grams: event.target.value })
            }
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
            placeholder="250"
          />
        </label>

        <p className="text-xs leading-5 text-slate-400">
          Manual entries use a standard baseline profile so the calories and
          macros scale directly with the grams you enter.
        </p>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
        >
          Add meal
        </button>
      </form>
    </article>
  );
}
