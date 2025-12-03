import { LogOut } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { strapiApi } from '@/data/server-functions'
import { cn } from '@/lib/utils'

interface LogoutButtonProps {
  variant?: 'icon' | 'full' | 'mobile'
  className?: string
}

export function LogoutButton({ variant = 'icon', className }: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await strapiApi.auth.logoutUserServerFunction()
      router.invalidate()
      router.navigate({ to: '/' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoading}
        className={cn("disabled:opacity-50", className)}
      >
        <LogOut className="w-6 h-6 text-foreground hover:text-main transition-colors duration-300 ease-in-out" />
      </button>
    )
  }

  if (variant === 'mobile') {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoading}
        className={cn(
          "flex items-center justify-center gap-2 p-3 bg-[#C4A1FF] border-2 border-black rounded-lg font-medium w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
      >
        <LogOut className="h-5 w-5" />
        <span>{isLoading ? 'Logging out...' : 'Log Out'}</span>
      </button>
    )
  }

  // variant === 'full'
  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className={cn(
        "hidden md:flex border-l-3 border-black items-center px-4 gap-2 font-medium bg-[#C4A1FF] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      <span>{isLoading ? 'Logging out...' : 'Log Out'}</span>
      <LogOut className="h-5 w-5" />
    </button>
  )
}
