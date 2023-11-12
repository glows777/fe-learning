import { Inject, Injectable } from '@nestjs/common'
import { RedisClientType } from 'redis'

@Injectable()
export class AppService {

  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType

  async getHello(): Promise<string> {
    const res = await this.redisClient.keys('*')
    console.log(res)
    return 'Hello World!'
  }
}
