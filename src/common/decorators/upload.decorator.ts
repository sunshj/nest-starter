import { applyDecorators, UnsupportedMediaTypeException, UseInterceptors } from '@nestjs/common'
import { FileInterceptor, MulterModuleOptions } from '@nestjs/platform-express'

function fileMimetypeFilter(...mimes: string[]): MulterModuleOptions['fileFilter'] {
  return (_req, file, callback) => {
    if (mimes.some(mime => file.mimetype.includes(mime))) {
      callback(null, true)
    } else {
      callback(new UnsupportedMediaTypeException('文件类型不支持'), false)
    }
  }
}

// this decorator for file upload
export function Upload(field = 'file', options: MulterModuleOptions) {
  return applyDecorators(UseInterceptors(FileInterceptor(field, options)))
}

// this decorator for image upload
export function UploadImage(field = 'image') {
  return Upload(field, {
    limits: { fileSize: 1024 ** 2 * 2 },
    fileFilter: fileMimetypeFilter('image')
  })
}
