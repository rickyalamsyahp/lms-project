import { Model, JSONSchema, RelationMappings, RelationMappingsThunk } from 'objection'
import { Knex } from 'knex'
import objectionVisibility from 'objection-visibility'
import { jsonProperties } from '@/constant'
import { enumToArray } from '@/libs/utils'
import User from '../user/model'

import Log, { createSchema as createSchemaLog } from './ref/log/model'
import Report, { createSchema as createSchemaReport } from './ref/report/model'
import Module from '../module/model'

export enum SubmissionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  FINISHED = 'finished',
}

export default class Submission extends objectionVisibility(Model) {
  id: number
  owner: string
  objectType: string
  setting: object
  status: any
  moduleId: string
  score: number

  createdBy: string
  createdAt: Date
  finishedAt: Date
  canceledAt: Date

  log: Log
  report: Report

  static tableName = 'submission'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['owner', 'objectType', 'setting', 'moduleId'],
    properties: {
      owner: jsonProperties.uuid,
      objectType: { type: 'string', enum: ['KRL', 'MRT'] },
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
    module: {
      relation: Model.HasManyRelation,
      modelClass: Module,
      join: {
        from: `${this.tableName}.moduleId`,
        to: `${Module.tableName}.id`,
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
        table.integer('moduleId').notNullable().index(`${Submission.tableName}_module_id`)
        table.string('objectType', 16).notNullable().index(`${Submission.tableName}_objectType`)
        table.string('status', 16).defaultTo(SubmissionStatus.ACTIVE)
        table.jsonb('setting').notNullable()
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.string('createdBy', 48)
        table.timestamp('finishedAt').nullable()
        table.timestamp('canceledAt').nullable()
        table.string('reviewedBy', 48)
        table.integer('score').nullable()

        table.foreign('owner').references('id').inTable(User.tableName)
        table.foreign('moduleId').references('id').inTable(Module.tableName)
      })
    }

    await createSchemaLog(knex)
    await createSchemaReport(knex)
  } catch (error) {
    throw new Error(error)
  }
}
