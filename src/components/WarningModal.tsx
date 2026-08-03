import { FiAlertTriangle } from "react-icons/fi";

interface WarningModalProps {
  open: boolean;
  onDismiss: () => void;
}

export function WarningModal({ open, onDismiss }: WarningModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4">
      <div className="w-full max-w-md rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-red-50 p-3 text-red-600 ring-1 ring-red-100">
            <FiAlertTriangle size={22} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-zinc-950">
              Daily Budget Exceeded!
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              The current meal list is above the selected goal threshold. Delete
              an item or switch to a higher budget to calm the dashboard back
              down.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Dismiss warning
        </button>
      </div>
    </div>
  );
}
