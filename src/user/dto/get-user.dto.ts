import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

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
