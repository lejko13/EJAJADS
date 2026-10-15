import { useEffect, useState } from 'react'
import { useStore } from '../lib/store'
import { supabase, authErrorSk } from '../lib/supabase'
import { ChevronLeft } from './Icons'

/* ── ikonky poskytovateľov ─────────────────────────────── */
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
}

// ikonky ako obrázky (public/icons) – vždy v pôvodnom pomere strán
const ImgIcon = ({ src, w = 24, h = 24, rounded = '' }) => (
  <img src={src} alt="" width={w} height={h} draggable={false} className={`block select-none object-contain ${rounded}`} style={{ width: w, height: h }} />
)
const InstagramIcon = () => <ImgIcon src="/icons/instagram.png" rounded="rounded-[6px]" />
const TikTokIcon = () => <ImgIcon src="/icons/tiktok.png" rounded="rounded-[6px]" />
const GmailIcon = () => <ImgIcon src="/icons/gmail.png" w={24} h={18} />

const providers = [
  { id: 'email', label: 'Prihlásiť sa', icon: UserIcon },
  { id: 'instagram', label: 'Sleduj nás na Instagrame', icon: InstagramIcon, link: 'instagram' },
  { id: 'tiktok', label: 'Sleduj nás na TikToku', icon: TikTokIcon, link: 'tiktok' },
  { id: 'contact', label: 'Napíš nám e-mail', icon: GmailIcon, link: 'email' },
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

// true = neprihlásený návštevník nevidí web, kým sa neprihlási
// (false = vráti sa tlačidlo „Preskočiť“, klik mimo okna aj Esc)
const LOGIN_REQUIRED = true

const inputCls =
  'h-[52px] w-full rounded-lg bg-white/[0.08] px-4 text-[16px] outline-none placeholder:text-white/40 focus:ring-1 focus:ring-white/30'

export default function LoginModal() {
  const { user, loginOpen, closeLogin, showToast } = useStore()
  const [view, setView] = useState('providers') // providers | email | newsletter | subscribed
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const mustLogin = LOGIN_REQUIRED && user === null
  const show = loginOpen || mustLogin
  const closable = !mustLogin

  useEffect(() => {
    if (!show || !closable) return
    const onKey = (e) => e.key === 'Escape' && closeLogin()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [show, closable, closeLogin])

  // kým zisťujeme, či je niekto prihlásený – len rozmazané pozadie
  if (LOGIN_REQUIRED && user === undefined) {
    return <div className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-xl" />
  }
  if (!show) return null

  const onProvider = (p) => {
    if (p.id === 'email') {
      setError('')
      return setView('email')
    }
    if (p.link) return showToast('Odkaz čoskoro doplníme')
  }

  // Supabase len overí e-mail + heslo (účty sa vytvárajú v Supabase → Authentication → Users)
  const onEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) return setError(authErrorSk(error))
    setPassword('')
    setView('providers')
    showToast('Si prihlásený')
  }

  // newsletter → tabuľka „newsletter“ v Supabase (Table Editor → newsletter)
  const onNewsletterSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error } = await supabase.from('newsletter').insert({ email: email.trim().toLowerCase() })
    setBusy(false)
    // 23505 = e-mail už v zozname je → pre návštevníka je to tiež úspech
    if (error && error.code !== '23505') return setError('Nepodarilo sa prihlásiť. Skús to znova.')
    setView('subscribed')
  }

  const isNewsletter = view === 'newsletter' || view === 'subscribed'
  const title =
    isNewsletter ? (
      'Newsletter'
    ) : (
      <>
        Prihlás sa do EJAJADS<sup className="ml-0.5 align-super text-[0.45em] font-semibold">™</sup>
      </>
    )

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <div
        onClick={closable ? closeLogin : undefined}
        className="intro-in absolute inset-0 bg-black/55 backdrop-blur-xl"
      />

      <div className="sheet-up relative flex max-h-[100dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-[#252525] sm:w-[480px] sm:max-h-[min(720px,92dvh)] sm:rounded-2xl">
        {/* horná lišta */}
        <div className="flex h-14 shrink-0 items-center justify-between px-4">
          {view !== 'providers' ? (
            <button onClick={() => { setError(''); setView('providers') }} aria-label="Späť" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10">
              <ChevronLeft size={22} />
            </button>
          ) : (
            <span />
          )}
          {closable && (
            <button onClick={closeLogin} className="px-2 py-2 text-[16px] font-medium text-white/80 hover:text-white sm:text-[17px]">
              Preskočiť
            </button>
          )}
        </div>

        <div className="thin-scrollbar flex-1 overflow-y-auto px-5 pb-6 sm:px-10">
          {title && (
            <h2 className={`text-center text-[26px] font-bold leading-tight sm:text-[30px] ${isNewsletter ? 'mb-7' : 'mb-2'}`}>
              {title}
            </h2>
          )}
          {!isNewsletter && (
            <p className="mb-7 text-center text-[13px] leading-relaxed text-white/50">
              Pre objednanie reklamy nás kontaktujte.
            </p>
          )}

          {view === 'providers' && (
            <div className="space-y-3">
              {providers.map((p) => (
                <ProviderButton key={p.id} p={p} onClick={onProvider} />
              ))}
            </div>
          )}

          {view === 'email' && (
            <form onSubmit={onEmailSubmit} className="space-y-3">
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                autoComplete="email"
                className={inputCls}
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Heslo"
                autoComplete="current-password"
                className={inputCls}
              />
              {error && <p className="text-[14px] font-medium text-brand">{error}</p>}
              <button
                type="submit"
                disabled={busy || !email || !password}
                className="h-[52px] w-full rounded-lg bg-brand text-[16px] font-semibold transition hover:bg-brand-hover disabled:bg-white/[0.08] disabled:text-white/35"
              >
                {busy ? 'Chvíľku…' : 'Prihlásiť sa'}
              </button>
            </form>
          )}

          {view === 'newsletter' && (
            <form onSubmit={onNewsletterSubmit} className="space-y-3">
              <p className="pb-1 text-center text-[15px] leading-relaxed text-white/70">
                Zadaj e-mail a ako prvý sa dozvieš o spustení ejajads a novinkách.
              </p>
              <input
                type="email"
                required
                autoFocus
                maxLength={254}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                autoComplete="email"
                className={inputCls}
              />
              {error && <p className="text-[14px] font-medium text-brand">{error}</p>}
              <button
                type="submit"
                disabled={busy || !email}
                className="h-[52px] w-full rounded-lg bg-brand text-[16px] font-semibold transition hover:bg-brand-hover disabled:bg-white/[0.08] disabled:text-white/35"
              >
                {busy ? 'Chvíľku…' : 'Prihlásiť sa na newsletter'}
              </button>
              <p className="text-center text-[12px] leading-relaxed text-white/45">
                Odhlásiť sa môžeš kedykoľvek – stačí nám napísať.
              </p>
            </form>
          )}

          {view === 'subscribed' && (
            <div className="space-y-2 text-center">
              <p className="text-[17px] font-semibold">Hotovo, si v zozname ✓</p>
              <p className="text-[15px] text-white/65">Ozveme sa ti na {email.trim().toLowerCase()}, keď bude čo nové.</p>
            </div>
          )}

          <p className="mt-10 text-center text-[13px] leading-relaxed text-white/50">
            Na webe EJAJADS™ ešte pracujeme – čoskoro ho spúšťame naplno. Ďakujeme za trpezlivosť.
          </p>
        </div>

        {/* spodok */}
        <div className="shrink-0 border-t border-white/10 py-5 pb-[max(env(safe-area-inset-bottom),20px)] text-center text-[16px]">
          Nechceš nič zmeškať?{' '}
          <button
            onClick={() => {
              setError('')
              setView('newsletter')
            }}
            className="font-semibold text-brand hover:underline"
          >
            Prihlás sa na newsletter
          </button>
        </div>
      </div>
    </div>
  )
}
