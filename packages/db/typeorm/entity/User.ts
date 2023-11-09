import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm"
import IDCard from "./IDCard"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    age: number

    @OneToOne(() => IDCard, (idCard) => idCard.user)
    idCard: IDCard
}
