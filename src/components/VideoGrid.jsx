import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { formatCount, getAccount } from '../data/videos'
import { Avatar } from './Brand'
import { HeartOutline, PlayOutline } from './Icons'

// náhľad – pri hoveri sa prehrá video
function Thumb({ video, onOpen, children, rounded = 'rounded-lg' }) {
  const ref = useRef(null)
  return (
    <button
      onClick={() => onOpen(video)}
      onMouseEnter={() => ref.current?.play().catch(() => {})}
      onMouseLeave={() => {
        if (!ref.current) return
        ref.current.pause()
        ref.current.currentTime = 0
      }}
      className={`group relative block aspect-[3/4] w-full overflow-hidden bg-elev ${rounded}`}
    >
      <img src={video.poster} alt={video.caption} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <video
        ref={ref}
        src={video.src}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
      {children}
    </button>
  )
}

// mriežka na profile
export function ProfileGrid({ list, onOpen }) {
  return (
    <div className="grid grid-cols-3 gap-0.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 md:gap-4">
      {list.map((v) => (
        <div key={v.id}>
          <Thumb video={v} onOpen={onOpen} rounded="rounded-sm sm:rounded-lg">
            <span className="absolute bottom-2 left-2 flex items-center gap-1 text-[13px] font-semibold sm:text-[15px]">
              <PlayOutline size={16} strokeWidth={2.4} /> {formatCount(v.views)}
            </span>
            {v.concept && (
              <span className="absolute left-2 top-2 rounded bg-brand px-1.5 py-0.5 text-[11px] font-semibold">Ukážka</span>
            )}
          </Thumb>
          <p className="mt-1.5 hidden truncate text-[14px] text-white/80 sm:block">{v.caption}</p>
        </div>
      ))}
    </div>
  )
}

// mriežka na preskúmať – s popisom a účtom
export function ExploreGrid({ list, onOpen }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {list.map((v) => {
        const a = getAccount(v.account)
        return (
          <div key={v.id}>
            <Thumb video={v} onOpen={onOpen} />
            <p className="mt-2 line-clamp-2 text-[15px] leading-snug">{v.caption}</p>
            <div className="mt-1.5 flex items-center justify-between gap-2 text-[13px] text-muted">
              <Link to={`/@${a.handle}`} className="flex min-w-0 items-center gap-1.5 hover:text-white">
                <Avatar account={a} size={22} />
                <span className="truncate">{a.handle}</span>
              </Link>
              <span className="flex shrink-0 items-center gap-1">
                <HeartOutline size={15} /> {formatCount(v.likes)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
