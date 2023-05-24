export abstract class CacheService<T> {
  protected abstract key: string

  abstract getData (): Promise<T | null>

  abstract setData (data: T): Promise<void>

  protected serialize (data: T): string {
    return JSON.stringify(data)
  }

  protected deserialize (rawData: string): T {
    return JSON.parse(rawData)
  }
}
