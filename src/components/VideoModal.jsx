import { useEffect, useRef } from 'react'
import VideoPlayer from './VideoPlayer'
import ActionBar from './ActionBar'
import InfoDrawer, { InfoContent } from './InfoPanel'
import { useStore } from '../lib/store'
import { formatCount } from '../data/videos'
import { BookmarkIcon, ChevronDown, ChevronUp, CloseIcon, CommentIcon, HeartIcon, ShareIcon } from './Icons'

// detail videa (ako tiktok po kliknutí na video v profile)
export default function VideoModal({ list, index, onChange, onClose }) {
  const video = list[index]
  const touch = useRef(null)
  const { liked, toggleLike, saved, toggleSave, share, setInfoVideo } = useStore()

  const prev = () => index > 0 && onChange(index - 1)
  const next = () => index < list.length - 1 && onChange(index + 1)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') next()
      if (e.key === 'ArrowUp') prev()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  })

  if (!video) return null
  const isLiked = liked.has(video.id)
  const isSaved = saved.has(video.id)

  return (
    <div className="fixed inset-0 z-50 flex bg-black">
      {/* video */}
      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden"
        onTouchStart={(e) => (touch.current = e.touches[0].clientY)}
        onTouchEnd={(e) => {
          if (touch.current == null) return
          const d = touch.current - e.changedTouches[0].clientY
          if (d > 60) next()
          if (d < -60) prev()
          touch.current = null
        }}
      >
        <img src={video.poster} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-3xl" />
        <VideoPlayer
          key={video.id}
          video={video}
          active
          onMore={() => setInfoVideo(video)}
          className="h-full w-full md:aspect-[9/16] md:w-auto"
        />
        <ActionBar video={video} className="absolute bottom-28 right-2 z-10 md:hidden" />

        <button
          onClick={onClose}
          aria-label="Zavrieť"
          className="absolute left-4 top-[max(env(safe-area-inset-top),16px)] z-20 grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur hover:bg-black/60 md:left-5 md:top-5 md:bg-elev/80"
        >
          <CloseIcon size={20} />
        </button>

        <div className="absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-4 md:flex">
          <button onClick={prev} disabled={index === 0} aria-label="Predchádzajúce" className="grid h-12 w-12 place-items-center rounded-full bg-elev/80 hover:bg-elev-2 disabled:opacity-30">
            <ChevronUp />
          </button>
          <button onClick={next} disabled={index === list.length - 1} aria-label="Ďalšie" className="grid h-12 w-12 place-items-center rounded-full bg-elev/80 hover:bg-elev-2 disabled:opacity-30">
            <ChevronDown />
          </button>
        </div>
      </div>

      {/* pravý panel – desktop */}
      <aside className="thin-scrollbar hidden w-[420px] shrink-0 overflow-y-auto border-l border-line bg-panel md:block xl:w-[480px]">
        <div className="border-b border-line p-5">
          <p className="text-[15px] leading-snug">
            {video.caption}{' '}
            {video.tags.map((t) => (
              <span key={t} className="font-semibold">#{t} </span>
            ))}
          </p>
          <div className="mt-4 flex items-center gap-5 text-[13px] font-semibold text-white/80">
            <button onClick={() => toggleLike(video.id)} className="flex items-center gap-1.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-elev" style={isLiked ? { color: '#fe2c55' } : undefined}>
                <HeartIcon size={18} />
              </span>
              {formatCount(video.likes + (isLiked ? 1 : 0))}
            </button>
            <span className="flex items-center gap-1.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-elev"><CommentIcon size={18} /></span>
              {formatCount(video.comments)}
            </span>
            <button onClick={() => toggleSave(video.id)} className="flex items-center gap-1.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-elev" style={isSaved ? { color: '#facd00' } : undefined}>
                <BookmarkIcon size={17} />
              </span>
              {formatCount(video.saves + (isSaved ? 1 : 0))}
            </button>
            <button onClick={() => share(video)} className="ml-auto flex items-center gap-1.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-elev"><ShareIcon size={17} /></span>
              {formatCount(video.shares)}
            </button>
          </div>
        </div>
        <div className="p-5">
          <InfoContent
            video={video}
            onPick={(v) => {
              const i = list.findIndex((x) => x.id === v.id)
              if (i >= 0) onChange(i)
            }}
          />
        </div>
      </aside>

      <InfoDrawer
        onPick={(v) => {
          const i = list.findIndex((x) => x.id === v.id)
          if (i >= 0) onChange(i)
        }}
      />
    </div>
  )
}
