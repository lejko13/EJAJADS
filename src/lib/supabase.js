import { createClient } from '@supabase/supabase-js'

// hodnoty sú v súbore .env (publishable key je verejný, môže byť vo webe)
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
)

// chybové hlášky zo Supabase po slovensky
export function authErrorSk(error) {
  const code = error?.code
  const msg = (error?.message || '').toLowerCase()
  if (code === 'invalid_credentials' || msg.includes('invalid login')) return 'Nesprávny e-mail alebo heslo.'
  if (code === 'email_not_confirmed' || msg.includes('not confirmed')) return 'Tento účet ešte nie je potvrdený.'
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit' || msg.includes('rate limit'))
    return 'Príliš veľa pokusov. Skús to o chvíľu znova.'
  if (msg.includes('failed to fetch') || msg.includes('network')) return 'Nepodarilo sa pripojiť. Skontroluj internet.'
  return 'Niečo sa pokazilo. Skús to znova.'
}
