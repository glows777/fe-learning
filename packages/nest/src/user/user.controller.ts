import {
  Body,
  Controller, Get, Inject, Post, Res, UseGuards,Headers, ValidationPipe
} from '@nestjs/common'
import { UserService } from './user.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { LoginGuard } from 'src/login.guard'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto, @Res({ passthrough: true }) resp: Response) {
    const user = await this.userService.findOne(loginDto)
    if (user) {
      const token = await this.jwtService.signAsync({
        user: {
          id: user.id,
          username: user.name
        }
      })
      resp.setHeader('token', token)
      return 'login successfully'
    } else {
      return 'failed to login'
    }
  }

  @Post('register')
  register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.userService.create(registerDto)
  }

  @Get('a')
  @UseGuards(LoginGuard)
  a(@Headers('authorization') authorization) {
    return `hello ${this.jwtService.verify(authorization.split(' ')[1]).user.username} from a`
  }

  @Get('b')
  @UseGuards(LoginGuard)
  b() {
    return 'hello from b'
  }
}
