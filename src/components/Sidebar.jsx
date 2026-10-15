import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { accounts, owner, videos } from '../data/videos'
import { useStore } from '../lib/store'
import { Avatar, Logo, LogoMark } from './Brand'
import {
  ActivityIcon, CloseIcon, CompassIcon, DramaIcon, FollowingIcon, HomeIcon, LiveIcon,
  MessagesIcon, MoreIcon, ProfileIcon, SearchIcon, SidebarIcon, UploadIcon,
} from './Icons'

const mail = `mailto:${owner.email}?subject=${encodeURIComponent('Dopyt – video reklama')}`

export const navItems = [
  { to: '/', label: 'Pre teba', icon: HomeIcon, end: true },
  { to: '/explore', label: 'Preskúmať', icon: CompassIcon },
  { to: '/following', label: 'Sledujem', icon: FollowingIcon },
  { to: '/reklamy', label: 'Reklamy', icon: DramaIcon },
  { to: '/reels', label: 'Reels', icon: LiveIcon },
  { href: mail, label: 'Správy', icon: MessagesIcon },
  { href: owner.instagram, label: 'Aktivita', icon: ActivityIcon, badge: 2 },
  { href: mail, label: 'Objednať video', icon: UploadIcon },
  { to: `/@${owner.handle}`, label: 'Profil', icon: ProfileIcon, profile: true },
  { href: owner.linkUrl, label: 'Viac', icon: MoreIcon },
]

const suggestions = ['ai reklamy', 'hotel reels', 'meta ads', 'detailing', 'ukážka reklamy']

function SearchPanel({ onClose }) {
  const [q, setQ] = useState('')
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ejaj:recent')) ?? ['ai video', 'swappie'] } catch { return ['ai video', 'swappie'] }
  })
  const input = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    input.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    return videos
      .filter((v) => {
        const a = accounts[v.account]
        return [v.caption, a.name, a.handle, ...v.tags].join(' ').toLowerCase().includes(s)
      })
      .slice(0, 8)
  }, [q])

  const submit = (term) => {
    const t = term.trim()
    if (!t) return
    const next = [t, ...recent.filter((r) => r !== t)].slice(0, 6)
    setRecent(next)
    try { localStorage.setItem('ejaj:recent', JSON.stringify(next)) } catch { /* nevadí */ }
    navigate(`/explore?q=${encodeURIComponent(t)}`)
    onClose()
  }

  const removeRecent = (r) => {
    const next = recent.filter((x) => x !== r)
    setRecent(next)
    try { localStorage.setItem('ejaj:recent', JSON.stringify(next)) } catch { /* nevadí */ }
  }

  return (
    <div className="slide-right thin-scrollbar fixed inset-y-0 left-[72px] z-40 w-[400px] overflow-y-auto border-r border-line bg-black px-5 pt-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[24px] font-bold">Hľadať</h2>
        <button onClick={onClose} aria-label="Zavrieť" className="grid h-9 w-9 place-items-center rounded-full bg-elev hover:bg-elev-2">
          <CloseIcon size={18} />
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(q)
        }}
      >
        <input
          ref={input}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Hľadať"
          className="h-12 w-full rounded-full border border-line bg-elev px-5 text-[16px] outline-none placeholder:text-white/40 focus:border-white/30"
        />
      </form>

      {q.trim() ? (
        <div className="mt-4 space-y-1">
          {results.length === 0 && <p className="px-2 py-6 text-center text-muted">Nič sme nenašli pre „{q}“</p>}
          {results.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                navigate(`/?v=${v.id}`)
                onClose()
              }}
              className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-elev"
            >
              <img src={v.poster} alt="" className="h-16 w-10 shrink-0 rounded object-cover" />
              <div className="min-w-0">
                <div className="line-clamp-2 text-[14px] font-medium">{v.caption}</div>
                <div className="truncate text-[13px] text-muted">{accounts[v.account].name}</div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <>
          {recent.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 px-1 text-[15px] font-semibold text-muted">Nedávne vyhľadávania</div>
              {recent.map((r) => (
                <div key={r} className="group flex items-center rounded-lg hover:bg-elev">
                  <button onClick={() => submit(r)} className="flex flex-1 items-center gap-3 px-3 py-2.5 text-left text-[16px] font-semibold">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-white/35 text-[10px] text-black">◷</span>
                    {r}
                  </button>
                  <button onClick={() => removeRecent(r)} aria-label="Odstrániť" className="px-3 text-white/40 hover:text-white">
                    <CloseIcon size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6">
            <div className="mb-2 px-1 text-[15px] font-semibold text-muted">Môže sa ti páčiť</div>
            {suggestions.map((s) => (
              <button key={s} onClick={() => submit(s)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[16px] font-semibold hover:bg-elev">
                <span className="h-2 w-2 rounded-full bg-brand" />
                {s}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function NavEntry({ item, compact }) {
  const Icon = item.icon
  const cls = (active) =>
    `relative flex h-12 items-center gap-3 rounded-lg px-2 text-[17px] font-semibold transition hover:bg-elev ${
      active ? 'text-brand' : 'text-white'
    } ${compact ? 'w-12 justify-center px-0' : ''}`

  const icon = (active) =>
    item.profile ? (
      <span className={`grid h-8 w-8 place-items-center rounded-full ${active ? 'ring-2 ring-brand' : ''}`}>
        <LogoMark size={30} />
      </span>
    ) : (
      <span className="relative grid h-8 w-8 place-items-center">
        <Icon size={26} active={active} />
        {item.badge && (
          <span className="absolute -right-1.5 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
            {item.badge}
          </span>
        )}
      </span>
    )

  if (item.href)
    return (
      <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={cls(false)} title={item.label}>
        {icon(false)}
        {!compact && item.label}
      </a>
    )
  return (
    <NavLink to={item.to} end={item.end} className={({ isActive }) => cls(isActive)} title={item.label}>
      {({ isActive }) => (
        <>
          {icon(isActive)}
          {!compact && item.label}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ compact: manualCompact, onToggleCompact }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const { openLogin, user, signOut } = useStore()
  const compactAll = searchOpen || manualCompact

  return (
    <>
      {/* md: ikonky, lg: plný panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col bg-black md:flex ${
          compactAll ? 'w-[72px] border-r border-line' : 'w-[72px] lg:w-[240px]'
        }`}
      >
        <div className={`flex h-full flex-col px-3 pt-5 ${compactAll ? '' : 'lg:px-4'}`}>
          {/* logo */}
          <div className="mb-4 flex h-10 items-center justify-between">
            <Link to="/" className={`items-center ${compactAll ? 'hidden' : 'hidden lg:flex'}`} aria-label="ejajads">
              <Logo height={30} />
            </Link>
            <Link
              to="/"
              onClick={(e) => {
                if (manualCompact && !searchOpen) {
                  e.preventDefault()
                  onToggleCompact()
                }
              }}
              className={`${compactAll ? 'grid' : 'grid lg:hidden'} w-12 place-items-center`}
              aria-label="ejajads"
            >
              <LogoMark size={36} />
            </Link>
            <button
              onClick={onToggleCompact}
              aria-label="Zbaliť panel"
              className={`h-9 w-9 place-items-center rounded-md text-white/60 hover:bg-elev hover:text-white ${compactAll ? 'hidden' : 'hidden lg:grid'}`}
            >
              <SidebarIcon size={20} />
            </button>
          </div>

          {/* hľadať */}
          <button
            onClick={() => setSearchOpen((o) => !o)}
            className={`mb-3 flex h-11 items-center gap-2 rounded-full bg-elev text-[16px] text-white/50 hover:bg-elev-2 ${
              compactAll ? 'w-12 justify-center' : 'w-12 justify-center lg:w-full lg:justify-start lg:px-4'
            } ${searchOpen ? 'ring-1 ring-white/30' : ''}`}
            aria-label="Hľadať"
          >
            <SearchIcon size={20} className="text-white" />
            <span className={compactAll ? 'hidden' : 'hidden lg:inline'}>Hľadať</span>
          </button>

          <nav className="thin-scrollbar -mx-1 flex-1 overflow-y-auto px-1">
            <div className="space-y-0.5">
              {navItems.map((item) => (
                <div key={item.label}>
                  <div className={compactAll ? '' : 'lg:hidden'}>
                    <NavEntry item={item} compact />
                  </div>
                  {!compactAll && (
                    <div className="hidden lg:block">
                      <NavEntry item={item} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!compactAll && (
              <div className="hidden lg:block">
                {user ? (
                  <div className="mt-4">
                    <div className="mb-2 truncate px-2 text-[13px] text-muted">{user.email}</div>
                    <button onClick={signOut} className="h-12 w-full rounded-lg bg-elev text-[17px] font-semibold hover:bg-elev-2">
                      Odhlásiť sa
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={openLogin}
                    className="mt-4 h-12 w-full rounded-lg bg-brand text-[17px] font-semibold hover:bg-brand-hover"
                  >
                    Prihlásiť sa
                  </button>
                )}
                <div className="my-4 border-t border-line" />
                <div className="mb-2 px-2 text-[15px] font-semibold text-white/80">Klienti</div>
                {Object.values(accounts).map((a) => (
                  <Link key={a.handle} to={`/@${a.handle}`} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-elev">
                    <Avatar account={a} size={34} />
                    <div className="min-w-0">
                      <div className="truncate text-[15px] font-semibold">{a.name}</div>
                      <div className="truncate text-[12px] text-muted">{a.handle}</div>
                    </div>
                  </Link>
                ))}
                <div className="my-4 border-t border-line" />
                <p className="px-2 pb-6 text-[12px] leading-relaxed text-white/40">
                  AI video reklamy · Reels · TikTok
                  <br />© 2026 EJAJADS™
                </p>
              </div>
            )}
          </nav>
        </div>
      </aside>

      {searchOpen && (
        <>
          <button aria-label="Zavrieť hľadanie" onClick={() => setSearchOpen(false)} className="fixed inset-0 z-30 hidden md:block" />
          <div className="hidden md:block">
            <SearchPanel onClose={() => setSearchOpen(false)} />
          </div>
        </>
      )}
    </>
  )
}
