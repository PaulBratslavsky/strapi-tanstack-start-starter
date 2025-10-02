import { createMiddleware } from '@tanstack/react-start'

export const globalMiddleware = createMiddleware({
  type: 'request'
}).server(async ({ next }) => {
  console.log('Request received:', {
    timestamp: new Date().toISOString(),
  })

  const result = await next()

  console.log('Response sent:', {
    timestamp: new Date().toISOString(),
  })

  return result
})
