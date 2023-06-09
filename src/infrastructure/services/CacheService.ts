import { RedisClient } from '../RedisClient'

export class CacheService<T> {
  constructor (private readonly key: string) {}

  async getData (): Promise<T | null> {
    if (!RedisClient.isOpen) await RedisClient.connect()

    const rawData = await RedisClient.get(this.key)

    if (rawData == null) return null

    return this.deserialize(rawData)
  }

  async setData (data: T): Promise<void> {
    if (!RedisClient.isOpen) await RedisClient.connect()

    if (this.key.includes(':')) {
      throw new Error('replaceKeys should call before this method.')
    }

    await RedisClient.set(this.key, this.serialize(data), { EX: 180, NX: true })
  }

  protected serialize (data: T): string {
    return JSON.stringify(data)
  }

  protected deserialize (rawData: string): T {
    return JSON.parse(rawData) as T
  }

  replaceKeys (replacements: Record<string, string>): this {
    for (const key in replacements) {
      const value = replacements[key]

      this.key.replace(key, value)
    }

    return this
  }
}
