import { sqlConnection } from './sql'
import { Knex } from 'knex'

let sql: Knex | any
const dbConnection = async (callback: (sql: Knex) => void) => {
  sql = await sqlConnection()
  callback(sql)
}

export { sql }

export default dbConnection
