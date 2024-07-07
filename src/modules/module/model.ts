import { Model, JSONSchema } from 'objection'
import { Knex } from 'knex'
import objectionVisibility from 'objection-visibility'

export default class Module extends objectionVisibility(Model) {
  id: number
  filename: string
  title: string
  description: string

  published: boolean
  publishedAt: Date
  publishedBy: string

  createdBy: string
  createdAt: Date
  modifiedBy: string
  modifiedAt: Date

  static tableName = 'module'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['title', 'filename'],
    properties: {
      title: { type: 'string' },
    },
  }
}

export const createSchemaModule = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(Module.tableName))) {
      await knex.schema.createTable(Module.tableName, (table) => {
        table.increments()
        table.string('title', 160).notNullable().index(`${Module.tableName}_title`)
        table.text('description').nullable()
        table.string('filename', 32).notNullable()
        table.boolean('published').defaultTo(false)
        table.timestamp('publishedAt').nullable()
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
