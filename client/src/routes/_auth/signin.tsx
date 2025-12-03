import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { strapiApi } from '@/data/server-functions'
import type { FormState } from '@/lib/validations/auth'
import { Button } from '@/components/retroui/Button'
import { Input } from '@/components/retroui/Input'
import { Label } from '@/components/retroui/Label'
import { Text } from '@/components/retroui/Text'
import { cn } from '@/lib/utils'

function SignIn() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formState, setFormState] = useState<FormState>({
    success: false,
    message: '',
    data: {},
    strapiErrors: null,
    zodErrors: null,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    setLoading(true)
    const formData = new FormData(e.currentTarget)

    try {
      const result = await strapiApi.auth.loginUserServerFunction({ data: formData })
      setFormState(result)

      if (result.success) {
        router.invalidate()
        router.navigate({ to: '/' })
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setFormState({
        success: false,
        message: 'An unexpected error occurred',
        data: {},
        strapiErrors: null,
        zodErrors: null,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {(formState.message || formState.strapiErrors) && (
        <div
          className={cn(
            'p-3 text-sm border-2',
            formState.success
              ? 'bg-green-100 text-green-800 border-green-500'
              : 'bg-red-100 text-red-800 border-red-500'
          )}
        >
          {formState.strapiErrors?.message || formState.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="identifier">Username or Email</Label>
          <Input
            id="identifier"
            name="identifier"
            type="text"
            placeholder="you@example.com"
            defaultValue={formState.data?.identifier || ''}
            disabled={loading}
            className={cn(
              formState.zodErrors?.identifier && 'border-red-500 border-2'
            )}
          />
          {formState.zodErrors?.identifier && (
            <p className="text-xs text-red-500">
              {formState.zodErrors.identifier[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              disabled={loading}
              className={cn(
                formState.zodErrors?.password && 'border-red-500 border-2'
              )}
            />
            <button
              type="button"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? 'Hide password' : 'Show password'}
              </span>
            </button>
          </div>
          {formState.zodErrors?.password && (
            <p className="text-xs text-red-500">
              {formState.zodErrors.password[0]}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'SIGNING IN...' : 'SIGN IN'}
        </Button>
      </form>

      <div className="text-center text-sm">
        <Text>
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold underline underline-offset-4">
            Sign up
          </Link>
        </Text>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_auth/signin')({
  component: SignIn,
})
