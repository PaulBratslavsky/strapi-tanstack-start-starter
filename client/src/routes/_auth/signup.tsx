import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Check, Eye, EyeOff, X } from 'lucide-react'
import type { FormState } from '@/lib/validations/auth'
import { strapiApi } from '@/data/server-functions'
import { Button } from '@/components/retroui/Button'
import { Input } from '@/components/retroui/Input'
import { Label } from '@/components/retroui/Label'
import { Text } from '@/components/retroui/Text'
import { cn } from '@/lib/utils'

function SignUp() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
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

  // Password validation checks
  const hasMinLength = password.length >= 8
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="johndoe"
              defaultValue={formState.data?.username || ''}
              disabled={loading}
              className={cn(
                formState.zodErrors?.username && 'border-red-500 border-2'
              )}
            />
            {formState.zodErrors?.username && (
              <p className="text-xs text-red-500">
                {formState.zodErrors.username[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              defaultValue={formState.data?.email || ''}
              disabled={loading}
              className={cn(
                formState.zodErrors?.email && 'border-red-500 border-2'
              )}
            />
            {formState.zodErrors?.email && (
              <p className="text-xs text-red-500">
                {formState.zodErrors.email[0]}
              </p>
            )}
          </div>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div className="mt-4 space-y-1 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              {hasMinLength ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <X className="h-3 w-3 text-red-500" />
              )}
              <span>At least 8 characters</span>
            </div>
            <div className="flex items-center gap-1">
              {hasNumber ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <X className="h-3 w-3 text-red-500" />
              )}
              <span>At least one number</span>
            </div>
            <div className="flex items-center gap-1">
              {hasSpecialChar ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <X className="h-3 w-3 text-red-500" />
              )}
              <span>At least one special character</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
        </Button>
      </form>

      <div className="text-center text-sm">
        <Text>
          Already have an account?{' '}
          <Link to="/signin" className="font-bold underline underline-offset-4">
            Sign in
          </Link>
        </Text>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_auth/signup')({
  component: SignUp,
})
