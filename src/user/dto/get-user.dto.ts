import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator'

export class GetUserDto {
  @ApiProperty()
  @Min(0)
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  page: number

  @ApiProperty()
  @Max(20)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  size: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  query?: string
}
