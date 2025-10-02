import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { registerUserService, loginUserService, isAuthError } from '@/lib/services/auth'
import { SignupFormSchema, SigninFormSchema, type FormState } from '@/lib/validations/auth'
import { useAppSession } from '@/lib/session'

export const registerUserServerFunction = createServerFn({
  method: 'POST',
})
  .validator((formData: FormData) => {
    const fields = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }
    return fields
  })
  .handler(async ({ data: fields }): Promise<FormState> => {
    console.log('Hello From Register User Action')

    const validatedFields = SignupFormSchema.safeParse(fields)

    if (!validatedFields.success) {
      const flattenedErrors = z.flattenError(validatedFields.error)
      console.log('Validation failed:', flattenedErrors.fieldErrors)
      return {
        success: false,
        message: 'Validation failed',
        strapiErrors: null,
        zodErrors: flattenedErrors.fieldErrors,
        data: fields,
      }
    }

    console.log('Validation successful:', validatedFields.data)

    const { confirmPassword, ...userData } = validatedFields.data
    const responseData = await registerUserService(userData)

    if (!responseData) {
      return {
        success: false,
        message: 'Ops! Something went wrong. Please try again.',
        strapiErrors: null,
        zodErrors: null,
        data: fields,
      }
    }

    // Check if responseData is an error response
    if (isAuthError(responseData)) {
      return {
        success: false,
        message: 'Failed to Register.',
        strapiErrors: responseData.error,
        zodErrors: null,
        data: fields,
      }
    }

    console.log('#############')
    console.log('User Registered Successfully', responseData)
    console.log('#############')

    // Set HTTP-only cookie session
    const session = await useAppSession()
    await session.update({
      userId: responseData.user.id,
      email: responseData.user.email,
      username: responseData.user.username,
      jwt: responseData.jwt,
    })

    return {
      success: true,
      message: 'User registration successful',
      strapiErrors: null,
      zodErrors: null,
      data: fields,
    }
  })

export const loginUserServerFunction = createServerFn({
  method: 'POST',
})
  .validator((formData: FormData) => {
    const fields = {
      identifier: formData.get('identifier') as string,
      password: formData.get('password') as string,
    }
    return fields
  })
  .handler(async ({ data: fields }): Promise<FormState> => {
    console.log('Hello From Login User Action')

    const validatedFields = SigninFormSchema.safeParse(fields)

    if (!validatedFields.success) {
      const flattenedErrors = z.flattenError(validatedFields.error)
      console.log('Validation failed:', flattenedErrors.fieldErrors)
      return {
        success: false,
        message: 'Validation failed',
        strapiErrors: null,
        zodErrors: flattenedErrors.fieldErrors,
        data: fields,
      }
    }

    console.log('Validation successful:', validatedFields.data)

    const responseData = await loginUserService(validatedFields.data)

    if (!responseData) {
      return {
        success: false,
        message: 'Ops! Something went wrong. Please try again.',
        strapiErrors: null,
        zodErrors: null,
        data: fields,
      }
    }

    // Check if responseData is an error response
    if (isAuthError(responseData)) {
      return {
        success: false,
        message: 'Failed to Login.',
        strapiErrors: responseData.error,
        zodErrors: null,
        data: fields,
      }
    }

    console.log('#############')
    console.log('User Logged In Successfully', responseData)
    console.log('#############')

    // Set HTTP-only cookie session
    const session = await useAppSession()
    await session.update({
      userId: responseData.user.id,
      email: responseData.user.email,
      username: responseData.user.username,
      jwt: responseData.jwt,
    })

    return {
      success: true,
      message: 'User login successful',
      strapiErrors: null,
      zodErrors: null,
      data: fields,
    }
  })

export const logoutUserServerFunction = createServerFn({
  method: 'POST',
}).handler(async () => {
  const session = await useAppSession()
  await session.clear()

  return {
    success: true,
    message: 'User logged out successfully',
  }
})

export const getCurrentUserServerFunction = createServerFn({
  method: 'GET',
}).handler(async () => {
  const session = await useAppSession()

  if (!session.data.userId) {
    return null
  }

  return {
    userId: session.data.userId,
    email: session.data.email,
    username: session.data.username,
  }
})
