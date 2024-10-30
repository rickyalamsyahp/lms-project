import { Model, JSONSchema } from 'objection'
import { Knex } from 'knex'
import objectionVisibility from 'objection-visibility'

import Course from '../course/model'

export default class CourseSetting extends objectionVisibility(Model) {
  id: number
  courseId: number
  name: string
  type: string
  template: object

  createdBy: string
  createdAt: Date
  modifiedBy: string
  modifiedAt: Date

  static tableName = 'course_setting'
  s
  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['courseId', 'type', 'template'],
    properties: {
      type: { type: 'string', enum: ['setting', 'assessment'] },
    },
  }
}

export const createSchemaCourseSetting = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(CourseSetting.tableName))) {
      await knex.schema.createTable(CourseSetting.tableName, (table) => {
        table.increments()
        table.integer('courseId').notNullable().index(`${CourseSetting.tableName}_course_exam_id`)
        table.string('type', 16).notNullable().index(`${CourseSetting.tableName}_type`)
        table.string('name', 96).notNullable()
        table.jsonb('template').nullable()
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('modifiedAt').defaultTo(knex.fn.now())
        table.string('createdBy', 48)
        table.string('modifiedBy', 48)

        table.foreign('courseId').references('id').inTable(Course.tableName)
      })
    }
  } catch (error) {
    throw new Error(error)
  }
}
