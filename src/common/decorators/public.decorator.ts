import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'

// This decorator is used to mark a route as public, meaning it can be accessed without authentication.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
