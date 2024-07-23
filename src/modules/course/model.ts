import { Model, JSONSchema } from 'objection'
import { Knex } from 'knex'
import objectionVisibility from 'objection-visibility'
import FileMeta from '../fileMeta/model'

export default class Course extends objectionVisibility(Model) {
  id: number
  filename: string
  title: string
  description: string
  level: number

  published: boolean
  publishedAt: Date
  publishedBy: string

  createdBy: string
  createdAt: Date
  modifiedBy: string
  modifiedAt: Date

  static tableName = 'course'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['title', 'filename'],
    properties: {
      title: { type: 'string' },
    },
  }
}

export const createSchemaCourse = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(Course.tableName))) {
      await knex.schema.createTable(Course.tableName, (table) => {
        table.increments()
        table.string('title', 160).notNullable().index(`${Course.tableName}_title`)
        table.text('description').nullable()
        table.string('filename', 32).notNullable()
        table.boolean('published').defaultTo(false)
        table.timestamp('publishedAt').nullable()
        table.integer('level').defaultTo(1)
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('modifiedAt').defaultTo(knex.fn.now())
        table.string('createdBy', 48)
        table.string('modifiedBy', 48)

        table.foreign('filename').references('filename').inTable(FileMeta.tableName)
      })
    }
  } catch (error) {
    throw new Error(error)
  }
}
