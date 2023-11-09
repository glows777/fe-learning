import { AppDataSource } from './data-source'
import Article from './entity/Article'
import Department from './entity/Department'
import Employee from './entity/Employee'
import Tag from './entity/Tag'

AppDataSource.initialize()
  .then(async () => {
    // const a1 = new Article()
    // a1.title = 'aaaa'
    // a1.content = 'aaaaaaaaaa'
    // a1.id = 1

    // const a2 = new Article()
    // a2.title = 'bbbbbb'
    // a2.content = 'bbbbbbbbbb'
    // a2.id = 2

    // const t1 = new Tag()
    // t1.name = 'ttt1111'

    // const t2 = new Tag()
    // t2.name = 'ttt2222'

    // const t3 = new Tag()
    // t3.name = 'ttt33333'

    // a1.tags = [t1, t2]
    // a2.tags = [t1, t2, t3]

    // await AppDataSource.manager.save(Article, [a1, a2])

    // const res = await AppDataSource.manager.find(Article, {
    //   relations: {
    //     tags: true
    //   }
    // })
    // const res2 = await AppDataSource.manager.getRepository(Article).createQueryBuilder('a')
    //   .leftJoinAndSelect('a.tags', 't')
    //   .getMany()
    // console.log(res2)

    // const article = await AppDataSource.manager.getRepository(Article).findOne({
    //   relations: {
    //     tags: true
    //   },
    //   where: {
    //     id: 2
    //   }
    // })
    // if (article) {
    //   article.title = 'hello2'
    //   article.tags = article.tags.filter(tag => tag.name.includes('111'))
    // }
    // await AppDataSource.manager.save(article)

    const res3 = await AppDataSource.manager
      .getRepository(Tag)
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.articles', 'a')
      .where('t.id = :id', { id: 4 })
      .getMany()
    console.log(res3)
  })
  .catch((error) => console.log(error))
