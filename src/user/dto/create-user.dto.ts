import { $Enums } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsOptional, Length, Matches } from 'class-validator'

export class CreateUserDto {
  @Matches(/^[\u4e00-\u9fa5]|^[a-zA-Z0-9_]{2,10}$/, {
    message: '用户名不能包含特殊字符'
  })
  @Length(2, 10)
  @IsNotEmpty()
  name: string

  @Matches(/^[a-zA-Z0-9_]{6,15}$/, {
    message: '密码不能包含特殊字符'
  })
  @Length(6, 15)
  @IsNotEmpty()
  password: string

  @IsEnum($Enums.Role)
  @IsOptional()
  role?: $Enums.Role
}
