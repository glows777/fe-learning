import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Student {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 50,
        comment: '姓名'
    })
    name: string

    @Column({
        length: 50,
        comment: '密码'
    })  
    password: string
    
    @CreateDateColumn({
        comment: '创建时间'
    })
    createdTime: Date

    @UpdateDateColumn({
        comment: '更新时间'
    })
    updatedTime: Date
}
