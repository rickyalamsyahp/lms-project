import { Knex } from 'knex'
import { Model, JSONSchema } from 'objection'


export default class Category extends Model {
  id!: number
  name!: string


  createdBy: string
  createdAt: Date
  modifiedBy: string
  modifiedAt: Date
  static tableName = 'category'
  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['name'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 3, maxLength: 16 },
    },
  }
}

export const createSchemaCategory = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(Category.tableName))) {
      console.log(`Create table ${Category.tableName}`)
      await knex.schema.createTable(Category.tableName, (table) => {
        table.increments()
        table.string('name', 16).notNullable().unique()
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('modifiedAt').defaultTo(knex.fn.now())
        table.string('createdBy', 48)
        table.string('modifiedBy', 48)
      })
    }
  } catch (error) {
    throw new Error(error)
  }
}
