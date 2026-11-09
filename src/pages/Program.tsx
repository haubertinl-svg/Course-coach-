import { useState } from 'react'
import Icon from '../components/Icon'
import { MockBadge, PageHeader } from '../components/ui'
import { sessions, TYPE_COLOR, TYPE_LABEL } from '../data/mock'
import type { SessionStatus, TrainingSession } from '../types'
import {
  DAYS_LETTER,
  DAYS_SHORT,
  addDays,
  fmtDateLong,
  fmtDateShort,
  fmtMonthYear,
  fromISO,
  isSameDay,
  startOfDay,
  startOfWeek,
  toISO,
} from '../lib/date'
import { fmtKm } from '../lib/format'

const STATUS_LABEL: Record<SessionStatus, string> = {
  planned: 'Prévue',
  done: 'Réalisée',
  postponed: 'Reportée',
  cancelled: 'Annulée',
}
const STATUS_STYLE: Record<SessionStatus, string> = {
  planned: 'text-white/70 border-white/15',
  done: 'text-mint-400 border-mint-400/40',
  postponed: 'text-ember-400 border-ember-400/40',
  cancelled: 'text-red-300 border-red-300/30',
}

export default function Program() {
  const today = startOfDay(new Date())
  const [mode, setMode] = useState<'week' | 'month'>('week')
  const [offset, setOffset] = useState(0) // semaines (vue semaine) ou mois (vue mois)
  const [openId, setOpenId] = useState<string | null>(null)

  const ws = addDays(startOfWeek(today), offset * 7)
  const monthRef = new Date(today.getFullYear(), today.getMonth() + offset, 1)

  const sessionsOn = (d: Date) => sessions.filter((s) => isSameDay(fromISO(s.date), d))

  const title = mode === 'week' ? `${fmtDateShort(ws)} – ${fmtDateShort(addDays(ws, 6))}` : fmtMonthYear(monthRef)

  return (
    <div className="px-4">
      <PageHeader title="Programme" subtitle="Calendrier" right={<MockBadge />} />

      {/* Sélecteur de vue */}
      <div className="glass flex p-1">
        {(['week', 'month'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m)
              setOffset(0)
            }}
            className={`flex-1 rounded-[20px] py-2.5 text-sm font-medium transition ${
              mode === m ? 'bg-mint-400 text-ink-950 shadow-glow' : 'text-white/55'
            }`}
          >
            {m === 'week' ? 'Semaine' : 'Mois'}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-4 flex items-center justify-between px-1">
        <button type="button" className="btn-ghost !px-3" onClick={() => setOffset(offset - 1)} aria-label="Précédent">
          <Icon name="chevronL" size={18} />
        </button>
        <button type="button" className="text-center" onClick={() => setOffset(0)}>
          <p className="font-display text-base font-semibold">{title}</p>
          {offset !== 0 && <p className="text-[11px] text-mint-400">Revenir à aujourd’hui</p>}
        </button>
        <button type="button" className="btn-ghost !px-3" onClick={() => setOffset(offset + 1)} aria-label="Suivant">
          <Icon name="chevronR" size={18} />
        </button>
      </div>

      {mode === 'week' ? (
        <div className="stagger mt-4 space-y-3" key={`w${offset}`}>
          {Array.from({ length: 7 }, (_, i) => {
            const d = addDays(ws, i)
            const list = sessionsOn(d)
            const isToday = isSameDay(d, today)
            return (
              <div key={i}>
                <p className={`mb-1.5 px-1 text-xs font-medium ${isToday ? 'text-mint-400' : 'text-white/40'}`}>
                  {DAYS_SHORT[i]} {d.getDate()}
                  {isToday ? ' · Aujourd’hui' : ''}
                </p>
                {list.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 px-4 py-2.5 text-xs text-white/30">
                    Repos
                  </div>
                ) : (
                  list.map((s) => (
                    <SessionCard
                      key={s.id}
                      s={s}
                      open={openId === s.id}
                      onToggle={() => setOpenId(openId === s.id ? null : s.id)}
                    />
                  ))
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <MonthGrid
          monthRef={monthRef}
          today={today}
          sessionsOn={sessionsOn}
          onPick={(s) => {
            setMode('week')
            setOffset(Math.round((startOfWeek(fromISO(s.date)).getTime() - startOfWeek(today).getTime()) / (7 * 86400000)))
            setOpenId(s.id)
          }}
        />
      )}

      <p className="mt-6 px-2 text-center text-[11px] leading-relaxed text-white/35">
        Planning d’exemple. La génération du programme, la configuration des 4 séances, le report/annulation et
        l’historique des adaptations arrivent en Phase 3 : les statuts ci-dessus sont fictifs et non modifiables.
      </p>
    </div>
  )
}

function SessionCard({ s, open, onToggle }: { s: TrainingSession; open: boolean; onToggle: () => void }) {
  const color = TYPE_COLOR[s.type]
  return (
    <div className="glass overflow-hidden">
      <button type="button" onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left">
        <span className="h-11 w-1.5 shrink-0 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}88` }} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-medium uppercase tracking-wider" style={{ color }}>
            {TYPE_LABEL[s.type]}
          </p>
          <p className="truncate font-display text-[15px] font-semibold">{s.title}</p>
          <p className="num mt-0.5 text-xs text-white/50">
            {s.durationMin} min · {fmtKm(s.distanceKm)} km · {s.hrZone}
          </p>
        </div>
        <span className={`chip shrink-0 ${STATUS_STYLE[s.status]}`}>{STATUS_LABEL[s.status]}</span>
        <Icon name="chevronD" size={18} className={`shrink-0 text-white/30 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="space-y-3 border-t border-white/10 px-4 pb-4 pt-3 text-sm">
          <p className="text-xs text-white/40">{fmtDateLong(fromISO(s.date))}</p>
          <p className="text-white/75">
            <span className="label mr-2">Objectif</span>
            {s.objective}
          </p>
          <p className="text-white/75">
            <span className="label mr-2">Allure cible</span>
            {s.targetPace}
          </p>
          <Block title="Échauffement" text={s.warmup} />
          <Block title="Corps de séance" text={s.main} accent />
          <Block title="Retour au calme" text={s.cooldown} />
        </div>
      )}
    </div>
  )
}

function Block({ title, text, accent = false }: { title: string; text: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-3 ${accent ? 'border-mint-400/30 bg-mint-400/[0.07]' : 'border-white/10 bg-white/[0.03]'}`}>
      <p className="label mb-1">{title}</p>
      <p className="leading-relaxed text-white/80">{text}</p>
    </div>
  )
}

function MonthGrid({
  monthRef,
  today,
  sessionsOn,
  onPick,
}: {
  monthRef: Date
  today: Date
  sessionsOn: (d: Date) => TrainingSession[]
  onPick: (s: TrainingSession) => void
}) {
  const first = startOfWeek(monthRef)
  const cells = Array.from({ length: 42 }, (_, i) => addDays(first, i))
  const rows = cells[35].getMonth() === monthRef.getMonth() ? 6 : 5
  return (
    <div className="glass mt-4 p-3" key={toISO(monthRef)}>
      <div className="mb-1 grid grid-cols-7 text-center text-[10px] font-medium text-white/40">
        {DAYS_LETTER.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.slice(0, rows * 7).map((d) => {
          const inMonth = d.getMonth() === monthRef.getMonth()
          const list = sessionsOn(d)
          const isToday = isSameDay(d, today)
          const s = list[0]
          return (
            <button
              key={toISO(d)}
              type="button"
              disabled={!s}
              onClick={() => s && onPick(s)}
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl text-xs transition ${
                inMonth ? 'text-white/80' : 'text-white/20'
              } ${isToday ? 'bg-mint-400/15 ring-1 ring-mint-400/50' : ''}`}
            >
              <span className="num">{d.getDate()}</span>
              <span className="flex h-1.5 gap-0.5">
                {list.map((x) => (
                  <span
                    key={x.id}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: TYPE_COLOR[x.type], opacity: x.status === 'cancelled' ? 0.3 : 1 }}
                  />
                ))}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
