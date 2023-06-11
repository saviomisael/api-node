import { RedisClient } from '../RedisClient'

export class CacheService<T> {
  constructor(private key: string) {}

  /**
   * If your key has dynamic keys you must use replaceKeys method before
   */
  async getData(): Promise<T | null> {
    if (!RedisClient.isOpen) await RedisClient.connect()

    const rawData = await RedisClient.get(this.key)

    if (rawData == null) return null

    return this.deserialize(rawData)
  }

  /**
   * If your key has dynamic keys you must use replaceKeys method before
   */
  async setData(data: T): Promise<void> {
    if (!RedisClient.isOpen) await RedisClient.connect()

    await RedisClient.set(this.key, this.serialize(data), { EX: 180, NX: true })
  }

  private serialize(data: T): string {
    return JSON.stringify(data)
  }

  private deserialize(rawData: string): T {
    return JSON.parse(rawData) as T
  }

  replaceKeys(replacements: Record<string, string>): this {
    for (const key in replacements) {
      const value = replacements[key]

      this.key = this.key.replace(key, value)
    }

    return this
  }

  getKey(): string {
    return this.key
  }
}
