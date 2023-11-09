import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Department from "./Department";

@Entity()
export default class Employee {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 50
    })
    name: string

    @ManyToOne(() => Department, {
        cascade: true
    })
    department: Department
}