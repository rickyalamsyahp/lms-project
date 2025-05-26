import { Knex } from 'knex'
import { JSONSchema, Model } from 'objection'
import objectionVisibility from 'objection-visibility'
export enum ActivityType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  EXAM_START = 'exam_start',
  EXAM_SUBMIT = 'exam_submit',
  EXAM_AUTO_SUBMIT = 'exam_auto_submit',
  EXAM_REOPEN = 'exam_reopen',
  QUESTION_CREATE = 'question_create',
  QUESTION_UPDATE = 'question_update',
  QUESTION_DELETE = 'question_delete',
  AUTO_SAVE = 'auto_save',
}

export default class ActivityLog extends objectionVisibility(Model) {
  id?: string
  userId?: string
  userType?: 'student' | 'teacher' | 'admin'
  activity?: ActivityType
  description?: string
  metadata?: string // JSON string in DB
  ipAddress?: string
  userAgent?: string

  static tableName = 'activity_logs'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['userId', 'userType', 'activity', 'description'],
    properties: {
      id: { type: 'string' },
      userId: { type: 'string' },
      userType: { type: 'string', enum: ['student', 'teacher', 'admin'] },
      activity: { type: 'string', enum: Object.values(ActivityType) },
      description: { type: 'string' },
      metadata: { type: ['string', 'null'] }, // JSON string in DB
      ipAddress: { type: ['string', 'null'] },
      userAgent: { type: ['string', 'null'] },
    },
  }

  // Getter for metadata to parse JSON
  get metadataParsed(): Record<string, any> {
    if (!this.metadata) return {}
    try {
      return JSON.parse(this.metadata)
    } catch {
      return {}
    }
  }
}

export const createSchemaActivityLog = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable('activity_logs'))) {
      await knex.schema.createTable('activity_logs', (table) => {
        table.string('id').primary()
        table.string('userId').notNullable()
        table.enu('userType', ['student', 'teacher', 'admin']).notNullable()
        table.enu('activity', Object.values(ActivityType)).notNullable()
        table.text('description').notNullable()
        table.json('metadata').nullable()
        table.string('ipAddress').nullable()
        table.text('userAgent').nullable()
        table.timestamp('createdAt').defaultTo(knex.fn.now())

        table.index('userId')
        table.index('activity')
        table.index('createdAt')
      })
    }
  } catch (err) {
    throw new Error(err)
  }
}
