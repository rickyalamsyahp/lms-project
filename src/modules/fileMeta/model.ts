import { Knex } from 'knex'
import { Model, JSONSchema } from 'objection'
import objectionVisibility from 'objection-visibility'

export default class FileMeta extends objectionVisibility(Model) {
  id!: number
  filename!: string
  originalname!: string
  encoding!: string
  mimetype: string
  size: number
  path: string

  static tableName = 'file_meta'
  static hidden = ['path']
  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['filename', 'originalname', 'mimetype', 'size'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 3, maxLength: 16 },
      slug: { type: 'string', minLength: 3, maxLength: 16 },
    },
  }
}

export const createSchema = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(FileMeta.tableName))) {
      console.log(`Create table ${FileMeta.tableName}`)
      await knex.schema.createTable(FileMeta.tableName, (table) => {
        table.increments()
        table.string('filename', 32).notNullable().unique().index(`${FileMeta.tableName}_filename`)
        table.string('originalname').notNullable()
        table.string('encoding', 8).nullable()
        table.string('mimetype').notNullable()
        table.integer('size').notNullable()
        table.string('path')
      })
    }
  } catch (error) {
    throw new Error(error)
  }
}
