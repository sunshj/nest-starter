export class BaseEntity<T> {
  constructor(partial: T) {
    Object.assign(this, partial)
  }
}
