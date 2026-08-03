import { FiAlertTriangle } from 'react-icons/fi'

interface WarningModalProps {
  open: boolean
  onDismiss: () => void
}

export function WarningModal({ open, onDismiss }: WarningModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] border border-rose-400/30 bg-slate-950 p-6 shadow-2xl shadow-black/50">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-rose-500/15 p-3 text-rose-200 ring-1 ring-rose-400/20">
            <FiAlertTriangle size={22} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-white">Daily Budget Exceeded!</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">The current meal list is above the selected goal threshold. Delete an item or switch to a higher budget to calm the dashboard back down.</p>
          </div>
        </div>

        <button type="button" onClick={onDismiss} className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110">
          Dismiss warning
        </button>
      </div>
    </div>
  )
}