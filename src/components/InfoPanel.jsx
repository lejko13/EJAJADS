import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { getAccount, owner, videos } from '../data/videos'
import { Avatar } from './Brand'
import { CloseIcon, LinkIcon, MailIcon, PlayIcon } from './Icons'

// obsah "komentárov" = info o projekte
export function InfoContent({ video, onPick }) {
  const { followed, toggleFollow } = useStore()
  const account = getAccount(video.account)
  const more = videos.filter((v) => v.account === video.account && v.id !== video.id)
  const isFollowed = followed.has(video.account)
  const mail = `mailto:${owner.email}?subject=${encodeURIComponent('Chcem video ako ' + account.name)}`

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link to={`/@${account.handle}`}>
          <Avatar account={account} size={44} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link to={`/@${account.handle}`} className="block truncate font-semibold hover:underline">
            {account.name}
          </Link>
          <div className="truncate text-[13px] text-muted">{account.category}</div>
        </div>
        <button
          onClick={() => toggleFollow(video.account)}
          className={`h-9 shrink-0 rounded-md px-4 text-[14px] font-semibold transition ${
            isFollowed ? 'bg-elev-2 text-white' : 'bg-brand hover:bg-brand-hover'
          }`}
        >
          {isFollowed ? 'Sledujete' : 'Sledovať'}
        </button>
      </div>

      <p className="text-[15px] leading-relaxed text-white/85">{account.desc}</p>

      <div>
        <div className="mb-2 text-[13px] font-semibold text-muted">Použité nástroje</div>
        <div className="flex flex-wrap gap-2">
          {account.tech.map((t) => (
            <span key={t} className="rounded-full bg-elev px-3 py-1.5 text-[13px] font-medium">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a href={mail} className="flex h-11 items-center justify-center gap-2 rounded-lg bg-brand text-[15px] font-semibold hover:bg-brand-hover">
          <MailIcon size={18} /> Chcem podobné
        </a>
        <a
          href={account.url}
          target="_blank"
          rel="noreferrer"
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-elev text-[15px] font-semibold hover:bg-elev-2"
        >
          <LinkIcon size={18} /> Web klienta
        </a>
      </div>

      {more.length > 0 && (
        <div>
          <div className="mb-2 text-[13px] font-semibold text-muted">Ďalšie videá – {account.name}</div>
          <div className="grid grid-cols-3 gap-1.5">
            {more.map((m) => (
              <button
                key={m.id}
                onClick={() => onPick?.(m)}
                className="relative aspect-[9/16] overflow-hidden rounded-md bg-elev"
              >
                <img src={m.poster} alt="" loading="lazy" className="h-full w-full object-cover transition hover:scale-105" />
                <span className="absolute bottom-1 left-1.5 flex items-center gap-1 text-[12px] font-semibold [text-shadow:0_1px_2px_rgba(0,0,0,.6)]">
                  <PlayIcon size={11} /> {m.views >= 1000 ? (m.views / 1000).toFixed(1) + 'K' : m.views}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// vysúvací panel (desktop sprava, mobil zdola)
export default function InfoDrawer({ onPick }) {
  const { infoVideo, setInfoVideo } = useStore()

  useEffect(() => {
    if (!infoVideo) return
    const onKey = (e) => e.key === 'Escape' && setInfoVideo(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [infoVideo, setInfoVideo])

  if (!infoVideo) return null
  return (
    <div className="fixed inset-0 z-50">
      <button aria-label="Zavrieť" onClick={() => setInfoVideo(null)} className="absolute inset-0 bg-black/40 md:bg-black/20" />
      <aside className="sheet-up md:slide-left thin-scrollbar absolute inset-x-0 bottom-0 max-h-[78dvh] overflow-y-auto rounded-t-2xl bg-panel md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[420px] md:rounded-none md:border-l md:border-line">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-panel px-5 py-4">
          <div className="font-semibold">O projekte</div>
          <button onClick={() => setInfoVideo(null)} aria-label="Zavrieť" className="grid h-9 w-9 place-items-center rounded-full bg-elev hover:bg-elev-2">
            <CloseIcon size={18} />
          </button>
        </div>
        <div className="px-5 py-5">
          <InfoContent
            video={infoVideo}
            onPick={(v) => {
              setInfoVideo(null)
              onPick?.(v)
            }}
          />
        </div>
      </aside>
    </div>
  )
}
