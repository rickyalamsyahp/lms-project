import { Model, JSONSchema, RelationMappings, RelationMappingsThunk } from 'objection'
import { Knex } from 'knex'
import objectionVisibility from 'objection-visibility'
import { jsonProperties } from '@/constant'
import { enumToArray } from '@/libs/utils'
import User from '../user/model'

import Log, { createSchema as createSchemaLog } from './ref/log/model'
import Report, { createSchema as createSchemaReport } from './ref/report/model'

export enum SubmissionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  FINISHED = 'finished',
}

export default class Submission extends objectionVisibility(Model) {
  id: number
  owner: string
  train: string
  setting: object
  status: any

  createdBy: string
  createdAt: Date
  finishedAt: Date
  canceledAt: Date

  log: Log
  report: Report

  static tableName = 'submission'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['owner', 'train', 'setting'],
    properties: {
      owner: jsonProperties.uuid,
      train: { type: 'string', enum: ['KRL', 'MRT'] },
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
  })
}

export const createSchema = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(Submission.tableName))) {
      await knex.schema.createTable(Submission.tableName, (table) => {
        table.increments()
        table.string('owner', 36).notNullable().index(`${Submission.tableName}_owner`)
        table.string('train', 16).notNullable().index(`${Submission.tableName}_train`)
        table.string('status', 16).defaultTo(SubmissionStatus.ACTIVE)
        table.jsonb('setting').notNullable()
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.string('createdBy', 48)
        table.timestamp('finished_at').nullable()
        table.timestamp('canceled_at').nullable()
        table.string('reviewed_by', 48)

        table.foreign('owner').references('id').inTable(User.tableName)
      })
    }

    await createSchemaLog(knex)
    await createSchemaReport(knex)
  } catch (error) {
    throw new Error(error)
  }
}
