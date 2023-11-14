import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { createClient } from 'redis'
import 'dotenv/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { User } from './user/entities/user.entity'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: Number(process.env.PORT),
      username: process.env.USER_NAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      synchronize: true,
      logging: true,
      entities: [User],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
    JwtModule.register({
      global: true,
      secret: 'glows777',
      signOptions: {
        expiresIn: '7d'
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: 'REDIS_CLIENT',
    async useFactory() {
      const client = createClient({
        socket: {
          host: process.env.HOST,
          port: Number(process.env.REDIS_PORT)
        }
      })
      await client.connect()
      return client
    }
  }],
})
export class AppModule {}
