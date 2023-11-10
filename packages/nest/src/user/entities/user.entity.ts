import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        name: 'aaa_name',
        length: 50
    })
    name: string
}
