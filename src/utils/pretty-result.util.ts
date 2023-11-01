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

  static failed<TData>(data: TData, options?: RequiredMessageOptionalStatusCode) {
    return PrettyResult.success(data, { statusCode: 500, message: '请求失败', ...options })
  }

  /**
   * 发送原始数据，不做格式化，类似于 res.send()
   * @param data
   */
  static send<TData>(data: TData) {
    return { __prettyRaw__: true, data }
  }
}
