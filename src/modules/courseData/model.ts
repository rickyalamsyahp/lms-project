import { Knex } from 'knex'
import { JSONSchema, Model } from 'objection'
import objectionVisibility from 'objection-visibility'

export default class CouserData extends objectionVisibility(Model) {
  id: string
  filename: string
  createdAt: Date
  createdBy: string
  modifiedAt: Date
  modifiedBy: string

  static tableName = 'courseData'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['filename'],
  }
}

export const createSchemaCourseData = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(CouserData.tableName))) {
      await knex.schema.createTable(CouserData.tableName, (table) => {
        table.string('filename', 32).notNullable()
      })
    }
  } catch (error) {
    throw new Error(error)
  }
}
