import mysql2 from 'mysql2/promise'
import 'dotenv/config'
;(async function () {
  const pool = mysql2.createPool({
    database: process.env.DATABASE,
    host: process.env.HOST,
    user: process.env.USER_NAME,
    port: Number(process.env.PORT),
    password: process.env.PASSWORD,
  })
  const res = await pool.query('insert into students (name) values (?)', [
    'wang',
  ])

  const data = await pool.query('select * from students')
  console.log(data[0])
})()
