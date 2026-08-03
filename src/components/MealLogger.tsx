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
    <article className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Logging Panel
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
            Add a meal
          </h2>
        </div>
        <button
          type="button"
          onClick={onMockUpload}
          className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          <FiCamera />
          Image Upload
        </button>
      </div>

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-900">Food name</span>
          <input
            value={draft.name}
            onChange={(event) =>
              onDraftChange({ ...draft, name: event.target.value })
            }
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            placeholder="e.g. Chicken wrap"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-900">
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
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            placeholder="250"
          />
        </label>

        <p className="text-xs leading-5 text-zinc-500">
          Manual entries use a standard baseline profile so the calories and
          macros scale directly with the grams you enter.
        </p>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Add meal
        </button>
      </form>
    </article>
  );
}
