import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Program from './pages/Program'
import Activities from './pages/Activities'
import ActivityDetail from './pages/ActivityDetail'
import Coach from './pages/Coach'
import Profile from './pages/Profile'

export default function App() {
  const { pathname } = useLocation()
  // Clé = premier segment : transition douce entre onglets, pas entre liste et fiche.
  const tabKey = pathname.split('/')[1] || 'home'

  // Retour en haut de page à chaque changement de route (liste -> fiche, changement d'onglet).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <div className="app-bg" />
      <main key={tabKey} className="page-enter mx-auto min-h-full max-w-md pb-[calc(var(--safe-bottom)+110px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/programme" element={<Program />} />
          <Route path="/activites" element={<Activities />} />
          <Route path="/activites/:id" element={<ActivityDetail />} />
          <Route path="/coach" element={<Coach />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <BottomNav />
    </>
  )
}
