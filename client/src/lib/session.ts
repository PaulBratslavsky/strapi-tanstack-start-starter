import { useSession } from '@tanstack/react-start/server'

type SessionData = {
  userId?: number
  email?: string
  username?: string
  jwt?: string
}

export function useAppSession() {
  return useSession<SessionData>({
    name: 'auth-session',
    password: process.env.SESSION_SECRET || 'change-this-to-a-secure-32-char-secret-in-production!',
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  })
}
