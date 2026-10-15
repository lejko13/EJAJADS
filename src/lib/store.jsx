import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from './supabase'

const Ctx = createContext(null)

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* privátne okno – nevadí */
  }
}

function usePersistentSet(key) {
  const [set, setSet] = useState(() => new Set(load(key, [])))
  useEffect(() => save(key, [...set]), [key, set])
  const toggle = useCallback((id) => {
    setSet((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])
  const add = useCallback((id) => {
    setSet((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
  }, [])
  return [set, toggle, add]
}

export function StoreProvider({ children }) {
  const [muted, setMuted] = useState(true)
  const [liked, toggleLike, addLike] = usePersistentSet('ejaj:liked')
  const [saved, toggleSave] = usePersistentSet('ejaj:saved')
  const [followed, toggleFollow] = usePersistentSet('ejaj:followed')
  const [infoVideo, setInfoVideo] = useState(null)
  // prihlásenie cez Supabase
  // user: undefined = ešte zisťujeme, null = neprihlásený, objekt = prihlásený
  const [user, setUser] = useState(undefined)
  const [loginOpen, setLoginOpen] = useState(false)
  const openLogin = useCallback(() => setLoginOpen(true), [])
  const closeLogin = useCallback(() => setLoginOpen(false), [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === 'SIGNED_IN') setLoginOpen(false)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])
  const [toast, setToast] = useState(null)
  const toastTimer = useRef()

  const showToast = useCallback((msg) => {
    clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(null), 2200)
  }, [])

  const share = useCallback(
    async (video) => {
      const url = `${location.origin}/?v=${video.id}`
      try {
        if (navigator.share && matchMedia('(pointer: coarse)').matches) {
          await navigator.share({ title: 'ejajads', text: video.caption, url })
          return
        }
        await navigator.clipboard.writeText(url)
        showToast('Odkaz skopírovaný')
      } catch {
        /* zrušené zdieľanie */
      }
    },
    [showToast],
  )

  return (
    <Ctx.Provider
      value={{
        muted, setMuted,
        liked, toggleLike, addLike,
        saved, toggleSave,
        followed, toggleFollow,
        infoVideo, setInfoVideo,
        user, signOut,
        loginOpen, openLogin, closeLogin,
        toast, showToast,
        share,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export const useStore = () => useContext(Ctx)
