// import { createClient } from 'redis'
import { Redis } from 'ioredis'
import 'dotenv/config'

;(async function () {
  // const client = createClient({
  //   socket: {
  //     host: process.env.HOST,
  //     port: Number(process.env.REDIS_PORT),
  //   },
  // })
  // await client.connect()

  // const value = await client.keys('*')
  // console.log(value)

  // await client.disconnect()

  const redis = new Redis()

  redis.zadd('zset1', 4, 'name')
  const res = await redis.keys('*')
  console.log(res)






})()
