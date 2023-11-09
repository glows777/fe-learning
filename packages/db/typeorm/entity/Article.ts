import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import Tag from './Tag'

@Entity()
export default class Article {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100,
    comment: '文章标题',
  })
  title: string

  @Column({
    type: 'text',
    comment: '文章内容',
  })
  content: string

  @JoinTable()
  @ManyToMany(() => Tag, (tag) => tag.articles, {
    cascade: true
  })
  tags: Tag[]
}
