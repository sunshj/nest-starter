import { OmitType } from '@nestjs/mapped-types'
import { CreateUserDto } from '~/user/dto'

export class SignUpDto extends OmitType(CreateUserDto, ['role']) {}
