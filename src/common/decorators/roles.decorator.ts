import { SetMetadata } from '@nestjs/common'
import { $Enums } from '@prisma/client'

export const ROLES_KEY = 'roles'

// this decorator is used to define the roles that are allowed to access a route
export const Roles = (...roles: $Enums.Role[]) => SetMetadata(ROLES_KEY, roles)
