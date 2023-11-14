import { HttpException, Injectable, Logger } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { RegisterDto } from './dto/register.dto'
import * as crypto from 'crypto'
import { LoginDto } from './dto/login.dto'

const md5 = (str: string) => {
  const hash = crypto.createHash('md5')
  hash.update(str)
  return hash.digest('hex')
}

@Injectable()
export class UserService {

  private logger = new Logger()

  @InjectEntityManager()
  private manager: EntityManager

  @InjectRepository(User)
  private userRepository: Repository<User>

  async create(registerDto: RegisterDto) {
    const foundUser = await this.userRepository.findOne({
      where: {
        name: registerDto.username
      }
    })
    if (foundUser) {
      throw new HttpException('user already registered!', 200)
    }

    const newUser = new User()
    newUser.name = registerDto.username
    newUser.password = md5(registerDto.password)

    try {
      await this.userRepository.save(newUser)
      return 'register successfully'
    } catch (error) {
      this.logger.error(error, UserService)
      return 'failed to register'
    }
  }

  async findOne(loginDto: LoginDto) {
    const user = await this.userRepository.findOneBy({
      name: loginDto.username
    })

    if (!user) {
      throw new HttpException('user not registered yet', 200)
    }
    if (md5(loginDto.password) !== user.password) {
      throw new HttpException('user password not corrected', 200)
    }
    return user
  }
}
