import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { accounts, formatCount, owner, videos } from '../data/videos'
import { useStore } from '../lib/store'
import { Avatar } from '../components/Brand'
import { ProfileGrid } from '../components/VideoGrid'
import VideoModal from '../components/VideoModal'
import { BookmarkOutline, ChevronLeft, GridIcon, HeartOutline, LinkIcon, MailIcon, RepostIcon, ShareIcon } from '../components/Icons'

const sorts = [
  { id: 'new', label: 'Najnovšie' },
  { id: 'popular', label: 'Populárne' },
  { id: 'old', label: 'Najstaršie' },
]

export default function Profile() {
  const { profile = '' } = useParams()
  const navigate = useNavigate()
  const handle = profile.replace(/^@/, '')
  const { liked, saved, followed, toggleFollow, showToast } = useStore()
  const [tab, setTab] = useState('videos')
  const [sort, setSort] = useState('new')
  const [open, setOpen] = useState(null)

  const isOwner = handle === owner.handle
  const accountKey = Object.keys(accounts).find((k) => accounts[k].handle === handle)
  const account = isOwner ? owner : accounts[accountKey]

  const base = useMemo(() => (isOwner ? videos : videos.filter((v) => v.account === accountKey)), [isOwner, accountKey])

  const list = useMemo(() => {
    let l = base
    if (tab === 'reposts') l = videos.filter((v) => v.concept)
    if (tab === 'saved') l = videos.filter((v) => saved.has(v.id))
    if (tab === 'liked') l = videos.filter((v) => liked.has(v.id))
    // poradie v dátach = od najnovšieho
    if (sort === 'new') return l
    if (sort === 'old') return [...l].reverse()
    return [...l].sort((a, b) => b.views - a.views)
  }, [base, tab, sort, liked, saved])

  if (!account || !profile.startsWith('@')) {
    return (
      <div className="grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <p className="text-[20px] font-bold">Účet sa nenašiel</p>
          <Link to="/" className="mt-4 inline-block rounded-md bg-brand px-5 py-2.5 font-semibold">Späť na Pre teba</Link>
        </div>
      </div>
    )
  }

  const totalLikes = base.reduce((s, v) => s + v.likes, 0)
  const isFollowed = !isOwner && followed.has(accountKey)
  const mail = `mailto:${owner.email}?subject=${encodeURIComponent('Dopyt – video reklama')}`

  const tabs = isOwner
    ? [
        { id: 'videos', label: 'Videá', icon: GridIcon },
        { id: 'reposts', label: 'Ukážky', icon: RepostIcon },
        { id: 'saved', label: 'Obľúbené', icon: BookmarkOutline },
        { id: 'liked', label: 'Lajkované', icon: HeartOutline },
      ]
    : [{ id: 'videos', label: 'Videá', icon: GridIcon }]

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(location.href)
      showToast('Odkaz na profil skopírovaný')
    } catch { /* nevadí */ }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-0 pb-24 sm:px-6 md:px-8 md:pb-10 md:pt-8 lg:px-10">
      {/* mobil hlavička */}
      <div className="sticky top-0 z-20 flex h-12 items-center justify-between bg-black/90 px-3 backdrop-blur md:hidden">
        <button onClick={() => navigate(-1)} aria-label="Späť" className="grid h-10 w-10 place-items-center">
          <ChevronLeft />
        </button>
        <div className="font-semibold">{account.name}</div>
        <button onClick={copyLink} aria-label="Zdieľať" className="grid h-10 w-10 place-items-center">
          <ShareIcon size={20} />
        </button>
      </div>

      {/* hlavička profilu */}
      <header className="flex flex-col items-center gap-4 px-4 pt-4 text-center sm:flex-row sm:items-start sm:gap-8 sm:px-0 sm:text-left md:pt-0">
        <div className="shrink-0">
          <Avatar account={isOwner ? null : account} size={96} className="sm:hidden!" />
          <Avatar account={isOwner ? null : account} size={180} className="hidden! sm:grid! lg:hidden!" />
          <Avatar account={isOwner ? null : account} size={212} className="hidden! lg:grid!" />
        </div>
        <div className="min-w-0 flex-1 sm:pt-2">
          <div className="flex flex-col items-center gap-x-3 gap-y-1 sm:flex-row sm:items-baseline">
            <h1 className="text-[24px] font-bold leading-tight md:text-[28px]">{account.name}</h1>
            <span className="text-[17px] text-white/60">{account.handle}</span>
          </div>

          <div className="mt-3 flex justify-center gap-5 text-[16px] sm:justify-start md:text-[17px]">
            <span><b className="font-bold">{isOwner ? owner.following : 1}</b> <span className="text-white/60">Sledujem</span></span>
            <span><b className="font-bold">{isOwner ? owner.followers : base.length * 128 + (isFollowed ? 1 : 0)}</b> <span className="text-white/60">Sledujúci</span></span>
            <span><b className="font-bold">{isOwner ? owner.likes : formatCount(totalLikes)}</b> <span className="text-white/60">Lajky</span></span>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            {isOwner ? (
              <>
                <a href={mail} className="flex h-10 items-center gap-2 rounded-lg bg-brand px-6 font-semibold hover:bg-brand-hover">
                  <MailIcon size={18} /> Objednať video
                </a>
                <a href={owner.instagram} target="_blank" rel="noreferrer" className="flex h-10 items-center rounded-lg bg-elev px-5 font-semibold hover:bg-elev-2">
                  Instagram
                </a>
              </>
            ) : (
              <>
                <button
                  onClick={() => toggleFollow(accountKey)}
                  className={`h-10 min-w-[140px] rounded-lg px-6 font-semibold ${isFollowed ? 'bg-elev hover:bg-elev-2' : 'bg-brand hover:bg-brand-hover'}`}
                >
                  {isFollowed ? 'Sledujete' : 'Sledovať'}
                </button>
                <a href={mail} className="flex h-10 items-center rounded-lg bg-elev px-5 font-semibold hover:bg-elev-2">
                  Chcem podobné
                </a>
              </>
            )}
            <button onClick={copyLink} aria-label="Zdieľať profil" className="hidden h-10 w-10 place-items-center rounded-lg bg-elev hover:bg-elev-2 sm:grid">
              <ShareIcon size={18} />
            </button>
          </div>

          <p className="mx-auto mt-4 max-w-[560px] whitespace-pre-line text-[15px] leading-relaxed text-white/90 sm:mx-0">
            {isOwner ? owner.bio : account.desc}
          </p>
          <a
            href={isOwner ? owner.linkUrl : account.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-[15px] font-semibold hover:underline"
          >
            <LinkIcon size={16} /> {isOwner ? owner.link : account.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
          </a>
        </div>
      </header>

      {/* záložky + triedenie */}
      <div className="sticky top-12 z-10 mt-6 flex items-end justify-between gap-4 border-b border-line bg-black md:top-0 md:mt-8">
        <div className="no-scrollbar flex flex-1 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex h-12 flex-1 items-center justify-center gap-2 px-4 text-[16px] font-semibold transition sm:flex-none sm:px-6 md:text-[17px] xl:px-8 ${
                  active ? 'text-white' : 'text-white/50 hover:text-white/80'
                }`}
              >
                <Icon size={18} />
                <span className={tabs.length > 1 ? 'hidden sm:inline' : ''}>{t.label}</span>
                {active && <span className="absolute inset-x-0 bottom-0 h-[2px] bg-white" />}
              </button>
            )
          })}
        </div>
        <div className="mb-2 hidden shrink-0 rounded-lg bg-elev p-1 xl:flex">
          {sorts.map((s) => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              className={`rounded-md px-3 py-1.5 text-[14px] font-semibold transition ${sort === s.id ? 'bg-elev-2 text-white' : 'text-white/60 hover:text-white'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-0.5 sm:mt-5">
        {list.length ? (
          <ProfileGrid list={list} onOpen={(v) => setOpen(list.findIndex((x) => x.id === v.id))} />
        ) : (
          <div className="py-20 text-center">
            <p className="text-[18px] font-bold">{tab === 'liked' ? 'Zatiaľ žiadne lajky' : 'Zatiaľ nič uložené'}</p>
            <p className="mt-1 text-white/60">
              {tab === 'liked' ? 'Dvojklikom na video mu dáš srdiečko.' : 'Ulož si video cez záložku vo feede.'}
            </p>
          </div>
        )}
      </div>

      {open != null && <VideoModal list={list} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </div>
  )
}
