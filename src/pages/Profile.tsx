import { useState } from 'react'
import { MockBadge, PageHeader, ProgressBar, SectionTitle } from '../components/ui'
import { goals } from '../data/mock'
import { fmtDateShort, fromISO } from '../lib/date'

/** Profil Phase 1 : champs vides ou « à renseigner ». Aucune valeur n'est supposée connue.
 *  Les champs sont éditables en mémoire uniquement (non enregistrés) : la persistance arrive en Phase 2. */
const FIELDS: { section: string; items: { key: string; label: string; placeholder: string; type?: string }[] }[] = [
  {
    section: 'Informations sportives',
    items: [
      { key: 'level', label: 'Niveau', placeholder: 'Coureur régulier' },
      { key: 'since', label: 'Début de pratique', placeholder: 'AAAA-MM', type: 'month' },
      { key: 'freq', label: 'Séances par semaine', placeholder: '4', type: 'number' },
      { key: 'avail', label: 'Disponibilités', placeholder: 'Ex. lun, mer, ven, dim' },
      { key: 'height', label: 'Taille (cm, facultatif)', placeholder: '—', type: 'number' },
      { key: 'weight', label: 'Poids (kg, facultatif)', placeholder: '—', type: 'number' },
    ],
  },
  {
    section: 'Données physiologiques',
    items: [
      { key: 'hrRest', label: 'FC au repos (bpm)', placeholder: 'Inconnue', type: 'number' },
      { key: 'hrMax', label: 'FC maximale (bpm)', placeholder: 'Inconnue', type: 'number' },
      { key: 'vma', label: 'VMA (km/h)', placeholder: 'Inconnue', type: 'number' },
    ],
  },
]

const RECORDS = ['5 km', '10 km', 'Semi-marathon']

export default function Profile() {
  const [values, setValues] = useState<Record<string, string>>({})

  return (
    <div className="px-4">
      <PageHeader title="Profil" subtitle="Personnel" right={<MockBadge />} />

      <div className="glass flex items-center gap-4 p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-mint-300 to-mint-500 font-display text-xl font-bold text-ink-950 shadow-glow">
          C
        </div>
        <div>
          <p className="font-display text-lg font-semibold">Coureur</p>
          <p className="text-xs text-white/50">CMF Watch 3 Pro · Nothing X · iPhone</p>
        </div>
      </div>

      <p className="mt-3 px-2 text-[11px] leading-relaxed text-white/40">
        Profil vide volontairement : aucune information n’est supposée connue. Tu peux saisir des valeurs pour tester
        l’interface, mais elles ne sont pas enregistrées (la sauvegarde arrive en Phase 2).
      </p>

      {FIELDS.map((g) => (
        <div key={g.section}>
          <SectionTitle>{g.section}</SectionTitle>
          <section className="glass divide-y divide-white/[0.07]">
            {g.items.map((f) => (
              <label key={f.key} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <span className="text-sm text-white/70">{f.label}</span>
                <input
                  type={f.type ?? 'text'}
                  inputMode={f.type === 'number' ? 'decimal' : undefined}
                  value={values[f.key] ?? ''}
                  placeholder={f.placeholder}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                  className="num w-40 bg-transparent text-right text-sm font-medium text-white placeholder:text-white/25 focus:outline-none"
                />
              </label>
            ))}
          </section>
        </div>
      ))}

      <SectionTitle>Records personnels</SectionTitle>
      <section className="glass divide-y divide-white/[0.07]">
        {RECORDS.map((r) => (
          <div key={r} className="flex items-center justify-between px-5 py-3.5 text-sm">
            <span className="text-white/70">{r}</span>
            <span className="text-white/30">À renseigner</span>
          </div>
        ))}
      </section>

      <SectionTitle>Objectifs</SectionTitle>
      <section className="glass space-y-5 p-5">
        {goals.map((g) => (
          <div key={g.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{g.title}</p>
                <p className="mt-0.5 text-[11px] text-white/45">
                  {g.rank === 'principal' ? 'Principal' : 'Secondaire'} ·{' '}
                  {g.status === 'active' ? 'Actif' : g.status === 'paused' ? 'En pause' : 'Atteint'}
                  {g.targetTime ? ` · cible ${g.targetTime}` : ''}
                  {g.deadline ? ` · ${fmtDateShort(fromISO(g.deadline))}` : ''}
                </p>
              </div>
              <span className="num text-xs text-white/50">{g.progress} %</span>
            </div>
            <div className="mt-2">
              <ProgressBar value={g.progress} color={g.rank === 'principal' ? '#4df0b4' : '#ffa24d'} />
            </div>
          </div>
        ))}
        <p className="border-t border-white/10 pt-3 text-[11px] text-white/40">
          Objectifs d’exemple, non modifiables en Phase 1 (gestion complète en Phase 2).
        </p>
      </section>

      <SectionTitle>Données et confidentialité</SectionTitle>
      <section className="glass p-5 text-sm leading-relaxed text-white/60">
        Connexion personnelle, export et suppression de tes données : prévus en Phase 2 (Supabase + RLS).
      </section>
    </div>
  )
}
