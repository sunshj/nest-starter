import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length, Matches } from 'class-validator'

export class SignInDto {
  @ApiProperty()
  @Matches(/^[\u4E00-\u9FA5]|^\w{2,10}$/, {
    message: '用户名不能包含特殊字符'
  })
  @Length(2, 10)
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @Matches(/^\w{6,15}$/, {
    message: '密码不能包含特殊字符'
  })
  @Length(6, 15)
  @IsNotEmpty()
  password: string
}
