export abstract class CacheService<T> {
  protected abstract key: string

  abstract getData (): Promise<T | null>

  abstract setData (data: T): Promise<void>

  serialize (data: T): string {
    return JSON.stringify(data)
  }

  deserialize (rawData: string): T {
    return JSON.parse(rawData)
  }
}
