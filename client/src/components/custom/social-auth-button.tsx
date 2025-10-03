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
  const backendUrl = getStrapiURL()
  const authUrl = `${backendUrl}/api/connect/${provider}`

  return (
    <Button
      asChild
      variant={variant}
      className="w-full"
    >
      <a href={authUrl}>
        {icon && <span className="mr-2">{icon}</span>}
        {label || `Sign in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
      </a>
    </Button>
  )
}
