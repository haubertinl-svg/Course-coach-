export const DASH = '—'

/** 372 -> "6:12" */
export function fmtPace(sec: number | null | undefined): string {
  if (sec == null || !isFinite(sec) || sec <= 0) return DASH
  const m = Math.floor(sec / 60)
  const s = Math.round(sec % 60)
  return s === 60 ? `${m + 1}:00` : `${m}:${String(s).padStart(2, '0')}`
}

/** 3725 -> "1:02:05" ; 1530 -> "25:30" */
export function fmtDuration(sec: number | null | undefined): string {
  if (sec == null || !isFinite(sec)) return DASH
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.round(sec % 60)
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`
}

export function fmtKm(km: number | null | undefined, digits = 1): string {
  if (km == null || !isFinite(km)) return DASH
  return km.toFixed(digits).replace('.', ',')
}

export function fmtInt(n: number | null | undefined, unit = ''): string {
  if (n == null || !isFinite(n)) return DASH
  return `${Math.round(n)}${unit}`
}
