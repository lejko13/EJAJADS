import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { accounts, videos } from '../data/videos'
import { ExploreGrid } from '../components/VideoGrid'
import VideoModal from '../components/VideoModal'
import { CloseIcon, SearchIcon } from '../components/Icons'

const chips = [
  { id: 'all', label: 'Všetko', test: () => true },
  { id: 'reklamy', label: 'Reklamy', test: (v) => v.type === 'reklamy' },
  { id: 'reels', label: 'Reels', test: (v) => v.type === 'reels' },
  { id: 'ai', label: 'AI videá', test: (v) => v.tags.some((t) => t.startsWith('ai')) },
  { id: 'concept', label: 'Ukážky pre značky', test: (v) => v.concept },
  ...Object.entries(accounts).map(([k, a]) => ({ id: k, label: a.name.replace(/ \(ukážka\)| \*+$/g, ''), test: (v) => v.account === k })),
]

export default function Explore() {
  const [params, setParams] = useSearchParams()
  const [chip, setChip] = useState('all')
  const [open, setOpen] = useState(null)
  const input = useRef(null)
  const q = params.get('q') ?? ''

  useEffect(() => {
    if (params.get('focus')) input.current?.focus()
  }, [params])

  const list = useMemo(() => {
    const c = chips.find((x) => x.id === chip)
    const s = q.trim().toLowerCase()
    return videos.filter(c.test).filter((v) => {
      if (!s) return true
      const a = accounts[v.account]
      return [v.caption, a.name, a.handle, ...v.tags].join(' ').toLowerCase().includes(s.replace(/^#/, ''))
    })
  }, [chip, q])

  const setQ = (val) => {
    const p = new URLSearchParams(params)
    val ? p.set('q', val) : p.delete('q')
    p.delete('focus')
    setParams(p, { replace: true })
  }

  return (
    <div className="mx-auto max-w-[1400px] px-3 pb-24 pt-3 sm:px-6 md:px-8 md:pb-10 md:pt-6 lg:px-10">
      {/* hľadanie – hlavne pre mobil */}
      <div className="relative mb-3 md:mb-4 md:max-w-[520px]">
        <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
        <input
          ref={input}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Hľadať videá, klientov, #tagy"
          className="h-11 w-full rounded-full bg-elev pl-11 pr-11 text-[16px] outline-none placeholder:text-white/40 focus:ring-1 focus:ring-white/30"
        />
        {q && (
          <button onClick={() => setQ('')} aria-label="Vymazať" className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-white/15">
            <CloseIcon size={14} />
          </button>
        )}
      </div>

      <div className="no-scrollbar sticky top-0 z-10 -mx-3 mb-5 flex gap-2 overflow-x-auto bg-black px-3 py-2 sm:mx-0 sm:px-0">
        {chips.map((c) => (
          <button
            key={c.id}
            onClick={() => setChip(c.id)}
            className={`h-9 shrink-0 rounded-lg px-4 text-[15px] font-semibold transition ${
              chip === c.id ? 'bg-white text-black' : 'bg-elev text-white hover:bg-elev-2'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {q && (
        <p className="mb-4 text-[15px] text-white/60">
          {list.length} {list.length === 1 ? 'video' : list.length < 5 ? 'videá' : 'videí'} pre „<span className="text-white">{q}</span>“
        </p>
      )}

      {list.length ? (
        <ExploreGrid list={list} onOpen={(v) => setOpen(list.findIndex((x) => x.id === v.id))} />
      ) : (
        <div className="py-24 text-center">
          <p className="text-[18px] font-bold">Nič sme nenašli</p>
          <p className="mt-1 text-white/60">Skús iné slovo alebo zruš filter.</p>
        </div>
      )}

      {open != null && <VideoModal list={list} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </div>
  )
}
