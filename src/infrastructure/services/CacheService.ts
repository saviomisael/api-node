export abstract class CacheService {
  abstract key: string

  abstract getData<T>(): Promise<T>

  abstract setData<T>(data: T): Promise<void>

  serialize<T>(data: T): string {
    return JSON.stringify(data)
  }

  deserialize<T>(rawData: string): T {
    return JSON.parse(rawData)
  }
}
