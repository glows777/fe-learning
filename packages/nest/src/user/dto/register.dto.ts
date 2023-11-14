import { IsNotEmpty, IsString, Length, Matches } from 'class-validator'

export class RegisterDto {

    @IsNotEmpty()
    @IsString()
    @Length(6, 30)
    @Matches(/^[a-zA-Z0-9#$%_-]+$/, {
        message: 'only accept zifu like #、$、%、_、- '
    })
    username: string

    @IsNotEmpty()
    @IsString()
    @Length(6, 30)
    password: string
}