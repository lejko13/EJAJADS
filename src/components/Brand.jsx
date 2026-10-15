import { owner } from '../data/videos'

// "ejajads" logo – originálny obrázok, pomer strán berie prehliadač priamo z obrázka

export function Logo({ height = 28, className = '' }) {
  return (
    <img
      src="/logo-ejajads-sm.png"
      alt="ejajads"
      width={720}
      height={207}
      draggable={false}
      className={`block select-none object-contain ${className}`}
      style={{ height, width: 'auto' }}
    />
  )
}

// avatar značky – celé logo v tmavom kruhu (farba pozadia z originálu)
export function LogoMark({ size = 32, className = '' }) {
  const src = size > 120 ? '/logo-ejajads.png' : '/logo-ejajads-sm.png'
  return (
    <span
      className={`inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-[#0a0910] ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        className="block select-none object-contain"
        style={{ width: '82%', height: 'auto' }}
      />
    </span>
  )
}

export function Avatar({ account, size = 48, ring = false, className = '' }) {
  const isOwner = !account || account.handle === owner.handle
  const ringCls = ring ? 'ring-2 ring-white' : ''
  if (isOwner) return <LogoMark size={size} className={`${ringCls} ${className}`} />
  return (
    <img
      src={account.avatar}
      alt={account.name}
      width={size}
      height={size}
      loading="lazy"
      className={`shrink-0 rounded-full object-cover bg-elev ${ringCls} ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
