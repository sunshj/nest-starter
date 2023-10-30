import { Global, Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'node:path'
import { UploadController } from './upload.controller'

@Global()
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './public/uploads',
        filename(_req, file, cb) {
          const random = Date.now() + '-' + Math.random().toString(32).slice(-6)
          const filename = `${random}${extname(file.originalname)}`
          cb(null, filename)
        }
      })
    })
  ],
  controllers: [UploadController]
})
export class UploadModule {}
