import { Link, createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import type { SigninFormValues } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { SigninFormSchema } from '@/lib/validations/auth'

type FormData = SigninFormValues

function SignIn() {
  const form = useForm({
    defaultValues: {
      identifier: '',
      password: '',
    } as FormData,
    validators: {
      onChange: SigninFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        // TODO: Implement actual authentication logic
        console.log('Sign in:', value)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        console.error('Sign in error:', error)
      }
    },
  })

  const { Field, handleSubmit, state } = form

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-card-foreground">Sign In</h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleSubmit()
        }}
        className="space-y-4"
      >
        <Field name="identifier">
          {(field) => (
            <div className="space-y-2">
              <label
                htmlFor="identifier"
                className="text-sm font-medium text-card-foreground"
              >
                Username or Email
              </label>
              <Input
                id="identifier"
                type="text"
                placeholder="Enter your username or email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                disabled={state.isSubmitting}
                className={cn(
                  field.state.meta.errors.length > 0 && 'border-destructive',
                )}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-destructive">
                  {typeof field.state.meta.errors[0] === 'string'
                    ? field.state.meta.errors[0]
                    : field.state.meta.errors[0]?.message || 'Validation error'}
                </p>
              )}
            </div>
          )}
        </Field>

        <Field name="password">
          {(field) => (
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-card-foreground"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                disabled={state.isSubmitting}
                className={cn(
                  field.state.meta.errors.length > 0 && 'border-destructive',
                )}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-destructive">
                  {typeof field.state.meta.errors[0] === 'string'
                    ? field.state.meta.errors[0]
                    : field.state.meta.errors[0]?.message || 'Validation error'}
                </p>
              )}
            </div>
          )}
        </Field>

        <Button
          type="submit"
          className="w-full"
          disabled={state.isSubmitting || !state.canSubmit}
        >
          {state.isSubmitting ? 'Signing in...' : 'Sign In'}
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
