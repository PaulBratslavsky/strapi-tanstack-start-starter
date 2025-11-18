import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { strapiApi } from '@/data/server-functions'
import type { FormState } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

function SignUp() {
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
      const result = await strapiApi.auth.registerUserServerFunction({ data: formData })
      setFormState(result)

      if (result.success) {
        router.invalidate()
        router.navigate({ to: '/' })
      }
    } catch (error) {
      console.error('Sign up error:', error)
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
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          Create Account
        </h2>
      </div>

      {(formState.message || formState.strapiErrors) && (
        <div
          className={cn(
            'p-3 rounded-md text-sm border-2',
            formState.success
              ? 'bg-chart-2/10 text-foreground border-chart-2'
              : 'bg-chart-4/10 text-foreground border-chart-4'
          )}
        >
          {formState.strapiErrors?.message || formState.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="text-sm font-medium text-foreground"
          >
            Username
          </label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="username"
            defaultValue={formState.data?.username || ''}
            disabled={loading}
            className={cn(
              formState.zodErrors?.username && 'border-chart-4 border-2'
            )}
          />
          {formState.zodErrors?.username && (
            <p className="text-xs text-chart-4">
              {formState.zodErrors.username[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john.doe@example.com"
            defaultValue={formState.data?.email || ''}
            disabled={loading}
            className={cn(formState.zodErrors?.email && 'border-chart-4 border-2')}
          />
          {formState.zodErrors?.email && (
            <p className="text-xs text-chart-4">
              {formState.zodErrors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            disabled={loading}
            className={cn(
              formState.zodErrors?.password && 'border-chart-4 border-2'
            )}
          />
          {formState.zodErrors?.password && (
            <p className="text-xs text-chart-4">
              {formState.zodErrors.password[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-foreground"
          >
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-foreground/70">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="text-main hover:text-main/80 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_auth/signup')({
  component: SignUp,
})
