interface Result<T> {
  statusCode: number
  message: string
  data: T
}

type RequiredMessageOptionalStatusCode = DeepUnpacked<{ message: string; statusCode?: number }>

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
    return new PrettyResult<TData>({
      statusCode: 200,
      message: '请求成功',
      ...options,
      data
    })
  }

  static failed<TData>(data: TData, options?: RequiredMessageOptionalStatusCode) {
    return PrettyResult.success(data, { statusCode: 500, message: '请求失败', ...options })
  }
}
