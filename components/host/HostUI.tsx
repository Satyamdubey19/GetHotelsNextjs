import type {
  HostEmptyStateProps,
  HostPageProps,
  HostPillProps,
  HostSectionProps,
  HostStatCardProps,
} from "@/types/host-ui"

export function HostPage({ children, title, eyebrow, description, actions }: HostPageProps) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      {(title || eyebrow || description || actions) && (
        <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">{eyebrow}</p>}
            {title && <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>}
            {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

export function HostSection({
  children,
  title,
  eyebrow,
  description,
  actions,
  className = "",
}: HostSectionProps) {
  return (
    <section className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
      {(title || eyebrow || description || actions) && (
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">{eyebrow}</p>}
            {title && <h2 className="mt-1 text-lg font-bold text-slate-950">{title}</h2>}
            {description && <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

export function HostStatCard({
  label,
  value,
  hint,
  icon,
  tone = "cyan",
}: HostStatCardProps) {
  const tones = {
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    violet: "bg-violet-50 text-violet-700 border-violet-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${tones[tone]}`}>
          {icon}
        </div>
        {hint && <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500">{hint}</span>}
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
    </div>
  )
}

export function HostEmptyState({ icon, title, description }: HostEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
        {icon}
      </div>
      <p className="font-bold text-slate-950">{title}</p>
      <p className="max-w-md text-sm leading-6 text-slate-500">{description}</p>
    </div>
  )
}

export function HostPill({
  children,
  tone = "slate",
}: HostPillProps) {
  const tones = {
    cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
    slate: "border-slate-200 bg-slate-50 text-slate-700",
  }

  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${tones[tone]}`}>{children}</span>
}
