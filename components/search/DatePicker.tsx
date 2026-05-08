import type { DatePickerProps } from "@/types/search"

export default function DatePicker({ label, value, onChange, className }: DatePickerProps) {
  return (
    <div className="relative">
      {label ? <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-slate-500">{label}</span> : null}
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-3xl border border-transparent bg-transparent px-0 py-3 text-sm text-blue-950 outline-none transition duration-300 focus:border-none focus:ring-0 ${className ?? ""}`}
      />
    </div>
  )
}
