import {
  Controller,
  Get,
  Headers,
  Inject,
  Res,
  Session,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'

import { AppService } from './app.service'

interface Session {
  count: number
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(JwtService)
  private jwtService: JwtService

  @Get()
  async getHello(): Promise<string> {
    return await this.appService.getHello()
  }

  @Get('hello')
  hello(@Session() session: Session) {
    session.count = session.count ? session.count + 1 : 1
    return session.count
  }

  @Get('jwt')
  jwt1(@Res({ passthrough: true }) resp: Response) {
    const token = this.jwtService.sign({
      count: 1,
    })
    resp.setHeader('token', token)
    return 'hello jwt'
  }

  @Get('jwt2')
  jwt2(
    @Headers('authorization') authorization: string,
    @Res({ passthrough: true }) resp: Response,
  ) {
    if (authorization) {
      try {
        const data = this.jwtService.verify(authorization)

        const newToken = this.jwtService.sign({
          count: data.count + 1,
        })
        resp.setHeader('token', newToken)
        return data.count + 1
      } catch (err) {
        console.error(err)
        throw new UnauthorizedException()
      }
    } else {
      const newToken = this.jwtService.sign({
        count: 1,
      })
      resp.setHeader('token', newToken)
      return 'hello jwt2'
    }
  }
}
