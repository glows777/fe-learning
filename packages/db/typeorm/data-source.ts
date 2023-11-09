import "reflect-metadata"
import { DataSource } from "typeorm"
import 'dotenv/config'

import { User } from "./entity/User"
import IDCard from "./entity/IDCard"
import Employee from "./entity/Employee"
import Department from "./entity/Department"
import Article from "./entity/Article"
import Tag from "./entity/Tag"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.HOST,
    port: Number(process.env.PORT),
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    synchronize: true,
    logging: true,
    entities: [User, IDCard, Employee, Department, Article, Tag],
    migrations: [],
    subscribers: [],
    connectorPackage: 'mysql2',
})
