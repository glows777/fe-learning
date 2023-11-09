import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Employee from "./Employee";

@Entity()
export default class Department {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 50
    })
    name: string

    @OneToMany(() => Employee, (employee) => employee.department)
    employees: Employee[]
}