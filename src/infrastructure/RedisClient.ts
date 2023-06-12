import { createClient } from 'redis'

export type Client = ReturnType<typeof createClient>

export class RedisClient {
  private static client: Client
  private constructor() {}

  static async getClient(): Promise<Client> {
    if (RedisClient.client == null || RedisClient.client === undefined) {
      RedisClient.client = createClient({
        url: `redis://default:${process.env.REDIS_PASSWORD ?? ''}@redis:6379`
      })

      RedisClient.client.on('error', (error: any) => {
        console.error(error)
        throw error
      })

      if (!RedisClient.client.isOpen) await RedisClient.client.connect()
    }
    return this.client
  }
}
