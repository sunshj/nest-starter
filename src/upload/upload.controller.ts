import { BadRequestException, Controller, Post, UploadedFile } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger'
import { UploadImage } from '~/common/decorators'
import { SingleImageUploadDto } from './dto'

@ApiBearerAuth()
@Controller('upload')
export class UploadController {
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '单图片文件上传' })
  @ApiBody({ type: SingleImageUploadDto })
  @Post('image')
  @UploadImage()
  uploadSingleImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('未上传文件')
    return {
      filename: file.filename,
      path: `/uploads/${file.filename}`
    }
  }
}
