import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import Article from './Article'

@Entity()
export default class Tag {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100,
  })
  name: string

  @JoinTable()
  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[]
}
