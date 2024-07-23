import { Model, JSONSchema } from 'objection'
import { Knex } from 'knex'
import objectionVisibility from 'objection-visibility'

import Submission from '../../model'

export default class SubmissionExam extends objectionVisibility(Model) {
  id: number
  submissionId: number
  setting: object
  assessment: object

  static tableName = 'submission_exam'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['submissionId', 'setting'],
  }
}

export const createSchemaSubmissionExam = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(SubmissionExam.tableName))) {
      await knex.schema.createTable(SubmissionExam.tableName, (table) => {
        table.increments()
        table.integer('submissionId').notNullable().index(`${SubmissionExam.tableName}_submission_id`)
        table.jsonb('setting').notNullable()
        table.jsonb('assessment').nullable()

        table.foreign('submissionId').references('id').inTable(Submission.tableName)
      })
    }
  } catch (error) {
    throw new Error(error)
  }
}
