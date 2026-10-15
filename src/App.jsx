import { useState } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { ActivityIcon, FriendsIcon, HomeIcon, PhoneIcon, ProfileIcon, SparkIcon } from './components/Icons'
import Feed from './pages/Feed'
import Explore from './pages/Explore'
import Following from './pages/Following'
import Profile from './pages/Profile'
import LoginModal from './components/LoginModal'
import { owner, videos } from './data/videos'
import { useStore } from './lib/store'

const mail = `mailto:${owner.email}?subject=${encodeURIComponent('Dopyt – video reklama')}`

// pravý horný roh – ako "Získať mince / Získať apl."
function TopRight() {
  const { openLogin } = useStore()
  return (
    <div className="fixed right-6 top-4 z-30 hidden items-center gap-1 rounded-full bg-elev/90 p-1.5 pl-4 backdrop-blur md:flex">
      <a href={mail} className="flex items-center gap-1.5 rounded-full px-2 py-1.5 text-[15px] font-semibold hover:text-white/80">
        <SparkIcon size={18} className="text-cyan" /> <span className="hidden xl:inline">Objednať video</span>
      </a>
      <a href={owner.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-full px-2 py-1.5 text-[15px] font-semibold hover:text-white/80">
        <PhoneIcon size={18} /> <span className="hidden xl:inline">Instagram</span>
      </a>
      <span className="mx-1 h-6 w-px bg-line" />
      <button onClick={openLogin} className="h-10 rounded-full bg-brand px-5 text-[16px] font-semibold hover:bg-brand-hover">
        Prihlásiť sa
      </button>
    </div>
  )
}

// mobil – spodná lišta ako v appke
function MobileNav() {
  const tab = (to, label, Icon, end) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `flex flex-1 flex-col items-center gap-0.5 text-[11px] font-medium ${isActive ? 'text-white' : 'text-white/60'}`}
    >
      {({ isActive }) => (
        <>
          <Icon size={26} active={isActive} />
          {label}
        </>
      )}
    </NavLink>
  )
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex h-14 items-center">
        {tab('/', 'Domov', HomeIcon, true)}
        {tab('/following', 'Sledujem', FriendsIcon)}
        <a href={mail} aria-label="Objednať video" className="flex flex-1 justify-center">
          <span className="relative block h-8 w-12">
            <span className="absolute inset-0 -translate-x-[3px] rounded-lg bg-cyan" />
            <span className="absolute inset-0 translate-x-[3px] rounded-lg bg-brand" />
            <span className="absolute inset-0 grid place-items-center rounded-lg bg-white text-[24px] font-bold leading-none text-black">+</span>
          </span>
        </a>
        <a href={mail} className="relative flex flex-1 flex-col items-center gap-0.5 text-[11px] font-medium text-white/60">
          <span className="relative">
            <ActivityIcon size={26} />
            <span className="absolute -right-2 -top-1 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">1</span>
          </span>
          Správy
        </a>
        {tab(`/@${owner.handle}`, 'Profil', ProfileIcon)}
      </div>
    </nav>
  )
}

function Toast() {
  const { toast } = useStore()
  if (!toast) return null
  return (
    <div className="toast-in fixed bottom-24 left-1/2 z-[80] -translate-x-1/2 rounded-lg bg-white/90 px-4 py-2.5 text-[15px] font-semibold text-black shadow-lg md:bottom-10">
      {toast}
    </div>
  )
}

export default function App() {
  const [compact, setCompact] = useState(false)
  const { pathname } = useLocation()
  const isFeed = ['/', '/reklamy', '/reels', '/following'].includes(pathname)

  return (
    <>
      <Sidebar compact={compact} onToggleCompact={() => setCompact((c) => !c)} />
      <main className={`min-h-dvh ${compact ? 'md:pl-[72px]' : 'md:pl-[72px] lg:pl-[240px]'}`}>
        <Routes>
          <Route path="/" element={<Feed key="all" list={videos} />} />
          <Route path="/reklamy" element={<Feed key="ads" list={videos.filter((v) => v.type === 'reklamy')} />} />
          <Route path="/reels" element={<Feed key="reels" list={videos.filter((v) => v.type === 'reels')} />} />
          <Route path="/following" element={<Following />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/:profile" element={<Profile />} />
        </Routes>
      </main>
      {isFeed && <TopRight />}
      <MobileNav />
      <LoginModal />
      <Toast />
    </>
  )
}
