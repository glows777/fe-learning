import { IsNotEmpty, IsString, Length } from 'class-validator'

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    @Length(5, 30)
    name: string

    @IsNotEmpty()
    @IsString()
    @Length(5, 30)
    password: string
}