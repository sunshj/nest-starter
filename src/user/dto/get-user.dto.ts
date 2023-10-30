import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class GetUserDto {
  @Min(0)
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  page: number

  @Max(20)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  size: number

  @IsString()
  @IsOptional()
  query: string
}
