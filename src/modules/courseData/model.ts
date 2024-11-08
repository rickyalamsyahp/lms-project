import { Knex } from 'knex'
import { JSONSchema, Model, RelationMappings, RelationMappingsThunk } from 'objection'
import objectionVisibility from 'objection-visibility'
import FileMeta from '../fileMeta/model'

export default class CouserData extends objectionVisibility(Model) {
  id: number
  filename: string
  createdAt: Date
  createdBy: string
  modifiedAt: Date
  modifiedBy: string

  static tableName = 'course_data'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['filename'],
  }

  static relationMappings: RelationMappings | RelationMappingsThunk = () => ({
    fileMeta: {
      relation: Model.HasOneRelation,
      modelClass: FileMeta,
      join: {
        from: `${this.tableName}.filename`,
        to: `${FileMeta.tableName}.filename`,
      },
    },
  })
}

export const createSchemaCourseData = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(CouserData.tableName))) {
      await knex.schema.createTable(CouserData.tableName, (table) => {
        table.increments('id').primary()
        table.string('filename', 32).nullable()

        table.foreign('filename').references('filename').inTable(FileMeta.tableName)
      })
    }
  } catch (error) {
    throw new Error(error)
  }
}
