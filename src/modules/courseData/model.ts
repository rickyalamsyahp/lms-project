import { Model, JSONSchema, RelationMappings, RelationMappingsThunk } from 'objection'
import Scope, { ScopeSlug } from '../scope/model'
import { Knex } from 'knex'
import { register } from '../auth/service'
import objectionVisibility from 'objection-visibility'
import FileMeta from '../fileMeta/model'

export default class CouserData extends objectionVisibility(Model) {
  id: string
  pagi: string
  filename: string
  createdAt: Date
  createdBy: string
  modifiedAt: Date
  modifiedBy: string

  static tableName = 'courseData'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['pagi', 'filename'],
    properties: {
      pagi: { type: 'string', minLength: 3, maxLength: 200 },
    },
  }
}

export const createSchemaCourseData = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(CouserData.tableName))) {
      await knex.schema.createTable(CouserData.tableName, (table) => {
        table.string('id').notNullable().unique().index(`${CouserData.tableName}_id`)
        table.string('pagi', 200).notNullable().index(`${CouserData.tableName}_pagi`)
        table.string('filename', 32).notNullable()
      })
    }
  } catch (error) {
    throw new Error(error)
  }
}
