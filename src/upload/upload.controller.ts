import { Controller, Post, UploadedFile } from '@nestjs/common'
import { UploadImage } from '~/common/decorators'

@Controller('upload')
export class UploadController {
  /**
   * 测试链接 https://reurl.cc/My9Enk
   */
  @Post('image')
  @UploadImage()
  uploadSingleImage(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      path: `/uploads/${file.filename}`
    }
  }
}
