import { createClient } from 'redis'

const RedisClient = createClient({
  url: `redis://default:${process.env.REDIS_PASSWORD ?? ''}@redis:6379`
})

RedisClient.on('error', (error) => {
  throw error
})

export { RedisClient }
