import { Model, JSONSchema, RelationMappings, RelationMappingsThunk } from 'objection'
import { Knex } from 'knex'
import objectionVisibility from 'objection-visibility'
import FileMeta from '../fileMeta/model'

export default class Lesson extends objectionVisibility(Model) {
  id: number
  filename: string
  title: string
  description: string

  published: boolean
  publishedAt: Date
  publishedBy: string

  fileMeta: FileMeta

  createdBy: string
  createdAt: Date
  modifiedBy: string
  modifiedAt: Date

  static tableName = 'lesson'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['title', 'filename'],
    properties: {
      title: { type: 'string' },
    },
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

export const createSchemaLesson = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(Lesson.tableName))) {
      await knex.schema.createTable(Lesson.tableName, (table) => {
        table.increments()
        table.string('title', 160).notNullable().index(`${Lesson.tableName}_title`)
        table.text('description').nullable()
        table.string('filename', 32).notNullable()
        table.boolean('published').defaultTo(false)
        table.timestamp('publishedAt').nullable()
        table.string('publishedBy', 48)
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
