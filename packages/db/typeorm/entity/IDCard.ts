import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({
    name: 'id_card'
})
export default class IDCard {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 50,
        comment: '身份证号'
    })
    cardName: string

    @JoinColumn()
    @OneToOne(() => User, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        cascade: true
    })
    user: User
}