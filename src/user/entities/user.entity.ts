import { $Enums, User } from '@prisma/client'
import { BaseEntity } from '~/common/base.entity'
import { Exclude } from 'class-transformer'

export class UserEntity extends BaseEntity<UserEntity> implements User {
  id: number
  name: string
  @Exclude()
  password: string
  role: $Enums.Role
  @Exclude()
  is_del: boolean
  created_at: Date
  updated_at: Date
}
