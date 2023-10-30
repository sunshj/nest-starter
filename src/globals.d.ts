declare global {
  type DeepUnpacked<T> = T extends (infer U)[]
    ? U[]
    : T extends object
    ? { [K in keyof T]: DeepUnpacked<T[K]> }
    : T
}

export {}
