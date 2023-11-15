import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  Query,
  UnauthorizedException,
  UseGuards,
  Req,
} from '@nestjs/common'
import { StudentService } from './student.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { JwtService } from '@nestjs/jwt'
import { LoginGuard } from 'src/login.guard'

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Inject(JwtService)
  private jwtService: JwtService

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.studentService.create(registerDto)
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const student = await this.studentService.findOne(loginDto)
    const access_token = await this.jwtService.signAsync(
      {
        stuId: student.id,
        name: student.name,
      },
      { expiresIn: '30m' },
    )
    const refresh_token = await this.jwtService.signAsync(
      {
        stuId: student.id,
      },
      {
        expiresIn: '7d',
      },
    )    
    return {
      access_token,
      refresh_token,
    }
  }

  @Get('refresh')
  async refresh(@Query('refresh_token') refreshToken: string) {
    try {
      const data = await this.jwtService.verifyAsync(refreshToken)
      const user = await this.studentService.findById(data.stuId)
      const access_token = await this.jwtService.signAsync(
        {
          stuId: user.id,
          name: user.name,
        },
        {
          expiresIn: '30min',
        },
      )
      const refresh_token = await this.jwtService.signAsync(
        {
          stuId: user.id,
        },
        {
          expiresIn: '7d',
        },
      )
      return {
        access_token,
        refresh_token,
      }
    } catch (err) {
      throw new UnauthorizedException('token is invalid, try login')
    }
  }

  @Get('a')
  aa() {
    return 'aaaa'
  }
  @Get('b')
  @UseGuards(LoginGuard)
  bb(@Req() req) {
    const user = req.user
    return user
  }
}
