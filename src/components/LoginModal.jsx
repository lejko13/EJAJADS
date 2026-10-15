import { useEffect, useState } from 'react'
import { useStore } from '../lib/store'
import { Logo } from './Brand'
import { ChevronLeft } from './Icons'

/* ── ikonky poskytovateľov ─────────────────────────────── */
const QrIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 20h2M20 14v2" />
  </svg>
)
const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <circle cx="12" cy="7.5" r="4.5" />
    <path d="M3.5 21c.6-4.6 4.1-7.5 8.5-7.5s7.9 2.9 8.5 7.5z" />
  </svg>
)
// ── ODKAZY – sem doplň svoje linky ──────────────────────────
// prázdny odkaz = po kliknutí sa zobrazí „Odkaz čoskoro doplníme“
export const LINKS = {
  instagram: '', // napr. https://www.instagram.com/ejajads/
  tiktok: '', // napr. https://www.tiktok.com/@ejajads
  email: '', // napr. info@ejajads.sk
  newsletter: '', // napr. odkaz na formulár newslettera
}

const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
    <defs>
      <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
        <stop offset="0" stopColor="#fdf497" />
        <stop offset="0.05" stopColor="#fdf497" />
        <stop offset="0.45" stopColor="#fd5949" />
        <stop offset="0.6" stopColor="#d6249f" />
        <stop offset="0.9" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect x="1" y="1" width="22" height="22" rx="6.5" fill="url(#ig-grad)" />
    <rect x="6" y="6" width="12" height="12" rx="3.8" fill="none" stroke="#fff" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="2.9" fill="none" stroke="#fff" strokeWidth="1.8" />
    <circle cx="16.4" cy="7.6" r="1" fill="#fff" />
  </svg>
)
const TikTokIcon = () => (
  <svg width="22" height="24" viewBox="0 0 22 24" aria-hidden>
    <path d="M15.4 1h-3.6v14.8a3.3 3.3 0 1 1-2.4-3.2V9a6.9 6.9 0 1 0 6 6.8V8.3a8.4 8.4 0 0 0 4.8 1.5V6.2a4.8 4.8 0 0 1-4.8-4.8z" fill="#25f4ee" transform="translate(-1 -0.8)" />
    <path d="M15.4 1h-3.6v14.8a3.3 3.3 0 1 1-2.4-3.2V9a6.9 6.9 0 1 0 6 6.8V8.3a8.4 8.4 0 0 0 4.8 1.5V6.2a4.8 4.8 0 0 1-4.8-4.8z" fill="#fe2c55" transform="translate(0.8 0.8)" />
    <path d="M15.4 1h-3.6v14.8a3.3 3.3 0 1 1-2.4-3.2V9a6.9 6.9 0 1 0 6 6.8V8.3a8.4 8.4 0 0 0 4.8 1.5V6.2a4.8 4.8 0 0 1-4.8-4.8z" fill="#fff" />
  </svg>
)
const MailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
  </svg>
)

const providers = [
  { id: 'qr', label: 'Použiť QR kód', icon: QrIcon },
  { id: 'email', label: 'Použiť telefón alebo e-mail', icon: UserIcon },
  { id: 'instagram', label: 'Sleduj nás na Instagrame', icon: InstagramIcon, link: 'instagram' },
  { id: 'tiktok', label: 'Sleduj nás na TikToku', icon: TikTokIcon, link: 'tiktok' },
  { id: 'contact', label: 'Napíš nám e-mail', icon: MailIcon, link: 'email' },
]

// odkaz pre tlačidlo (e-mail → mailto:)
const hrefFor = (key) => {
  const v = LINKS[key]
  if (!v) return null
  return key === 'email' ? `mailto:${v}` : v
}

function ProviderButton({ p, onClick }) {
  const Icon = p.icon
  const href = p.link ? hrefFor(p.link) : null
  const Tag = href ? 'a' : 'button'
  return (
    <Tag
      {...(href
        ? { href, target: href.startsWith('http') ? '_blank' : undefined, rel: 'noreferrer' }
        : { onClick: () => onClick(p) })}
      className="relative flex h-[52px] w-full items-center justify-center rounded-full bg-white/[0.08] px-12 whitespace-nowrap text-[16px] font-semibold transition hover:bg-white/[0.13] sm:h-14 sm:text-[17px]"
    >
      <span className="absolute left-5 grid w-6 place-items-center">
        <Icon />
      </span>
      {p.label}
    </Tag>
  )
}

// kým nie je hotové prihlásenie cez Supabase, okno sa nedá zavrieť
// (false = vráti sa tlačidlo „Preskočiť“, klik mimo okna aj Esc)
const LOGIN_REQUIRED = true

export default function LoginModal() {
  const { loginOpen, closeLogin, showToast } = useStore()
  const [view, setView] = useState('providers') // providers | email
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!loginOpen) return
    setView('providers')
    if (LOGIN_REQUIRED) return
    const onKey = (e) => e.key === 'Escape' && closeLogin()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [loginOpen, closeLogin])

  if (!loginOpen) return null


  // TODO Supabase: sem napoj prihlásenie
  //   google / facebook / apple → supabase.auth.signInWithOAuth({ provider: id })
  const onProvider = (p) => {
    if (p.id === 'email') return setView('email')
    if (p.link) return showToast('Odkaz čoskoro doplníme')
    showToast('Prihlásenie pripravujeme')
  }

  // TODO Supabase:
  //   prihlásenie → supabase.auth.signInWithPassword({ email, password })
  const onEmailSubmit = (e) => {
    e.preventDefault()
    showToast('Prihlásenie pripravujeme')
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <div
        onClick={LOGIN_REQUIRED ? undefined : closeLogin}
        className="intro-in absolute inset-0 bg-black/55 backdrop-blur-xl"
      />

      <div className="sheet-up relative flex max-h-[100dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-[#252525] sm:w-[480px] sm:max-h-[min(720px,92dvh)] sm:rounded-2xl">
        {/* horná lišta */}
        <div className="flex h-14 shrink-0 items-center justify-between px-4">
          {view === 'email' ? (
            <button onClick={() => setView('providers')} aria-label="Späť" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10">
              <ChevronLeft size={22} />
            </button>
          ) : (
            <span />
          )}
          {!LOGIN_REQUIRED && (
            <button onClick={closeLogin} className="px-2 py-2 text-[16px] font-medium text-white/80 hover:text-white sm:text-[17px]">
              Preskočiť
            </button>
          )}
        </div>

        <div className="thin-scrollbar flex-1 overflow-y-auto px-5 pb-6 sm:px-10">
          <div className="mb-3 flex justify-center pt-1">
            <Logo height={34} />
          </div>
          <h2 className="mb-7 text-center text-[26px] font-bold leading-tight sm:text-[30px]">
            Prihlás sa
          </h2>

          {view === 'providers' ? (
            <div className="space-y-3">
              {providers.map((p) => (
                <ProviderButton key={p.id} p={p} onClick={onProvider} />
              ))}
            </div>
          ) : (
            <form onSubmit={onEmailSubmit} className="space-y-3">
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                autoComplete="email"
                className="h-[52px] w-full rounded-lg bg-white/[0.08] px-4 text-[16px] outline-none placeholder:text-white/40 focus:ring-1 focus:ring-white/30"
              />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Heslo"
                autoComplete="current-password"
                className="h-[52px] w-full rounded-lg bg-white/[0.08] px-4 text-[16px] outline-none placeholder:text-white/40 focus:ring-1 focus:ring-white/30"
              />
              <button type="button" onClick={() => showToast('Obnova hesla pripravujeme')} className="text-[14px] font-medium text-white/60 hover:text-white">
                Zabudol si heslo?
              </button>
              <button
                type="submit"
                disabled={!email || password.length < 6}
                className="h-[52px] w-full rounded-lg bg-brand text-[16px] font-semibold transition hover:bg-brand-hover disabled:bg-white/[0.08] disabled:text-white/35"
              >
                Prihlásiť sa
              </button>
            </form>
          )}

          <p className="mt-10 text-center text-[13px] leading-relaxed text-white/50">
            Prihlasuješ sa do účtu ejajads – platformy s AI video reklamami a reels, ktorú čoskoro spúšťame.
            Pokračovaním súhlasíš s{' '}
            <a href="#" className="text-white/90 hover:underline">Podmienkami používania</a> ejajads a potvrdzuješ, že si si prečítal{' '}
            <a href="https://portfolio.leofudaly.com/gdpr" target="_blank" rel="noreferrer" className="text-white/90 hover:underline">
              Zásady ochrany osobných údajov
            </a>
            .
          </p>
        </div>

        {/* spodok */}
        <div className="shrink-0 border-t border-white/10 py-5 pb-[max(env(safe-area-inset-bottom),20px)] text-center text-[16px]">
          Nechceš nič zmeškať?{' '}
          {hrefFor('newsletter') ? (
            <a href={hrefFor('newsletter')} target="_blank" rel="noreferrer" className="font-semibold text-brand hover:underline">
              Prihlás sa na newsletter
            </a>
          ) : (
            <button onClick={() => showToast('Newsletter čoskoro spustíme')} className="font-semibold text-brand hover:underline">
              Prihlás sa na newsletter
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
