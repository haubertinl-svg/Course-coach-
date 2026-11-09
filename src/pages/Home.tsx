import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { MockBadge, ProgressBar, Ring, SectionTitle, Stat } from '../components/ui'
import { activities, goals, recommendations, recovery, sessions, TYPE_COLOR, TYPE_LABEL } from '../data/mock'
import { DAYS_LETTER, addDays, fmtDateLong, fmtDateShort, fromISO, isSameDay, startOfDay, startOfWeek, toISO } from '../lib/date'
import { fmtDuration, fmtKm, fmtPace } from '../lib/format'

export default function Home() {
  const [importOpen, setImportOpen] = useState(false)
  const today = startOfDay(new Date())
  const ws = startOfWeek(today)
  const we = addDays(ws, 6)

  const weekActs = activities.filter((a) => {
    const d = fromISO(a.date)
    return d >= ws && d <= we
  })
  const weekKm = weekActs.reduce((s, a) => s + a.distanceKm, 0)
  const weekSec = weekActs.reduce((s, a) => s + a.durationSec, 0)
  const weekSessions = sessions.filter((s) => {
    const d = fromISO(s.date)
    return d >= ws && d <= we
  })
  const done = weekSessions.filter((s) => s.status === 'done').length

  const next = sessions.find((s) => s.status === 'planned' && fromISO(s.date) >= today)
  const last = activities[0]
  const main = goals.find((g) => g.rank === 'principal')
  const secondary = goals.filter((g) => g.rank === 'secondaire' && g.status === 'active')

  return (
    <div className="stagger px-4">
      <header className="flex items-start justify-between px-1 pb-5 pt-[calc(var(--safe-top)+18px)]">
        <div>
          <p className="label mb-1">{fmtDateLong(today)}</p>
          <h1 className="font-display text-[28px] font-semibold leading-none tracking-tight">
            Course <span className="text-mint-400">Coach</span>
          </h1>
          <p className="mt-1.5 text-xs text-white/45">Your Personal AI Running Coach</p>
        </div>
        <MockBadge />
      </header>

      {/* Forme + objectif principal */}
      <section className="glass flex items-center gap-5 p-5">
        <Ring value={recovery.readiness} size={112}>
          <span className="num font-display text-[30px] font-semibold leading-none">{recovery.readiness}</span>
          <span className="mt-1 text-[10px] uppercase tracking-widest text-white/45">Forme</span>
        </Ring>
        <div className="min-w-0 flex-1">
          <p className="label">Objectif principal</p>
          <p className="mt-1 font-display text-[17px] font-semibold leading-snug">{main?.title ?? 'À définir'}</p>
          {main && (
            <>
              <p className="mt-1 text-xs text-white/50">
                {main.targetTime ? `Chrono cible ${main.targetTime}` : 'Pas de chrono cible'}
                {main.deadline ? ` · ${fmtDateShort(fromISO(main.deadline))}` : ''}
              </p>
              <div className="mt-3">
                <ProgressBar value={main.progress} />
                <p className="num mt-1.5 text-[11px] text-white/45">{main.progress} % de progression</p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA import */}
      <button
        type="button"
        onClick={() => setImportOpen(true)}
        className="btn-mint mt-4 w-full animate-pulseGlow"
      >
        <Icon name="upload" size={20} strokeWidth={2.2} />
        IMPORTER MA COURSE
      </button>

      {/* Stats de la semaine */}
      <SectionTitle right={<span className="chip">Cette semaine</span>}>Volume</SectionTitle>
      <section className="glass grid grid-cols-3 gap-4 p-5">
        <Stat label="Distance" value={fmtKm(weekKm)} unit="km" accent />
        <Stat label="Durée" value={fmtDuration(weekSec)} />
        <Stat label="Séances" value={`${done}/${weekSessions.length || 4}`} />
      </section>

      {/* Calendrier de la semaine */}
      <section className="glass mt-3 p-4">
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS_LETTER.map((l, i) => {
            const d = addDays(ws, i)
            const s = weekSessions.find((x) => isSameDay(fromISO(x.date), d))
            const isToday = isSameDay(d, today)
            return (
              <div
                key={i}
                className={`flex flex-col items-center gap-1.5 rounded-2xl py-2.5 ${
                  isToday ? 'bg-mint-400/15 ring-1 ring-mint-400/50' : ''
                }`}
              >
                <span className="text-[10px] font-medium text-white/45">{l}</span>
                <span className="num text-sm font-semibold">{d.getDate()}</span>
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full"
                  style={{
                    background: s ? `${TYPE_COLOR[s.type]}26` : 'transparent',
                    border: s ? `1px solid ${TYPE_COLOR[s.type]}88` : '1px dashed rgba(255,255,255,.12)',
                  }}
                >
                  {s?.status === 'done' && <Icon name="check" size={11} strokeWidth={3} className="text-mint-400" />}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Prochaine séance */}
      {next && (
        <>
          <SectionTitle right={<Link to="/programme" className="text-xs text-mint-400">Programme</Link>}>
            Prochaine séance
          </SectionTitle>
          <Link to="/programme" className="glass block p-5">
            <div className="flex items-start justify-between">
              <div>
                <span
                  className="chip"
                  style={{ color: TYPE_COLOR[next.type], borderColor: `${TYPE_COLOR[next.type]}55` }}
                >
                  {TYPE_LABEL[next.type]}
                </span>
                <p className="mt-2.5 font-display text-lg font-semibold">{next.title}</p>
                <p className="mt-0.5 text-xs text-white/50">{fmtDateLong(fromISO(next.date))}</p>
              </div>
              <Icon name="chevronR" className="mt-1 text-white/30" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
              <Stat label="Durée" value={`${next.durationMin}`} unit="min" />
              <Stat label="Distance" value={fmtKm(next.distanceKm)} unit="km" />
              <Stat label="Zone FC" value={next.hrZone} />
            </div>
          </Link>
        </>
      )}

      {/* Dernière activité */}
      {last && (
        <>
          <SectionTitle right={<Link to="/activites" className="text-xs text-mint-400">Tout voir</Link>}>
            Dernière activité
          </SectionTitle>
          <Link to={`/activites/${last.id}`} className="glass flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mint-400/15 text-mint-400">
              <Icon name="route" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[15px] font-semibold">{last.title}</p>
              <p className="num mt-0.5 text-xs text-white/50">
                {fmtDateShort(fromISO(last.date))} · {fmtKm(last.distanceKm)} km · {fmtPace(last.avgPaceSec)} /km
              </p>
            </div>
            <Icon name="chevronR" className="text-white/30" />
          </Link>
        </>
      )}

      {/* Récupération */}
      <SectionTitle>Récupération</SectionTitle>
      <section className="glass grid grid-cols-3 gap-4 p-5">
        <Stat label="Fraîcheur" value={recovery.freshness} />
        <Stat label="Charge 7j/28j" value={recovery.loadRatio.toFixed(2).replace('.', ',')} accent />
        <Stat label="Dern. intensité" value={`J-${recovery.daysSinceHard}`} />
      </section>

      {/* Objectifs secondaires */}
      <SectionTitle>Objectifs secondaires</SectionTitle>
      <section className="glass space-y-4 p-5">
        {secondary.map((g) => (
          <div key={g.id}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span>{g.title}</span>
              <span className="num text-xs text-white/45">{g.progress} %</span>
            </div>
            <ProgressBar value={g.progress} color="#ffa24d" />
          </div>
        ))}
      </section>

      {/* Recommandations */}
      <SectionTitle>Recommandations du coach</SectionTitle>
      <section className="glass space-y-3 p-5">
        {recommendations.map((r, i) => (
          <div key={i} className="flex gap-3 text-sm leading-relaxed text-white/75">
            <Icon name="bolt" size={16} className="mt-1 shrink-0 text-mint-400" />
            <p>{r}</p>
          </div>
        ))}
        <p className="border-t border-white/10 pt-3 text-[11px] text-white/40">
          Texte d’exemple. Les vraies recommandations viendront du moteur d’entraînement (Phase 3) et du coach IA (Phase 4).
        </p>
      </section>

      <p className="mx-auto mt-6 text-center text-[11px] text-white/30">
        Aujourd’hui : {toISO(today)} · Phase 1 · Données fictives
      </p>

      {importOpen && <ImportSheet onClose={() => setImportOpen(false)} />}
    </div>
  )
}

function ImportSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="glass-strong mx-auto w-full max-w-md rounded-b-none p-6 pb-[calc(var(--safe-bottom)+24px)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/20" />
        <h3 className="font-display text-xl font-semibold">Import non disponible</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/65">
          L’import de fichiers FIT, GPX et TCX depuis l’app Fichiers de l’iPhone est prévu en <strong>Phase 5</strong>,
          avec le raccourci « ENVOYER AU COACH ». Ce bouton n’importe rien pour l’instant.
        </p>
        <button type="button" onClick={onClose} className="btn-ghost mt-5 w-full">
          Compris
        </button>
      </div>
    </div>
  )
}
