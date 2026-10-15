import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useSearchParams } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer'
import ActionBar from '../components/ActionBar'
import InfoDrawer from '../components/InfoPanel'
import { useStore } from '../lib/store'
import { ChevronDown, ChevronUp, LiveIcon, SearchIcon } from '../components/Icons'

const mobileTabs = [
  { to: '/reklamy', label: 'Reklamy' },
  { to: '/reels', label: 'Reels' },
  { to: '/', label: 'Pre teba' },
]

export default function Feed({ list }) {
  const [params, setParams] = useSearchParams()
  const scroller = useRef(null)
  const items = useRef([])
  const [active, setActive] = useState(0)
  const { setInfoVideo } = useStore()

  const goTo = useCallback((i, smooth = true) => {
    const el = items.current[i]
    if (el) el.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'start' })
  }, [])

  // ?v=id → skoč na video
  useEffect(() => {
    const id = params.get('v')
    if (!id) return
    const i = list.findIndex((v) => v.id === id)
    if (i >= 0) {
      setActive(i)
      requestAnimationFrame(() => goTo(i, false))
    }
    params.delete('v')
    setParams(params, { replace: true })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ktoré video je na obrazovke – podľa pozície scrollu
  useEffect(() => {
    const el = scroller.current
    let raf
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (!el.clientHeight) return
        setActive(Math.min(list.length - 1, Math.round(el.scrollTop / el.clientHeight)))
      })
    }
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [list])

  // šípky na klávesnici
  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        goTo(Math.min(active + 1, list.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        goTo(Math.max(active - 1, 0))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, list.length, goTo])

  return (
    <div className="relative">
      {/* mobil – horné záložky ako v appke */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent px-4 pb-6 pt-[max(env(safe-area-inset-top),12px)] md:hidden">
        <Link to="/explore" aria-label="Preskúmať" className="pointer-events-auto">
          <LiveIcon size={26} />
        </Link>
        <nav className="pointer-events-auto flex items-center gap-5 text-[17px] font-semibold">
          {mobileTabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end
              className={({ isActive }) =>
                `relative pb-1.5 transition ${isActive ? 'text-white after:absolute after:bottom-0 after:left-1/2 after:h-[3px] after:w-7 after:-translate-x-1/2 after:rounded-full after:bg-white' : 'text-white/65'}`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/explore?focus=1" aria-label="Hľadať" className="pointer-events-auto">
          <SearchIcon size={26} strokeWidth={2.4} />
        </Link>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar h-[calc(100dvh-3.5rem-env(safe-area-inset-bottom))] snap-y snap-mandatory overflow-y-auto md:h-dvh"
      >
        {list.map((video, i) => (
          <section
            key={video.id}
            ref={(el) => (items.current[i] = el)}
            data-index={i}
            className="relative flex h-full snap-start snap-always items-center justify-center md:py-4"
          >
            <div className="relative flex h-full w-full items-end justify-center md:w-auto md:gap-4">
              <VideoPlayer
                video={video}
                active={i === active}
                near={Math.abs(i - active) <= 1}
                onMore={() => setInfoVideo(video)}
                className="h-full w-full md:aspect-[9/16] md:w-auto md:max-w-[calc(100vw-72px-180px)] md:rounded-2xl"
              />
              <ActionBar video={video} className="absolute bottom-28 right-2 z-10 md:static md:pb-1" />
            </div>
          </section>
        ))}
      </div>

      {/* desktop – šípky hore / dole */}
      <div className="fixed right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-4 md:flex">
        <button
          onClick={() => goTo(Math.max(active - 1, 0))}
          disabled={active === 0}
          aria-label="Predchádzajúce video"
          className="grid h-12 w-12 place-items-center rounded-full bg-elev transition hover:bg-elev-2 disabled:opacity-30"
        >
          <ChevronUp size={24} />
        </button>
        <button
          onClick={() => goTo(Math.min(active + 1, list.length - 1))}
          disabled={active === list.length - 1}
          aria-label="Ďalšie video"
          className="grid h-12 w-12 place-items-center rounded-full bg-elev transition hover:bg-elev-2 disabled:opacity-30"
        >
          <ChevronDown size={24} />
        </button>
      </div>

      <InfoDrawer
        onPick={(v) => {
          const i = list.findIndex((x) => x.id === v.id)
          if (i >= 0) goTo(i)
        }}
      />
    </div>
  )
}
