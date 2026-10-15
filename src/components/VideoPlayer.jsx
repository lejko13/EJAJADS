import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { getAccount } from '../data/videos'
import { HeartIcon, MoreIcon, MusicIcon, PlayIcon, VolumeOffIcon, VolumeOnIcon } from './Icons'

/**
 * Jedno video – play/pause podľa `active`, src sa načíta iba keď je `near`.
 * Klik = pauza, dvojklik = like so srdiečkom.
 */
export default function VideoPlayer({ video, active, near = true, className = '', caption = true, onMore }) {
  const ref = useRef(null)
  const bar = useRef(null)
  const clickTimer = useRef()
  const { muted, setMuted, addLike } = useStore()
  const [paused, setPaused] = useState(false)
  const [hearts, setHearts] = useState([])
  const [expanded, setExpanded] = useState(false)
  const account = getAccount(video.account)

  // play / pause podľa aktívneho videa
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (active) {
      setPaused(false)
      el.muted = muted
      const p = el.play()
      if (p) p.catch(() => {
        // autoplay so zvukom zablokovaný → stlmiť a skúsiť znova
        el.muted = true
        setMuted(true)
        el.play().catch(() => setPaused(true))
      })
    } else {
      el.pause()
      try { el.currentTime = 0 } catch { /* ešte nenačítané */ }
      setExpanded(false)
    }
  }, [active, near]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (ref.current) ref.current.muted = muted
  }, [muted])

  // plynulý progress bar bez re-renderu
  useEffect(() => {
    if (!active) return
    let raf
    const tick = () => {
      const el = ref.current
      if (el && bar.current && el.duration) {
        bar.current.style.transform = `scaleX(${el.currentTime / el.duration})`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active])

  const togglePlay = () => {
    const el = ref.current
    if (!el) return
    if (el.paused) {
      el.play().catch(() => {})
      setPaused(false)
    } else {
      el.pause()
      setPaused(true)
    }
  }

  const onClick = (e) => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
      clickTimer.current = null
      const rect = e.currentTarget.getBoundingClientRect()
      const heart = { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top, r: Math.round(Math.random() * 40 - 20) }
      setHearts((h) => [...h, heart])
      setTimeout(() => setHearts((h) => h.filter((x) => x.id !== heart.id)), 900)
      addLike(video.id)
      return
    }
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null
      togglePlay()
    }, 230)
  }

  const seek = (e) => {
    const el = ref.current
    if (!el?.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    el.currentTime = ((e.clientX - rect.left) / rect.width) * el.duration
  }

  return (
    <div className={`relative overflow-hidden bg-[#0d0d0d] ${className}`}>
      {/* rozmazané pozadie pre 16:9 videá */}
      {video.landscape && (
        <img src={video.poster} alt="" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-50 blur-2xl" />
      )}

      <video
        ref={ref}
        src={near ? video.src : undefined}
        poster={video.poster}
        loop
        playsInline
        muted={muted}
        preload={near ? 'auto' : 'none'}
        onClick={onClick}
        className={`relative h-full w-full cursor-pointer ${video.landscape ? 'object-contain' : 'object-cover'}`}
      />

      {/* srdiečka po dvojkliku */}
      {hearts.map((h) => (
        <HeartIcon
          key={h.id}
          size={96}
          className="heart-pop pointer-events-none absolute text-brand drop-shadow-lg"
          style={{ left: h.x, top: h.y, '--r': `${h.r}deg` }}
        />
      ))}

      {/* pauza */}
      {paused && (
        <button
          onClick={togglePlay}
          aria-label="Prehrať"
          className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white/90 backdrop-blur-sm"
        >
          <PlayIcon size={40} />
        </button>
      )}

      {/* horná lišta – zvuk + viac */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between bg-gradient-to-b from-black/40 to-transparent p-3 pb-10 pt-[calc(max(env(safe-area-inset-top),12px)+44px)] md:p-4">
        <button
          onClick={() => setMuted(!muted)}
          aria-label={muted ? 'Zapnúť zvuk' : 'Stlmiť'}
          className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full text-white transition hover:bg-white/10"
        >
          {muted ? <VolumeOffIcon size={24} /> : <VolumeOnIcon size={24} />}
        </button>
        <button
          onClick={onMore}
          aria-label="Viac"
          className="pointer-events-auto hidden h-10 w-10 place-items-center rounded-full text-white transition hover:bg-white/10 md:grid"
        >
          <MoreIcon size={22} />
        </button>
      </div>

      {/* popis dole */}
      {caption && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-4 pb-5 pt-24 pr-20 md:pr-4">
          <Link
            to={`/@${account.handle}`}
            className="pointer-events-auto inline-flex items-center gap-1.5 text-[17px] font-semibold hover:underline"
          >
            {account.handle}
            {video.concept && (
              <span className="rounded bg-white/15 px-1.5 py-0.5 text-[11px] font-medium text-white/80">ukážka</span>
            )}
          </Link>
          <p
            onClick={() => setExpanded((x) => !x)}
            className={`pointer-events-auto mt-1 cursor-pointer text-[15px] leading-snug ${expanded ? '' : 'line-clamp-2'}`}
          >
            {video.caption}{' '}
            {video.tags.map((t) => (
              <Link key={t} to={`/explore?q=${t}`} onClick={(e) => e.stopPropagation()} className="font-semibold hover:underline">
                #{t}{' '}
              </Link>
            ))}
            <span className="font-semibold">#ejajads</span>
          </p>
          <div className="mt-2 flex items-center gap-2 text-[14px] text-white/90">
            <MusicIcon size={14} className="shrink-0" />
            <span className="truncate">pôvodný zvuk – {account.name}</span>
          </div>
        </div>
      )}

      {/* progress */}
      <div onClick={seek} className="group absolute inset-x-0 bottom-0 h-3 cursor-pointer">
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/20 transition-[height] group-hover:h-[5px]">
          <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-white" />
        </div>
      </div>
    </div>
  )
}
