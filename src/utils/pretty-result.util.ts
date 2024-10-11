interface Result<T> {
  statusCode: number
  message: string
  data: T
}

type RequiredMessageOptionalStatusCode = { message: string; statusCode?: number }

export class PrettyResult<T> implements Result<T> {
  statusCode: number
  message: string
  data: T
  constructor({ statusCode, message, data }: Result<T>) {
    this.statusCode = statusCode ?? 200
    this.message = message ?? '请求成功'
    this.data = data
  }

  static success<TData>(data: TData, options?: RequiredMessageOptionalStatusCode) {
    const result = new PrettyResult<TData>({
      statusCode: 200,
      message: '请求成功',
      ...options,
      data
    })
    return {
      __pretty__: true,
      ...result
    }
  }

  static failed(message: string) {
    return PrettyResult.success(null, { statusCode: 500, message })
  }
}
