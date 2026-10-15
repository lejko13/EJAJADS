const base = (props) => ({
  width: props.size ?? 24,
  height: props.size ?? 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: props.strokeWidth ?? 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: props.className,
  style: props.style,
  'aria-hidden': true,
})

const filled = (props) => ({
  width: props.size ?? 24,
  height: props.size ?? 24,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  className: props.className,
  style: props.style,
  'aria-hidden': true,
})

export const HomeIcon = ({ active, ...p }) =>
  active ? (
    <svg {...filled(p)}><path d="M10.6 2.6a2.2 2.2 0 0 1 2.8 0l7.4 6.1c.5.4.8 1 .8 1.7V20a2 2 0 0 1-2 2h-4.4a1 1 0 0 1-1-1v-5.2a1 1 0 0 0-1-1h-2.4a1 1 0 0 0-1 1V21a1 1 0 0 1-1 1H4.4a2 2 0 0 1-2-2v-9.6c0-.7.3-1.3.8-1.7z" /></svg>
  ) : (
    <svg {...base(p)}><path d="M3.5 10.2 12 3.2l8.5 7V20a1 1 0 0 1-1 1h-4.6v-6.2H9.1V21H4.5a1 1 0 0 1-1-1z" /></svg>
  )

export const CompassIcon = (p) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9.2" /><path d="m15.6 8.4-2.2 5-5 2.2 2.2-5z" /></svg>
)

export const FollowingIcon = (p) => (
  <svg {...base(p)}><circle cx="9" cy="8" r="3.6" /><path d="M2.8 20c.5-3.4 3-5.4 6.2-5.4s5.7 2 6.2 5.4" /><path d="m15.6 9.4 2 2 3.8-4" /></svg>
)

export const FriendsIcon = (p) => (
  <svg {...base(p)}><circle cx="9" cy="8" r="3.6" /><path d="M2.6 20c.5-3.4 3-5.4 6.4-5.4s5.9 2 6.4 5.4" /><circle cx="17.2" cy="8.6" r="2.6" /><path d="M17.6 14.2c2.3.3 3.6 2 3.9 4.6" /></svg>
)

export const DramaIcon = (p) => (
  <svg {...base(p)}><rect x="2.8" y="4" width="18.4" height="16" rx="2.5" /><path d="M7 4v16M17 4v16M2.8 9h4.2M2.8 15h4.2M17 9h4.2M17 15h4.2" /><path d="m10.4 9.6 3.6 2.4-3.6 2.4z" fill="currentColor" /></svg>
)

export const LiveIcon = (p) => (
  <svg {...base(p)}><rect x="2.8" y="6.5" width="18.4" height="14" rx="2.5" /><path d="m8.5 2.8 3.5 3.4 3.5-3.4" /><path d="M8.5 16.8v-4M12 16.8v-6M15.5 16.8v-3" /></svg>
)

export const MessagesIcon = (p) => (
  <svg {...base(p)}><path d="M21.2 3.2 2.8 9.6l7.8 3.2 3.2 7.8z" /><path d="m10.6 12.8 4.6-4.6" /></svg>
)

export const ActivityIcon = (p) => (
  <svg {...base(p)}><path d="M4.8 3.6h14.4a2 2 0 0 1 2 2v9.8a2 2 0 0 1-2 2h-4.8L12 20.4l-2.4-3H4.8a2 2 0 0 1-2-2V5.6a2 2 0 0 1 2-2z" /><path d="M8 10.4h8" /></svg>
)

export const UploadIcon = (p) => (
  <svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M12 8v8M8 12h8" /></svg>
)

export const ProfileIcon = ({ active, ...p }) =>
  active ? (
    <svg {...filled(p)}><circle cx="12" cy="7.6" r="4.6" /><path d="M3.2 21c.6-4.6 4.2-7.4 8.8-7.4s8.2 2.8 8.8 7.4z" /></svg>
  ) : (
    <svg {...base(p)}><circle cx="12" cy="7.6" r="4.2" /><path d="M3.6 21c.6-4.4 4-7 8.4-7s7.8 2.6 8.4 7" /></svg>
  )

export const MoreIcon = (p) => (
  <svg {...filled(p)}><circle cx="5" cy="12" r="1.9" /><circle cx="12" cy="12" r="1.9" /><circle cx="19" cy="12" r="1.9" /></svg>
)

export const SearchIcon = (p) => (
  <svg {...base(p)}><circle cx="10.8" cy="10.8" r="7" /><path d="m16 16 5 5" /></svg>
)

export const HeartIcon = (p) => (
  <svg {...filled(p)}><path d="M12 21.2c-.4 0-.8-.1-1.1-.4C5.6 16.4 2 13.2 2 8.9 2 5.8 4.4 3.4 7.4 3.4c1.8 0 3.5.9 4.6 2.3 1.1-1.4 2.8-2.3 4.6-2.3 3 0 5.4 2.4 5.4 5.5 0 4.3-3.6 7.5-8.9 11.9-.3.3-.7.4-1.1.4z" /></svg>
)

export const CommentIcon = (p) => (
  <svg {...filled(p)}><path d="M12 2.6c5.6 0 10 3.9 10 8.8 0 4.9-4.4 8.8-10 8.8-.9 0-1.8-.1-2.7-.3L4.6 22c-.6.3-1.2-.2-1.1-.8l.7-3.6C2.8 16 2 13.8 2 11.4c0-4.9 4.4-8.8 10-8.8zm-4.6 7.2a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2zm4.6 0a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2zm4.6 0a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z" /></svg>
)

export const BookmarkIcon = (p) => (
  <svg {...filled(p)}><path d="M5 3.6C5 2.7 5.7 2 6.6 2h10.8c.9 0 1.6.7 1.6 1.6v17.2c0 .9-1 1.4-1.7.9L12 17.6l-5.3 4.1c-.7.5-1.7 0-1.7-.9z" /></svg>
)

export const ShareIcon = (p) => (
  <svg {...filled(p)}><path d="M13.4 3.2c0-.8 1-1.3 1.6-.7l7.6 7.3c.4.4.4 1 0 1.4L15 18.5c-.6.6-1.6.1-1.6-.7v-3.5c-5.2 0-8.6 1.6-11 5.3-.3.4-.9.2-.9-.3.8-6.4 4.6-10.6 11.9-11.2z" /></svg>
)

export const ChevronUp = (p) => (
  <svg {...base({ ...p, strokeWidth: 2.4 })}><path d="m6 15 6-6 6 6" /></svg>
)
export const ChevronDown = (p) => (
  <svg {...base({ ...p, strokeWidth: 2.4 })}><path d="m6 9 6 6 6-6" /></svg>
)
export const ChevronLeft = (p) => (
  <svg {...base({ ...p, strokeWidth: 2.4 })}><path d="m15 6-6 6 6 6" /></svg>
)

export const VolumeOffIcon = (p) => (
  <svg {...filled(p)}><path d="M11 4.6c0-.8-1-1.3-1.6-.7L5.2 7.6H3.4c-.8 0-1.4.6-1.4 1.4v6c0 .8.6 1.4 1.4 1.4h1.8l4.2 3.7c.6.6 1.6.1 1.6-.7z" /><path d="m15 9 6 6m0-6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
)
export const VolumeOnIcon = (p) => (
  <svg {...filled(p)}><path d="M11 4.6c0-.8-1-1.3-1.6-.7L5.2 7.6H3.4c-.8 0-1.4.6-1.4 1.4v6c0 .8.6 1.4 1.4 1.4h1.8l4.2 3.7c.6.6 1.6.1 1.6-.7z" /><path d="M15 8.6a4.8 4.8 0 0 1 0 6.8M17.8 5.8a8.8 8.8 0 0 1 0 12.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
)

export const PlayIcon = (p) => (
  <svg {...filled(p)}><path d="M7 4.4c0-1 1.1-1.6 2-1.1l11.4 7.6c.8.5.8 1.7 0 2.2L9 20.7c-.9.5-2-.1-2-1.1z" /></svg>
)
export const PlayOutline = (p) => (
  <svg {...base(p)}><path d="M7 4.6 19 12 7 19.4z" /></svg>
)

export const MusicIcon = (p) => (
  <svg {...filled(p)}><path d="M20 3.2v12.3a3.3 3.3 0 1 1-1.8-2.9V7.4l-8.4 2.1v8.2a3.3 3.3 0 1 1-1.8-2.9V5.6c0-.5.3-.9.8-1l10-2.5c.6-.2 1.2.3 1.2 1.1z" /></svg>
)

export const CloseIcon = (p) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>
)

export const PlusIcon = (p) => (
  <svg {...base({ ...p, strokeWidth: 3 })}><path d="M12 5v14M5 12h14" /></svg>
)

export const CheckIcon = (p) => (
  <svg {...base({ ...p, strokeWidth: 3 })}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
)

export const GridIcon = (p) => (
  <svg {...base(p)}><path d="M5 4v16M12 4v16M19 4v16" /></svg>
)
export const RepostIcon = (p) => (
  <svg {...base(p)}><path d="M4 11V8a3 3 0 0 1 3-3h12l-3-3M20 13v3a3 3 0 0 1-3 3H5l3 3" /></svg>
)
export const BookmarkOutline = (p) => (
  <svg {...base(p)}><path d="M6 3.6h12v17l-6-4.4-6 4.4z" /></svg>
)
export const HeartOutline = (p) => (
  <svg {...base(p)}><path d="M12 20s-8.6-5.2-8.6-11A4.6 4.6 0 0 1 12 6.4 4.6 4.6 0 0 1 20.6 9C20.6 14.8 12 20 12 20z" /></svg>
)
export const LinkIcon = (p) => (
  <svg {...base(p)}><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1" /><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" /></svg>
)
export const MailIcon = (p) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></svg>
)
export const SidebarIcon = (p) => (
  <svg {...base(p)}><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M9 4v16" /></svg>
)
export const PhoneIcon = (p) => (
  <svg {...base(p)}><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" /><path d="M11 18.5h2" /></svg>
)
export const SparkIcon = (p) => (
  <svg {...filled(p)}><path d="M12 2.5c.4 0 .7.3.8.7l1.1 4.9 4.9 1.1c.8.2.8 1.4 0 1.6l-4.9 1.1-1.1 4.9c-.2.8-1.4.8-1.6 0l-1.1-4.9-4.9-1.1c-.8-.2-.8-1.4 0-1.6l4.9-1.1 1.1-4.9c.1-.4.4-.7.8-.7zM19 15.5c.2 0 .4.2.4.4l.4 1.7 1.7.4c.4.1.4.7 0 .8l-1.7.4-.4 1.7c-.1.4-.7.4-.8 0l-.4-1.7-1.7-.4c-.4-.1-.4-.7 0-.8l1.7-.4.4-1.7c0-.2.2-.4.4-.4z" /></svg>
)
