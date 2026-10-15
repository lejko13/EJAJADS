import { Link } from 'react-router-dom'
import { accounts, videos } from '../data/videos'
import { useStore } from '../lib/store'
import { Avatar } from '../components/Brand'
import Feed from './Feed'

// prázdny stav – návrhy účtov na sledovanie (ako tiktok)
function Suggestions() {
  const { followed, toggleFollow } = useStore()
  return (
    <div className="mx-auto max-w-[1100px] px-3 pb-24 pt-16 sm:px-6 md:pt-8">
      <h1 className="mb-1 text-[22px] font-bold">Zatiaľ nikoho nesleduješ</h1>
      <p className="mb-6 text-white/60">Sleduj klientov a ich videá uvidíš tu.</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Object.entries(accounts).map(([key, a]) => {
          const first = videos.find((v) => v.account === key)
          const isF = followed.has(key)
          return (
            <div key={key} className="relative aspect-[3/4] overflow-hidden rounded-lg bg-elev">
              <video src={first.src} poster={first.poster} muted loop autoPlay playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center p-3 text-center">
                <Link to={`/@${a.handle}`}>
                  <Avatar account={a} size={52} className="ring-2 ring-white/20" />
                </Link>
                <div className="mt-2 w-full truncate font-semibold">{a.name}</div>
                <div className="w-full truncate text-[13px] text-white/60">{a.handle}</div>
                <button
                  onClick={() => toggleFollow(key)}
                  className={`mt-3 h-9 w-full rounded-md text-[15px] font-semibold ${isF ? 'bg-white/20' : 'bg-brand hover:bg-brand-hover'}`}
                >
                  {isF ? 'Sledujete' : 'Sledovať'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Following() {
  const { followed } = useStore()
  const list = videos.filter((v) => followed.has(v.account))
  if (!list.length) return <Suggestions />
  return <Feed key={[...followed].sort().join()} list={list} />
}
