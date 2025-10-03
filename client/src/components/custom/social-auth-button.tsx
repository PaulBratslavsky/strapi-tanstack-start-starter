import { useState } from 'react'
import { getStrapiURL } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SocialAuthButtonProps {
  provider: 'google' | 'github' | 'facebook' | 'twitter'
  label?: string
  icon?: React.ReactNode
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
}

export function SocialAuthButton({
  provider,
  label,
  icon,
  variant = 'outline',
}: Readonly<SocialAuthButtonProps>) {
  const [isLoading, setIsLoading] = useState(false)
  const backendUrl = getStrapiURL()
  const authUrl = `${backendUrl}/api/connect/${provider}`

  const handleClick = () => {
    setIsLoading(true)
    window.location.href = authUrl
  }

  return (
    <Button
      type="button"
      variant={variant}
      className="w-full"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Redirecting...
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {label || `Sign in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
        </>
      )}
    </Button>
  )
}
