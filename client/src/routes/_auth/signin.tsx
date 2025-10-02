import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { strapiApi } from '@/data/server-functions'
import type { FormState } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

function SignIn() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-card-foreground">Sign In</h2>
      </div>

      {(formState.message || formState.strapiErrors) && (
        <div
          className={cn(
            'p-3 rounded-md text-sm',
            formState.success
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-destructive/10 text-destructive border border-destructive/20'
          )}
        >
          {formState.strapiErrors?.message || formState.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="identifier"
            className="text-sm font-medium text-card-foreground"
          >
            Username or Email
          </label>
          <Input
            id="identifier"
            name="identifier"
            type="text"
            placeholder="Enter your username or email"
            defaultValue={formState.data?.identifier || ''}
            disabled={loading}
            className={cn(
              formState.zodErrors?.identifier && 'border-destructive'
            )}
          />
          {formState.zodErrors?.identifier && (
            <p className="text-xs text-destructive">
              {formState.zodErrors.identifier[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-card-foreground"
          >
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            disabled={loading}
            className={cn(
              formState.zodErrors?.password && 'border-destructive'
            )}
          />
          {formState.zodErrors?.password && (
            <p className="text-xs text-destructive">
              {formState.zodErrors.password[0]}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-primary hover:text-primary/80 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_auth/signin')({
  component: SignIn,
})
