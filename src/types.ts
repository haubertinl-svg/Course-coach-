export type SessionType =
  | 'endurance'
  | 'frac_court'
  | 'frac_long'
  | 'vma'
  | 'seuil'
  | 'allure_spec'
  | 'sortie_longue'
  | 'recup'
  | 'test'

export type SessionStatus = 'planned' | 'done' | 'postponed' | 'cancelled'

export interface TrainingSession {
  id: string
  date: string // YYYY-MM-DD (heure locale)
  type: SessionType
  title: string
  objective: string
  durationMin: number
  distanceKm: number
  targetPace: string
  hrZone: string
  status: SessionStatus
  warmup: string
  main: string
  cooldown: string
  activityId?: string
}

export interface Lap {
  km: number
  distanceKm: number
  paceSec: number
  hr: number | null
}

/** Toute valeur absente est `null` : on n'invente jamais une donnée manquante. */
export interface Activity {
  id: string
  date: string // YYYY-MM-DD
  title: string
  type: SessionType
  distanceKm: number
  durationSec: number
  avgPaceSec: number
  maxPaceSec: number | null
  avgHr: number | null
  maxHr: number | null
  elevationGain: number | null
  calories: number | null
  cadence: number | null
  laps: Lap[]
  route: [number, number][] // coordonnées normalisées 0..1 (fictives en Phase 1)
}

export type GoalStatus = 'active' | 'paused' | 'done'

export interface Goal {
  id: string
  title: string
  status: GoalStatus
  rank: 'principal' | 'secondaire'
  deadline: string | null
  targetTime: string | null
  progress: number // 0..100
}

export interface ChatMessage {
  id: string
  from: 'coach' | 'me'
  text: string
}
