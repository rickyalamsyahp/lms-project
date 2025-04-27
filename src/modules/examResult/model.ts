/* eslint-disable @typescript-eslint/no-var-requires */
import objectionVisibility from 'objection-visibility'
import Student from '../student/model'
import QuestionBank from '../bankSoal/model'
import { JSONSchema, Model, RelationMappings } from 'objection'
import { Knex } from 'knex'

export default class ExamResult extends objectionVisibility(Model) {
  id: string
  studentId: string
  questionBankId: string
  score: number

  createdAt: Date
  createdBy: string
  modifiedAt: Date
  modifiedBy: string
  static tableName = 'exam_results'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['id', 'studentId', 'questionBankId', 'score'],
    properties: {
      studentId: { type: 'string' },
      questionBankId: { type: 'string' },
      score: { type: 'number' },
    },
  }

  static get relationMappings(): RelationMappings {
    // Import here to avoid circular dependencies
    const QuestionBank = require('../bankSoal/model').default

    return {
      student: {
        relation: Model.BelongsToOneRelation,
        modelClass: Student,
        join: { from: 'exam_results.studentNis', to: 'students.nis' },
      },
      questionBank: {
        relation: Model.BelongsToOneRelation,
        modelClass: QuestionBank,
        join: { from: 'exam_results.questionBankId', to: 'question_banks.id' },
      },
    }
  }
}

export const createSchemaExamResult = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(ExamResult.tableName))) {
      await knex.schema.createTable(ExamResult.tableName, (table) => {
        table.string('id').notNullable().unique().index(`${ExamResult.tableName}_id`)
        table.string('studentId', 72).notNullable()
        table.string('questionBankId', 72).notNullable()
        table.double('score', 72).notNullable()

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
