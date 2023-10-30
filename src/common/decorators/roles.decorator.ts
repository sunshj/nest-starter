import { $Enums } from '@prisma/client'
import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: $Enums.Role[]) => SetMetadata(ROLES_KEY, roles)
