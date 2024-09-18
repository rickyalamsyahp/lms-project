// import { tableNames } from '../../constant'
import knex from 'knex'
import { Model, knexSnakeCaseMappers } from 'objection'
import { createSchema as createSchemaScope } from '@/modules/scope/model'
import { createSchema as createSchemaFilemeta } from '@/modules/fileMeta/model'
import { createSchema as createSchemaUser } from '@/modules/user/model'
import { createSchema as createSchemaSubmission } from '@/modules/submission/model'
import { CREATE_TABLE, PG_DATABASE, PG_HOST, PG_PASSWORD, PG_PORT, PG_USER, PG_VERSION } from '@/constant/env'
import { createSchemaCourse } from '@/modules/course/model'
import { createSchemaCourseExam } from '@/modules/courseExam/model'
import { createSchemaCourseSetting } from '@/modules/courseSetting/model'

export const sqlConnection = () =>
  new Promise(async (resolve, reject) => {
    console.log('knexConnection - make connection to knexConnection db')
    const knexConnection = knex({
      client: 'pg',
      version: PG_VERSION,
      connection: {
        host: PG_HOST,
        port: Number(PG_PORT),
        user: PG_USER,
        password: PG_PASSWORD,
        database: PG_DATABASE,
      },
      ...knexSnakeCaseMappers(),
    })

    Model.knex(knexConnection)
    console.log('knexConnection - successfully connected')
    if (CREATE_TABLE !== '1') resolve(knexConnection)

    try {
      console.log('knexConnection - create table')
      // Create table
      await createSchemaScope(knexConnection)
      await createSchemaFilemeta(knexConnection)
      await createSchemaUser(knexConnection)
      await createSchemaCourse(knexConnection)
      await createSchemaCourseExam(knexConnection)
      await createSchemaCourseSetting(knexConnection)
      await createSchemaSubmission(knexConnection)
      // End of create table
      resolve(knexConnection)
    } catch (error) {
      reject(error)
    }
  })
