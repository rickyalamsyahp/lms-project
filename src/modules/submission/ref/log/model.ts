import { Model, JSONSchema, RelationMappings, RelationMappingsThunk } from 'objection'
import { Knex } from 'knex'
import objectionVisibility from 'objection-visibility'
import Submission from '../../model'
import FileMeta from '@/modules/fileMeta/model'

export default class Log extends objectionVisibility(Model) {
  id: number
  submissionId: number
  filename: string
  tag: string
  createdBy: string
  createdAt: Date
  isExternalFile: boolean

  fileMeta: FileMeta

  static tableName = 'submission-log'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['submissionId'],
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

export const createSchema = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(Log.tableName))) {
      await knex.schema.createTable(Log.tableName, (table) => {
        table.increments()
        table.integer('submissionId').notNullable().index(`${Log.tableName}_submission_id`)
        table.string('filename', 32).notNullable()
        table.string('tag', 32).nullable().index(`${Log.tableName}_tag`)
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.string('createdBy', 48)
        table.boolean('isExternalFile').defaultTo(false)

        table.foreign('submissionId').references('id').inTable(Submission.tableName)
        table.foreign('filename').references('filename').inTable(FileMeta.tableName)
      })
    }
  } catch (error) {
    throw new Error(error)
  }
}
