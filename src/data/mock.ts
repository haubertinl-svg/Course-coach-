// ⚠️ DONNÉES FICTIVES — Phase 1 uniquement.
// Rien ici ne vient de ta montre, de Strava ou d'Apple Santé. Tout est généré
// de façon déterministe pour illustrer l'interface, et sera remplacé par la base
// Supabase (Phase 2) puis par tes vraies activités (Phase 5).
import type { Activity, ChatMessage, Goal, Lap, SessionType, TrainingSession } from '../types'
import { addDays, startOfDay, startOfWeek, toISO } from '../lib/date'

export const IS_MOCK = true

export const TYPE_LABEL: Record<SessionType, string> = {
  endurance: 'Endurance fondamentale',
  frac_court: 'Fractionné court',
  frac_long: 'Fractionné long',
  vma: 'VMA',
  seuil: 'Seuil',
  allure_spec: 'Allure spécifique',
  sortie_longue: 'Sortie longue',
  recup: 'Récupération active',
  test: 'Test de performance',
}

export const TYPE_COLOR: Record<SessionType, string> = {
  endurance: '#4df0b4',
  frac_court: '#ff8a1f',
  frac_long: '#ffa24d',
  vma: '#ff6b5e',
  seuil: '#f5c84c',
  allure_spec: '#7cc7ff',
  sortie_longue: '#9d8cff',
  recup: '#6fd6c2',
  test: '#ffffff',
}

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

interface Tpl {
  type: SessionType
  title: string
  objective: string
  durationMin: number
  distanceKm: number
  targetPace: string
  hrZone: string
  warmup: string
  main: string
  cooldown: string
}

const WU = '15 min de footing facile + 4 éducatifs + 3 lignes droites progressives'
const CD = '10 min de footing très lent + étirements légers'

const T: Record<string, Tpl> = {
  endu: {
    type: 'endurance',
    title: 'Footing d’endurance',
    objective: 'Construire la base aérobie sans fatigue excessive.',
    durationMin: 55,
    distanceKm: 8,
    targetPace: 'Allure confortable (conversation possible)',
    hrZone: 'Z2',
    warmup: '5 min de marche rapide puis course très facile',
    main: '45 min en continu à allure confortable, respiration contrôlée',
    cooldown: '5 min de marche + mobilité',
  },
  longue: {
    type: 'sortie_longue',
    title: 'Sortie longue',
    objective: 'Développer l’endurance spécifique et la résistance à la fatigue.',
    durationMin: 90,
    distanceKm: 14,
    targetPace: 'Légèrement plus lent que l’endurance',
    hrZone: 'Z2',
    warmup: '10 min très faciles',
    main: '70 min régulières ; possibilité de finir les 10 dernières minutes un peu plus vite',
    cooldown: '10 min de marche + hydratation',
  },
  fcourt: {
    type: 'frac_court',
    title: '10 × 30 s / 30 s',
    objective: 'Stimuler la VMA avec une charge nerveuse maîtrisée.',
    durationMin: 50,
    distanceKm: 7.5,
    targetPace: '30 s à allure VMA / 30 s trot',
    hrZone: 'Z4–Z5',
    warmup: WU,
    main: '2 séries de 5 × (30 s rapide / 30 s trot), 3 min de trot entre séries',
    cooldown: CD,
  },
  flong: {
    type: 'frac_long',
    title: '5 × 1000 m',
    objective: 'Travailler la tolérance à l’effort soutenu.',
    durationMin: 60,
    distanceKm: 9,
    targetPace: 'Allure 5–10 km',
    hrZone: 'Z4',
    warmup: WU,
    main: '5 × 1000 m, récupération 2 min en trot lent',
    cooldown: CD,
  },
  vma: {
    type: 'vma',
    title: '6 × 3 min VMA',
    objective: 'Améliorer la puissance aérobie maximale.',
    durationMin: 60,
    distanceKm: 9,
    targetPace: 'Allure VMA',
    hrZone: 'Z5',
    warmup: WU,
    main: '6 × 3 min à allure VMA, récupération 2 min trot',
    cooldown: CD,
  },
  seuil: {
    type: 'seuil',
    title: '3 × 10 min seuil',
    objective: 'Repousser le seuil lactique.',
    durationMin: 65,
    distanceKm: 10,
    targetPace: 'Allure seuil (effort « confortablement dur »)',
    hrZone: 'Z3–Z4',
    warmup: WU,
    main: '3 × 10 min à allure seuil, récupération 2 min trot',
    cooldown: CD,
  },
  spec: {
    type: 'allure_spec',
    title: '2 × 3 km allure objectif',
    objective: 'Automatiser l’allure visée sur l’objectif principal.',
    durationMin: 65,
    distanceKm: 10,
    targetPace: 'Allure de l’objectif principal',
    hrZone: 'Z3–Z4',
    warmup: WU,
    main: '2 × 3 km à allure objectif, récupération 3 min trot',
    cooldown: CD,
  },
  recup: {
    type: 'recup',
    title: 'Footing de récupération',
    objective: 'Favoriser la récupération active.',
    durationMin: 35,
    distanceKm: 5,
    targetPace: 'Très lent, sans effort',
    hrZone: 'Z1',
    warmup: '5 min de marche',
    main: '25 min très faciles',
    cooldown: '5 min de marche + mobilité',
  },
  test: {
    type: 'test',
    title: 'Test 5 km chronométré',
    objective: 'Mesurer la progression sur 5 km.',
    durationMin: 50,
    distanceKm: 8,
    targetPace: 'Effort maximal maîtrisé',
    hrZone: 'Z4–Z5',
    warmup: WU,
    main: '5 km chronométrés, régularité visée',
    cooldown: CD,
  },
}

// Cycle de 4 semaines : 3 semaines de charge progressive + 1 semaine allégée.
const CYCLE: Tpl[][] = [
  [T.endu, T.fcourt, T.seuil, T.longue],
  [T.endu, T.vma, T.spec, T.longue],
  [T.endu, T.flong, T.seuil, T.longue],
  [T.recup, T.endu, T.test, T.endu],
]
const DAY_OFFSETS = [0, 2, 4, 6] // lun, mer, ven, dim

const BASE_PACE: Record<SessionType, number> = {
  endurance: 372,
  sortie_longue: 366,
  frac_court: 335,
  frac_long: 328,
  vma: 322,
  seuil: 316,
  allure_spec: 320,
  recup: 395,
  test: 292,
}
const BASE_HR: Record<SessionType, number> = {
  endurance: 148,
  sortie_longue: 152,
  frac_court: 160,
  frac_long: 163,
  vma: 167,
  seuil: 165,
  allure_spec: 162,
  recup: 135,
  test: 170,
}

function makeRoute(seed: number): [number, number][] {
  const pts: [number, number][] = []
  const n = 70
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2
    pts.push([
      0.5 + 0.38 * Math.cos(t) + 0.06 * Math.sin(3 * t + seed),
      0.5 + 0.28 * Math.sin(t) + 0.05 * Math.cos(2 * t + seed),
    ])
  }
  return pts
}

function makeActivity(id: string, date: string, tpl: Tpl, weekRel: number, seed: number): Activity {
  const r = rng(seed)
  const type = tpl.type
  const distanceKm = +(tpl.distanceKm * (0.97 + r() * 0.06)).toFixed(2)
  const progress = 1 - (weekRel + 4) * 0.003
  const avgPaceSec = Math.round(BASE_PACE[type] * progress + (r() - 0.5) * 6)
  const durationSec = Math.round(distanceKm * avgPaceSec)
  const avgHr = Math.round(BASE_HR[type] + (r() - 0.5) * 6)

  const laps: Lap[] = []
  const full = Math.floor(distanceKm)
  for (let k = 1; k <= full; k++) {
    const warm = k === 1 ? 14 : 0
    const pace = Math.round(avgPaceSec + warm + (r() - 0.5) * 14)
    laps.push({ km: k, distanceKm: 1, paceSec: pace, hr: Math.round(avgHr - 6 + k * 0.9 + (r() - 0.5) * 4) })
  }
  const rest = +(distanceKm - full).toFixed(2)
  if (rest >= 0.1) {
    laps.push({ km: full + 1, distanceKm: rest, paceSec: Math.round(avgPaceSec + (r() - 0.5) * 10), hr: Math.round(avgHr + 3) })
  }

  // Quelques champs volontairement absents pour tester l'affichage « donnée absente ».
  const noCadence = seed % 5 === 0
  const noCalories = seed % 7 === 0
  const noMaxPace = seed % 4 === 0

  return {
    id,
    date,
    title: tpl.title,
    type,
    distanceKm,
    durationSec,
    avgPaceSec,
    maxPaceSec: noMaxPace ? null : Math.round(avgPaceSec * 0.8),
    avgHr,
    maxHr: avgHr + 12 + Math.round(r() * 8),
    elevationGain: Math.round(40 + r() * 120),
    calories: noCalories ? null : Math.round(distanceKm * 62),
    cadence: noCadence ? null : Math.round(168 + r() * 8),
    laps,
    route: makeRoute(seed),
  }
}

const today = startOfDay(new Date())
const weekStart = startOfWeek(today)

function buildData() {
  const sessions: TrainingSession[] = []
  const activities: Activity[] = []
  for (let w = -4; w <= 3; w++) {
    const cycleIdx = (((w % 4) + 4) % 4)
    CYCLE[cycleIdx].forEach((tpl, i) => {
      const date = addDays(weekStart, w * 7 + DAY_OFFSETS[i])
      const iso = toISO(date)
      const id = `s-${iso}`
      let status: TrainingSession['status'] = date < today ? 'done' : 'planned'
      if (w === -2 && i === 1) status = 'postponed'
      if (w === -3 && i === 2) status = 'cancelled'
      const s: TrainingSession = { ...tpl, id, date: iso, status }
      if (status === 'done') {
        const aid = `a-${iso}`
        s.activityId = aid
        activities.push(makeActivity(aid, iso, tpl, w, 100 + (w + 4) * 10 + i))
      }
      sessions.push(s)
    })
  }
  activities.sort((a, b) => (a.date < b.date ? 1 : -1))
  return { sessions, activities }
}

const built = buildData()
export const sessions: TrainingSession[] = built.sessions
export const activities: Activity[] = built.activities

export const goals: Goal[] = [
  { id: 'g1', title: 'Progresser sur 10 km', status: 'active', rank: 'principal', deadline: toISO(addDays(today, 70)), targetTime: '50:00', progress: 46 },
  { id: 'g2', title: 'Améliorer mon 5 km', status: 'active', rank: 'secondaire', deadline: null, targetTime: null, progress: 62 },
  { id: 'g3', title: 'Améliorer ma VMA', status: 'active', rank: 'secondaire', deadline: null, targetTime: null, progress: 35 },
  { id: 'g4', title: 'Préparer un semi-marathon', status: 'paused', rank: 'secondaire', deadline: null, targetTime: null, progress: 12 },
]

export const recommendations: string[] = [
  'Ta charge progresse de façon régulière : garde l’intensité des séances qualité, ne l’augmente pas encore.',
  'Garde la prochaine sortie en Z2 : l’objectif est d’accumuler du volume facile.',
  'Prévois une semaine allégée toutes les 4 semaines pour consolider la progression.',
]

export const recovery = {
  readiness: 78,
  loadRatio: 1.08,
  daysSinceHard: 2,
  freshness: 'Bonne',
}

export const coachDemo: ChatMessage[] = [
  { id: 'm1', from: 'coach', text: 'Bonjour ! Je suis ton coach. Dis-moi comment s’est passée ta dernière sortie.' },
  { id: 'm2', from: 'me', text: 'Plutôt bien, mais j’avais les jambes lourdes sur la fin.' },
  { id: 'm3', from: 'coach', text: 'Merci pour ce retour. Je regarderai ta charge des 7 derniers jours avant de te proposer un ajustement. Je ne pose aucun diagnostic médical : en cas de douleur persistante, vois un professionnel de santé.' },
]
