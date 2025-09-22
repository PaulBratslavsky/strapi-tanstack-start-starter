import { Link, createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import type { SignupFormValues } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { SignupFormSchema } from '@/lib/validations/auth'

type FormData = SignupFormValues

function SignUp() {
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    } as FormData,
    validators: {
      onChange: SignupFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        // TODO: Implement actual registration logic
        console.log('Sign up:', value)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        console.error('Sign up error:', error)
      }
    },
  })

  const { Field, handleSubmit, state } = form

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-card-foreground">
          Create Account
        </h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleSubmit()
        }}
        className="space-y-4"
      >
        <Field name="username">
          {(field) => (
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-card-foreground"
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="username"
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

        <Field name="email">
          {(field) => (
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-card-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
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
                placeholder="Create a password"
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

        <Field name="confirmPassword">
          {(field) => (
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-card-foreground"
              >
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
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
          {state.isSubmitting ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="text-primary hover:text-primary/80 font-medium"
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
