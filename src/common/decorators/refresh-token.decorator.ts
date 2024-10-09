import { SetMetadata } from '@nestjs/common'

export const IS_REFRESH_TOKEN = 'isRefreshToken'

// this decorator is used to mark a controller method that requires a refresh token
export const RefreshToken = () => SetMetadata(IS_REFRESH_TOKEN, true)
