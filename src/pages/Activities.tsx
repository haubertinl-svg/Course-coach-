import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { MockBadge, PageHeader, SectionTitle } from '../components/ui'
import { activities, TYPE_COLOR, TYPE_LABEL } from '../data/mock'
import { fmtDateShort, fromISO } from '../lib/date'
import { DASH, fmtDuration, fmtInt, fmtKm, fmtPace } from '../lib/format'

export default function Activities() {
  const [compareMode, setCompareMode] = useState(false)
  const [picked, setPicked] = useState<string[]>([])

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 2 ? [p[1], id] : [...p, id]))

  const [a, b] = picked.map((id) => activities.find((x) => x.id === id))

  return (
    <div className="px-4">
      <PageHeader
        title="Activités"
        subtitle={`${activities.length} sorties`}
        right={<MockBadge />}
      />

      <button
        type="button"
        onClick={() => {
          setCompareMode(!compareMode)
          setPicked([])
        }}
        className={`btn-ghost w-full ${compareMode ? '!border-mint-400/50 !text-mint-400' : ''}`}
      >
        <Icon name="compare" size={18} />
        {compareMode ? 'Quitter la comparaison' : 'Comparer deux séances'}
      </button>

      {compareMode && (
        <p className="mt-2 px-1 text-xs text-white/45">Sélectionne deux activités ({picked.length}/2).</p>
      )}

      {compareMode && a && b && (
        <>
          <SectionTitle>Comparaison</SectionTitle>
          <div className="glass overflow-hidden p-4 text-sm">
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 pb-2 text-[11px] text-white/45">
              <span />
              <span className="truncate text-right">{fmtDateShort(fromISO(a.date))}</span>
              <span className="truncate text-right">{fmtDateShort(fromISO(b.date))}</span>
            </div>
            {[
              ['Distance', `${fmtKm(a.distanceKm)} km`, `${fmtKm(b.distanceKm)} km`],
              ['Durée', fmtDuration(a.durationSec), fmtDuration(b.durationSec)],
              ['Allure moy.', fmtPace(a.avgPaceSec), fmtPace(b.avgPaceSec)],
              ['FC moy.', fmtInt(a.avgHr, ' bpm'), fmtInt(b.avgHr, ' bpm')],
              ['D+', fmtInt(a.elevationGain, ' m'), fmtInt(b.elevationGain, ' m')],
            ].map(([k, x, y]) => (
              <div key={k} className="num grid grid-cols-[1fr_1fr_1fr] gap-2 border-t border-white/10 py-2.5">
                <span className="text-white/50">{k}</span>
                <span className="text-right font-medium">{x}</span>
                <span className="text-right font-medium">{y}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="stagger mt-4 space-y-3">
        {activities.map((act) => {
          const selected = picked.includes(act.id)
          const inner = (
            <>
              <span
                className="h-12 w-1.5 shrink-0 rounded-full"
                style={{ background: TYPE_COLOR[act.type], boxShadow: `0 0 12px ${TYPE_COLOR[act.type]}88` }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-white/45">
                  {fmtDateShort(fromISO(act.date))} · {TYPE_LABEL[act.type]}
                </p>
                <p className="truncate font-display text-[15px] font-semibold">{act.title}</p>
                <p className="num mt-0.5 text-xs text-white/55">
                  {fmtKm(act.distanceKm)} km · {fmtDuration(act.durationSec)} · {fmtPace(act.avgPaceSec)} /km ·{' '}
                  {act.avgHr != null ? `${act.avgHr} bpm` : DASH}
                </p>
              </div>
              {compareMode ? (
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                    selected ? 'border-mint-400 bg-mint-400 text-ink-950' : 'border-white/20'
                  }`}
                >
                  {selected && <Icon name="check" size={14} strokeWidth={3} />}
                </span>
              ) : (
                <Icon name="chevronR" className="text-white/30" />
              )}
            </>
          )
          return compareMode ? (
            <button key={act.id} type="button" onClick={() => toggle(act.id)} className="glass flex w-full items-center gap-3 p-4 text-left">
              {inner}
            </button>
          ) : (
            <Link key={act.id} to={`/activites/${act.id}`} className="glass flex items-center gap-3 p-4">
              {inner}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
