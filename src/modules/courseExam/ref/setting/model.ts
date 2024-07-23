import { Model, JSONSchema } from 'objection'
import { Knex } from 'knex'
import objectionVisibility from 'objection-visibility'

import CourseExam from '../../model'

export default class CourseExamSetting extends objectionVisibility(Model) {
  id: number
  courseExamId: number
  name: string
  type: string
  template: object

  createdBy: string
  createdAt: Date
  modifiedBy: string
  modifiedAt: Date

  static tableName = 'course_exam_setting'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['courseExamId', 'type', 'template'],
    properties: {
      type: { type: 'string', enum: ['setting', 'assessment'] },
    },
  }
}

export const createSchemaCourseExamSetting = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(CourseExamSetting.tableName))) {
      await knex.schema.createTable(CourseExamSetting.tableName, (table) => {
        table.increments()
        table.integer('courseExamId').notNullable().index(`${CourseExamSetting.tableName}_course_exam_id`)
        table.string('type', 16).notNullable().index(`${CourseExamSetting.tableName}_type`)
        table.string('name', 96).notNullable()
        table.jsonb('template').nullable()
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('modifiedAt').defaultTo(knex.fn.now())
        table.string('createdBy', 48)
        table.string('modifiedBy', 48)

        table.foreign('courseExamId').references('id').inTable(CourseExam.tableName)
      })
    }
  } catch (error) {
    throw new Error(error)
  }
}
