import { Model, JSONSchema, RelationMappings, RelationMappingsThunk } from 'objection'
import { Knex } from 'knex'
import objectionVisibility from 'objection-visibility'
import Course from '../course/model'
import { createSchemaCourseExamSetting } from './ref/setting/model'
import FileMeta from '../fileMeta/model'

export default class CourseExam extends objectionVisibility(Model) {
  id: number
  courseId: number
  title: string
  description: string
  level: number
  filename: string

  course: Course

  createdBy: string
  createdAt: Date
  modifiedBy: string
  modifiedAt: Date

  static tableName = 'course-exam'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['title', 'courseId'],
    properties: {
      title: { type: 'string' },
    },
  }

  static relationMappings: RelationMappings | RelationMappingsThunk = () => ({
    course: {
      relation: Model.HasOneRelation,
      modelClass: Course,
      join: {
        from: `${this.tableName}.courseId`,
        to: `${Course.tableName}.id`,
      },
    },
  })
}

export const createSchemaCourseExam = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(CourseExam.tableName))) {
      await knex.schema.createTable(CourseExam.tableName, (table) => {
        table.increments()
        table.integer('courseId').notNullable().index(`${CourseExam.tableName}_course_id`)
        table.string('title', 160).notNullable().index(`${CourseExam.tableName}_title`)
        table.text('description').nullable()
        table.string('filename', 32).nullable()
        table.integer('level').defaultTo(1)
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('modifiedAt').defaultTo(knex.fn.now())
        table.string('createdBy', 48)
        table.string('modifiedBy', 48)

        table.foreign('courseId').references('id').inTable(Course.tableName)
        table.foreign('filename').references('filename').inTable(FileMeta.tableName)
      })
    }

    await createSchemaCourseExamSetting(knex)
  } catch (error) {
    throw new Error(error)
  }
}
