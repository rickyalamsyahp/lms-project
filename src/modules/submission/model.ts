import { Model, JSONSchema, RelationMappings, RelationMappingsThunk } from 'objection'
import { Knex } from 'knex'
import objectionVisibility from 'objection-visibility'
import { jsonProperties } from '@/constant'
import { enumToArray } from '@/libs/utils'
import User from '../user/model'

import Log, { createSchema as createSchemaLog } from './ref/log/model'
import Report, { createSchema as createSchemaReport } from './ref/report/model'
import Course from '../course/model'
import CourseExam from '../courseExam/model'
import SubmissionExam, { createSchemaSubmissionExam } from './ref/exam/model'
import { SUBMISSION_OBJECT_TYPE } from '@/constant/env'

export enum SubmissionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  FINISHED = 'finished',
}

export default class Submission extends objectionVisibility(Model) {
  id: number
  owner: string
  objectType: string
  status: any
  courseId: number
  courseExamId: number
  score: number

  createdBy: string
  createdAt: Date
  finishedAt: Date
  canceledAt: Date

  log: Log
  report: Report
  exam: SubmissionExam

  static tableName = 'submission'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['owner', 'objectType', 'courseId', 'courseExamId'],
    properties: {
      owner: jsonProperties.uuid,
      objectType: { type: 'string', enum: SUBMISSION_OBJECT_TYPE },
      status: { type: 'string', enum: enumToArray(SubmissionStatus) },
    },
  }

  static relationMappings: RelationMappings | RelationMappingsThunk = () => ({
    log: {
      relation: Model.HasManyRelation,
      modelClass: Log,
      join: {
        from: `${this.tableName}.id`,
        to: `${Log.tableName}.submissionId`,
      },
    },
    report: {
      relation: Model.HasManyRelation,
      modelClass: Report,
      join: {
        from: `${this.tableName}.id`,
        to: `${Report.tableName}.submissionId`,
      },
    },
    course: {
      relation: Model.HasOneRelation,
      modelClass: Course,
      join: {
        from: `${this.tableName}.courseId`,
        to: `${Course.tableName}.id`,
      },
    },
    courseExam: {
      relation: Model.HasOneRelation,
      modelClass: CourseExam,
      join: {
        from: `${this.tableName}.courseExamId`,
        to: `${CourseExam.tableName}.id`,
      },
    },
    exam: {
      relation: Model.HasOneRelation,
      modelClass: SubmissionExam,
      join: {
        from: `${this.tableName}.id`,
        to: `${SubmissionExam.tableName}.submissionId`,
      },
    },
  })
}

export const createSchema = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(Submission.tableName))) {
      await knex.schema.createTable(Submission.tableName, (table) => {
        table.increments()
        table.string('owner', 36).notNullable().index(`${Submission.tableName}_owner`)
        table.integer('courseId').notNullable().index(`${Submission.tableName}_course_id`)
        table.integer('courseExamId').notNullable().index(`${Submission.tableName}_course_exam_id`)
        table.string('objectType', 16).notNullable().index(`${Submission.tableName}_objectType`)
        table.string('status', 16).defaultTo(SubmissionStatus.ACTIVE)
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.string('createdBy', 48)
        table.timestamp('finishedAt').nullable()
        table.timestamp('canceledAt').nullable()
        table.string('reviewedBy', 48)
        table.integer('score').nullable()

        table.foreign('owner').references('id').inTable(User.tableName)
        table.foreign('courseId').references('id').inTable(Course.tableName)
        table.foreign('courseExamId').references('id').inTable(CourseExam.tableName)
      })
    }

    await createSchemaLog(knex)
    await createSchemaReport(knex)
    await createSchemaSubmissionExam(knex)
  } catch (error) {
    throw new Error(error)
  }
}
