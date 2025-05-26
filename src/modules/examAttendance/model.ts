import { Model, JSONSchema, RelationMappings } from 'objection'
import objectionVisibility from 'objection-visibility'
import { Knex } from 'knex'

export default class ExamAttendance extends objectionVisibility(Model) {
  id: string
  questionBankId: string
  studentId: string
  isPresent: boolean
  loginTime?: Date
  logoutTime?: Date
  onlineStatus: boolean
  ipAddress?: string
  userAgent?: string

  static tableName = 'exam_attendances'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['questionBankId', 'studentId'],
    properties: {
      id: { type: 'string' },
      questionBankId: { type: 'string' },
      studentId: { type: 'string' },
      isPresent: { type: 'boolean' },
      loginTime: { type: ['string', 'null'], format: 'date-time' },
      logoutTime: { type: ['string', 'null'], format: 'date-time' },
      onlineStatus: { type: 'boolean' },
      ipAddress: { type: ['string', 'null'] },
      userAgent: { type: ['string', 'null'] },
    },
  }
}

export const createSchemaExamAttendance = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable('exam_attendances'))) {
      await knex.schema.createTable('exam_attendances', (table) => {
        table.string('id').primary()
        table.string('questionBankId').notNullable()
        table.string('studentId').notNullable()
        table.boolean('isPresent').defaultTo(false)
        table.timestamp('loginTime').nullable()
        table.timestamp('logoutTime').nullable()
        table.boolean('onlineStatus').defaultTo(false)
        table.string('ipAddress').nullable()
        table.text('userAgent').nullable()
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('updatedAt').defaultTo(knex.fn.now())

        table.unique(['questionBankId', 'studentId'])
      })
    }
  } catch (err) {
    throw new Error(err)
  }
}
