/** Tracé GPS stylisé à partir de coordonnées normalisées (0..1). Fictif en Phase 1. */
export default function RouteMap({ points }: { points: [number, number][] }) {
  if (points.length < 2) {
    return (
      <div className="flex h-44 items-center justify-center rounded-2xl border border-dashed border-white/10 text-xs text-white/40">
        Pas de parcours GPS disponible
      </div>
    )
  }
  const W = 320
  const H = 180
  const pad = 16
  const pts = points.map(([x, y]) => [pad + x * (W - 2 * pad), pad + y * (H - 2 * pad)] as const)
  const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const start = pts[0]
  const end = pts[pts.length - 1]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-44 w-full rounded-2xl bg-white/[0.03]">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </pattern>
        <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4df0b4" />
          <stop offset="1" stopColor="#ff8a1f" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#grid)" />
      <path d={d} fill="none" stroke="rgba(77,240,180,0.25)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="url(#routeGrad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={start[0]} cy={start[1]} r="5" fill="#4df0b4" />
      <circle cx={end[0]} cy={end[1]} r="5" fill="#ff8a1f" />
    </svg>
  )
}
