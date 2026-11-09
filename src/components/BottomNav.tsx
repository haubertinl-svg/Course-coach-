import { NavLink } from 'react-router-dom'
import Icon from './Icon'

const TABS = [
  { to: '/', label: 'Accueil', icon: 'home', end: true },
  { to: '/programme', label: 'Programme', icon: 'calendar', end: false },
  { to: '/activites', label: 'Activités', icon: 'activity', end: false },
  { to: '/coach', label: 'Coach IA', icon: 'chat', end: false },
  { to: '/profil', label: 'Profil', icon: 'user', end: false },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(var(--safe-bottom)+10px)] pt-2"
      aria-label="Navigation principale"
    >
      <div className="glass-strong mx-auto flex max-w-md items-center justify-between rounded-[28px] px-2 py-2">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-[10px] font-medium transition ${
                isActive ? 'text-mint-400' : 'text-white/45'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute inset-x-3 -top-0.5 h-[3px] rounded-full bg-mint-400 shadow-[0_0_12px_rgba(77,240,180,0.9)]" />
                )}
                <Icon name={t.icon} size={22} strokeWidth={isActive ? 2 : 1.6} />
                <span>{t.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
