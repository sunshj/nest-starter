import { ApiProperty } from '@nestjs/swagger'

export class SingleImageUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File
}
