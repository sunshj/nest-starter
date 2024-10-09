import { OmitType } from '@nestjs/swagger'
import { CreateUserDto } from '~/user/dto'

export class SignUpDto extends OmitType(CreateUserDto, ['role']) {}
