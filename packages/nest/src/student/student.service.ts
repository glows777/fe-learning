import { HttpException, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Student } from './entities/student.entity'
import { Repository } from 'typeorm'
import { RegisterDto } from './dto/register.dto'
import * as crypto from 'crypto'
import { LoginDto } from './dto/login.dto'

const md5 = (str: string) => {
  const hash = crypto.createHash('md5')
  hash.update(str)
  return hash.digest('hex')
}

@Injectable()
export class StudentService {

  private logger = new Logger()

  @InjectRepository(Student)
  private studentRepository: Repository<Student>

  async create(registerDto: RegisterDto) {
    const foundUser = await this.studentRepository.findOneBy({
      name: registerDto.name,
    })
    if (foundUser) {
      throw new HttpException('user already registered!', 200)
    }

    const student = new Student()
    student.name = registerDto.name
    student.password = md5(registerDto.password)
    try {
      await this.studentRepository.save(student)
      return 'register successfully'
    } catch (e) {
      this.logger.error(e, StudentService)
      throw new HttpException('failed to register', 200)
    }
  }

  async findOne(loginDto: LoginDto) {
      const student = await this.studentRepository.findOneBy({
        name: loginDto.name
      })
      if (!student) {
        throw new HttpException('can not not found student, please register a new one first', 200)
      }
      if (student.password !== md5(loginDto.password)) {
        throw new UnauthorizedException('wrong password')
      }
      return student
  }
  async findById(stuId: number) {
    const student = await this.studentRepository.findOneBy({
      id: stuId
    })
    return student
  }
}
