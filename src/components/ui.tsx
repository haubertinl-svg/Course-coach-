import type { ReactNode } from 'react'
import Icon from './Icon'

/** Bandeau bien visible : toutes les valeurs de Phase 1 sont fictives. */
export function MockBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-ember-500/40 bg-ember-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ember-400 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-ember-500" />
      Données fictives
    </span>
  )
}

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <header className="flex items-end justify-between px-5 pb-4 pt-[calc(var(--safe-top)+18px)]">
      <div>
        {subtitle && <p className="label mb-1">{subtitle}</p>}
        <h1 className="font-display text-[28px] font-semibold leading-none tracking-tight">{title}</h1>
      </div>
      {right}
    </header>
  )
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-3 mt-7 flex items-center justify-between px-1">
      <h2 className="font-display text-[17px] font-semibold tracking-tight">{children}</h2>
      {right}
    </div>
  )
}

export function Stat({
  label,
  value,
  unit,
  accent = false,
}: {
  label: string
  value: string
  unit?: string
  accent?: boolean
}) {
  return (
    <div>
      <p className="label">{label}</p>
      <p className={`num mt-1 font-display text-[22px] font-semibold leading-none ${accent ? 'text-ember-400' : ''}`}>
        {value}
        {unit && <span className="ml-1 text-xs font-medium text-white/45">{unit}</span>}
      </p>
    </div>
  )
}

export function ProgressBar({ value, color = '#4df0b4' }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full transition-[width] duration-700"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }}
      />
    </div>
  )
}

export function Ring({
  value,
  size = 112,
  stroke = 10,
  children,
}: {
  value: number
  size?: number
  stroke?: number
  children?: ReactNode
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const off = c * (1 - Math.max(0, Math.min(100, value)) / 100)
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8ff5cf" />
            <stop offset="1" stopColor="#1fe0a0" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(.2,.8,.2,1)', filter: 'drop-shadow(0 0 8px rgba(77,240,180,.5))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <div className="glass flex items-start gap-3 p-4 text-sm text-white/60">
      <Icon name="lock" size={18} className="mt-0.5 shrink-0 text-white/40" />
      <div>{children}</div>
    </div>
  )
}
