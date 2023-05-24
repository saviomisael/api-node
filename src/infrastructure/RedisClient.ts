import { createClient } from 'redis'

const RedisClient = createClient()

RedisClient.on('error', (error) => { throw error })

export default RedisClient
