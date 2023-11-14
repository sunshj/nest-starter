import { CreateUserDto } from '~/user/dto'
import { OmitType } from '@nestjs/swagger'

export class SignUpDto extends OmitType(CreateUserDto, ['role']) {}
