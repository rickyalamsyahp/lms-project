import { Knex } from 'knex'
import { JSONSchema, Model, RelationMappings } from 'objection'
import objectionVisibility from 'objection-visibility'
/* eslint-disable @typescript-eslint/no-var-requires */
export enum ExamResultStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  AUTO_SUBMITTED = 'auto_submitted',
  REOPENED = 'reopened',
}

export default class ExamResult extends objectionVisibility(Model) {
  id: string
  studentId: string
  questionBankId: string
  score: number
  totalPoints: number
  percentage: number
  status: ExamResultStatus
  startedAt?: Date
  submittedAt?: Date
  duration?: number
  answers: Record<string, any> // Will be stored as JSON string
  autoSaveData?: Record<string, any> // Will be stored as JSON string
  reviewFlag: boolean
  reopenedBy?: string
  reopenedAt?: Date
  ipAddress?: string
  userAgent?: string

  createdAt: Date
  createdBy: string
  modifiedAt: Date
  modifiedBy: string

  static tableName = 'exam_results'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['studentId', 'questionBankId'],
    properties: {
      studentId: { type: 'string' },
      questionBankId: { type: 'string' },
      score: { type: 'number' },
      totalPoints: { type: 'number' },
      percentage: { type: 'number' },
      status: { type: 'string', enum: Object.values(ExamResultStatus) },
      duration: { type: ['integer', 'null'] },
      answers: { type: ['string', 'null'] }, // JSON string in DB
      autoSaveData: { type: ['string', 'null'] }, // JSON string in DB
      reviewFlag: { type: 'boolean' },
      reopenedBy: { type: ['string', 'null'] },
      ipAddress: { type: ['string', 'null'] },
      userAgent: { type: ['string', 'null'] },
    },
  }

  // Getter for answers to parse JSON
  get answersParsed(): Record<string, any> {
    if (!this.answers) return {}
    try {
      return JSON.parse(this.answers as any)
    } catch {
      return {}
    }
  }

  // Getter for autoSaveData to parse JSON
  get autoSaveDataParsed(): Record<string, any> {
    if (!this.autoSaveData) return {}
    try {
      return JSON.parse(this.autoSaveData as any)
    } catch {
      return {}
    }
  }

  static get relationMappings(): RelationMappings {
    const QuestionBank = require('../bankSoal/model').default
    const Student = require('../student/model').default

    return {
      student: {
        relation: Model.BelongsToOneRelation,
        modelClass: Student,
        join: { from: 'exam_results.studentId', to: 'siswa.nis' },
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
        table.double('score').defaultTo(0)
        table.double('totalPoints').defaultTo(0)
        table.double('percentage').defaultTo(0)
        table.enu('status', Object.values(ExamResultStatus)).defaultTo(ExamResultStatus.NOT_STARTED)
        table.timestamp('startedAt').nullable()
        table.timestamp('submittedAt').nullable()
        table.integer('duration').nullable()
        table.json('answers').defaultTo('{}')
        table.json('autoSaveData').nullable()
        table.boolean('reviewFlag').defaultTo(false)
        table.string('reopenedBy').nullable()
        table.timestamp('reopenedAt').nullable()
        table.string('ipAddress').nullable()
        table.text('userAgent').nullable()
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('modifiedAt').defaultTo(knex.fn.now())
        table.string('createdBy', 48)
        table.string('modifiedBy', 48)

        // Add unique constraint
        // table.unique(['studentId', 'questionBankId'])
      })
    }
  } catch (error) {
    throw new Error(error)
  }
}
