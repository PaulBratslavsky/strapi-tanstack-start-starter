import { strapiApi } from '@/data/server-functions'
import { LogOut } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'

export function LogoutButton() {
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

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="disabled:opacity-50"
    >
      <LogOut className="w-6 h-6 hover:text-primary" />
    </button>
  )
}
