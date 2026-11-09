import { Link, useParams } from 'react-router-dom'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Icon from '../components/Icon'
import RouteMap from '../components/RouteMap'
import { EmptyNote, MockBadge, SectionTitle, Stat } from '../components/ui'
import { activities, TYPE_LABEL } from '../data/mock'
import { fmtDateLong, fromISO } from '../lib/date'
import { fmtDuration, fmtInt, fmtKm, fmtPace } from '../lib/format'

const tooltipStyle = {
  background: 'rgba(10,14,20,0.95)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
  fontSize: 12,
}

export default function ActivityDetail() {
  const { id } = useParams()
  const act = activities.find((a) => a.id === id)

  if (!act) {
    return (
      <div className="px-4 pt-[calc(var(--safe-top)+18px)]">
        <Link to="/activites" className="btn-ghost">
          <Icon name="chevronL" size={16} /> Activités
        </Link>
        <p className="mt-6 text-white/60">Activité introuvable.</p>
      </div>
    )
  }

  const paceData = act.laps.map((l) => ({ km: `${l.km}`, pace: l.paceSec }))
  const hrData = act.laps.filter((l) => l.hr != null).map((l) => ({ km: `${l.km}`, hr: l.hr as number }))
  const paces = act.laps.map((l) => l.paceSec)
  const pMin = Math.min(...paces) - 15
  const pMax = Math.max(...paces) + 15

  return (
    <div className="stagger px-4">
      <div className="flex items-center justify-between pb-4 pt-[calc(var(--safe-top)+18px)]">
        <Link to="/activites" className="btn-ghost !px-3" aria-label="Retour">
          <Icon name="chevronL" size={18} />
        </Link>
        <MockBadge />
      </div>

      <div className="px-1">
        <p className="label">{TYPE_LABEL[act.type]}</p>
        <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight">{act.title}</h1>
        <p className="mt-1 text-xs text-white/50">{fmtDateLong(fromISO(act.date))}</p>
      </div>

      <section className="glass mt-4 p-4">
        <RouteMap points={act.route} />
      </section>

      <section className="glass mt-3 grid grid-cols-3 gap-x-4 gap-y-5 p-5">
        <Stat label="Distance" value={fmtKm(act.distanceKm, 2)} unit="km" accent />
        <Stat label="Durée" value={fmtDuration(act.durationSec)} />
        <Stat label="Allure moy." value={fmtPace(act.avgPaceSec)} unit="/km" />
        <Stat label="Allure max" value={fmtPace(act.maxPaceSec)} unit="/km" />
        <Stat label="FC moy." value={fmtInt(act.avgHr)} unit={act.avgHr != null ? 'bpm' : undefined} />
        <Stat label="FC max" value={fmtInt(act.maxHr)} unit={act.maxHr != null ? 'bpm' : undefined} />
        <Stat label="D+" value={fmtInt(act.elevationGain)} unit={act.elevationGain != null ? 'm' : undefined} />
        <Stat label="Calories" value={fmtInt(act.calories)} unit={act.calories != null ? 'kcal' : undefined} />
        <Stat label="Cadence" value={fmtInt(act.cadence)} unit={act.cadence != null ? 'ppm' : undefined} />
      </section>
      <p className="mt-2 px-2 text-[11px] text-white/35">« — » = donnée non disponible (jamais inventée).</p>

      <SectionTitle>Allure par kilomètre</SectionTitle>
      <section className="glass p-4">
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={paceData} margin={{ left: -18, right: 6, top: 6 }}>
              <defs>
                <linearGradient id="paceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#4df0b4" stopOpacity={0.4} />
                  <stop offset="1" stopColor="#4df0b4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="km" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                reversed
                domain={[pMin, pMax]}
                tickFormatter={(v: number) => fmtPace(v)}
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [`${fmtPace(Number(v))} /km`, 'Allure']}
                labelFormatter={(l) => `Km ${l}`}
              />
              <Area type="monotone" dataKey="pace" stroke="#4df0b4" strokeWidth={2.5} fill="url(#paceFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <SectionTitle>Fréquence cardiaque</SectionTitle>
      {hrData.length > 0 ? (
        <section className="glass p-4">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hrData} margin={{ left: -18, right: 6, top: 6 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="km" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={['dataMin - 10', 'dataMax + 8']} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${Number(v)} bpm`, 'FC moy.']} labelFormatter={(l) => `Km ${l}`} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="hr" fill="#ff8a1f" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : (
        <EmptyNote>Aucune donnée cardiaque pour cette sortie.</EmptyNote>
      )}

      <SectionTitle>Splits kilométriques</SectionTitle>
      <section className="glass overflow-hidden">
        <div className="num grid grid-cols-[48px_1fr_1fr_1fr] px-5 py-3 text-[10px] uppercase tracking-widest text-white/40">
          <span>Km</span>
          <span>Distance</span>
          <span className="text-right">Allure</span>
          <span className="text-right">FC</span>
        </div>
        {act.laps.map((l) => (
          <div key={l.km} className="num grid grid-cols-[48px_1fr_1fr_1fr] border-t border-white/[0.07] px-5 py-3 text-sm">
            <span className="text-white/50">{l.km}</span>
            <span>{fmtKm(l.distanceKm, 2)} km</span>
            <span className="text-right font-medium">{fmtPace(l.paceSec)}</span>
            <span className="text-right text-white/70">{fmtInt(l.hr)}</span>
          </div>
        ))}
      </section>

      <SectionTitle>Analyse du coach</SectionTitle>
      <EmptyNote>
        L’analyse automatique après import (résumé, allure, FC, charge, adaptation) arrive en Phase 4.
        Aucun compte rendu n’est affiché ici pour ne rien inventer.
      </EmptyNote>
    </div>
  )
}
