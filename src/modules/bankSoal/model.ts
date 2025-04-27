import objectionVisibility from 'objection-visibility'
import Teacher from '../teacher/model'
import Classroom from '../classroom/model'
import { JSONSchema, Model, RelationMappings } from 'objection'
import { Knex } from 'knex'
import Matapelajaran from '../matapelajaran/model'
import ExamResult from '../examResult/model'
export default class QuestionBank extends objectionVisibility(Model) {
  id: string
  teacherId: number
  mataPelajaranId: string
  classroomId: number
  title: string
  scheduledAt: string
  jamUjian: string
  duration: number
  semester: string

  createdAt: Date
  createdBy: string
  modifiedAt: Date
  modifiedBy: string

  static tableName = 'question_banks'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['teacherId', 'mataPelajaranId', 'classroomId', 'title'],
    properties: {
      teacherId: { type: 'integer' },
      mataPelajaranId: { type: 'string' },
      classroomId: { type: 'integer' },
      title: { type: 'string' },
      duration: { type: 'integer' },
      semester: { type: 'string' },
      scheduledAt: { type: 'string' },
      jamUjian: { type: 'string' },
    },
  }

  static relationMappings: RelationMappings = {
    teacher: {
      relation: Model.BelongsToOneRelation,
      modelClass: Teacher,
      join: { from: 'question_banks.teacherId', to: `${Teacher.tableName}.kode` },
    },
    subject: {
      relation: Model.BelongsToOneRelation,
      modelClass: Matapelajaran,
      join: { from: `${this.tableName}.mataPelajaranId`, to: `${Matapelajaran.tableName}.kode` },
    },
    classroom: {
      relation: Model.BelongsToOneRelation,
      modelClass: Classroom,
      join: { from: 'question_banks.classroomId', to: `${Classroom.tableName}.kode` },
    },
    result: {
      relation: Model.BelongsToOneRelation,
      modelClass: ExamResult,
      join: { from: 'question_banks.id', to: `${ExamResult.tableName}.questionBankId` },
    },
  }
}

export const createSchemaBankSoal = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(QuestionBank.tableName))) {
      await knex.schema.createTable(QuestionBank.tableName, (table) => {
        table.string('id').notNullable().unique().index(`${QuestionBank.tableName}_id`)
        table.integer('teacherId', 72).notNullable()
        table.string('mataPelajaranId', 72).notNullable()
        table.integer('classroomId', 72).notNullable()
        table.string('title', 120).notNullable()
        table.integer('duration', 120).notNullable()
        table.string('scheduledAt', 120).notNullable()
        table.string('jamUjian', 120).notNullable()
        table.string('semester', 120).notNullable()
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
