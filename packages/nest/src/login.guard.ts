import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { Observable } from 'rxjs'

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest()
    const authorization = req.headers.authorization || ''
    const bearer = authorization.split(' ')
    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException('wrong token')
    }
    const token = bearer[1]

    try {
      const userInfo = this.jwtService.verify(token)
      req['user'] = userInfo
      return true
    } catch (error) {
      throw new UnauthorizedException('invalided token, try login again')
    }
  }
}
