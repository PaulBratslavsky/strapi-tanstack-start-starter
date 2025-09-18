import { createContext, useContext, useEffect, useMemo, useState,  } from 'react'
// NOTE: use this as example https://ui.shadcn.com/docs/dark-mode/vite
type Theme = 'dark' | 'light' | 'system'

interface IThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: Readonly<IThemeProviderProps>) {
  const [theme, setTheme] = useState<Theme>(
    () => {
      if (typeof window !== 'undefined') {
        return (localStorage.getItem(storageKey) as Theme)
      }
      return defaultTheme
    },
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      setTheme: (newTheme: Theme) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, newTheme)
        }
        setTheme(newTheme)
      },
    }),
    [theme, storageKey],
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  return context
}
