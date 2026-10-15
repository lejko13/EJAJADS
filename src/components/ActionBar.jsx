import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { formatCount, getAccount } from '../data/videos'
import { Avatar } from './Brand'
import { BookmarkIcon, CheckIcon, CommentIcon, HeartIcon, PlusIcon, ShareIcon } from './Icons'

function Action({ icon, count, label, onClick, activeColor, active }) {
  const [bounce, setBounce] = useState(0)
  return (
    <button
      onClick={() => {
        setBounce((b) => b + 1)
        onClick?.()
      }}
      aria-label={label}
      className="group flex flex-col items-center gap-1"
    >
      <span
        key={bounce}
        className={`grid h-12 w-12 place-items-center rounded-full text-white transition drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)] md:bg-elev md:drop-shadow-none md:group-hover:bg-elev-2 ${bounce ? 'like-bounce' : ''}`}
        style={active ? { color: activeColor } : undefined}
      >
        {icon}
      </span>
      <span className="text-[12px] font-semibold text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,.4)] md:text-white/75 md:[text-shadow:none]">
        {count}
      </span>
    </button>
  )
}

export default function ActionBar({ video, className = '' }) {
  const { liked, toggleLike, saved, toggleSave, followed, toggleFollow, setInfoVideo, share } = useStore()
  const account = getAccount(video.account)
  const isLiked = liked.has(video.id)
  const isSaved = saved.has(video.id)
  const isFollowed = followed.has(video.account)

  return (
    <div className={`flex flex-col items-center gap-3.5 md:gap-4 ${className}`}>
      <div className="relative mb-2">
        <Link to={`/@${account.handle}`} aria-label={account.name}>
          <Avatar account={account} size={48} className="ring-1 ring-white/20" />
        </Link>
        <button
          onClick={() => toggleFollow(video.account)}
          aria-label={isFollowed ? 'Zrušiť sledovanie' : 'Sledovať'}
          className={`absolute -bottom-2.5 left-1/2 grid h-6 w-6 -translate-x-1/2 place-items-center rounded-full text-white transition ${
            isFollowed ? 'bg-white text-brand' : 'bg-brand'
          }`}
        >
          {isFollowed ? <CheckIcon size={13} /> : <PlusIcon size={13} />}
        </button>
      </div>

      <Action
        label="Páči sa mi"
        icon={<HeartIcon size={26} />}
        count={formatCount(video.likes + (isLiked ? 1 : 0))}
        onClick={() => toggleLike(video.id)}
        active={isLiked}
        activeColor="#fe2c55"
      />
      <Action
        label="O projekte"
        icon={<CommentIcon size={26} />}
        count={formatCount(video.comments)}
        onClick={() => setInfoVideo(video)}
      />
      <Action
        label="Uložiť"
        icon={<BookmarkIcon size={24} />}
        count={formatCount(video.saves + (isSaved ? 1 : 0))}
        onClick={() => toggleSave(video.id)}
        active={isSaved}
        activeColor="#facd00"
      />
      <Action
        label="Zdieľať"
        icon={<ShareIcon size={24} />}
        count={formatCount(video.shares)}
        onClick={() => share(video)}
      />

      <Link to={`/@${account.handle}`} aria-label="Zvuk" className="mt-1">
        <span className="disc-spin grid h-11 w-11 place-items-center rounded-full bg-[conic-gradient(#222,#444,#222,#444,#222)]">
          <Avatar account={account} size={26} />
        </span>
      </Link>
    </div>
  )
}
