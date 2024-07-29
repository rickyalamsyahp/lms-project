import { Model, JSONSchema } from 'objection'
import { Knex } from 'knex'
import objectionVisibility from 'objection-visibility'
import User from '../../model'
import { jsonProperties } from '@/constant'

export default class UserBio extends objectionVisibility(Model) {
  userId: string
  born: string
  gender: string
  phoneNumber: string
  identityNumber: string
  modifiedBy: string
  modifiedAt: Date

  static tableName = 'user-bio'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['userId'],
    properties: {
      born: jsonProperties.localeDate,
      gender: { type: 'string', enum: ['male', 'female'] },
    },
  }
}

export const createSchema = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(UserBio.tableName))) {
      await knex.schema.createTable(UserBio.tableName, (table) => {
        table.increments()
        table.string('userId').notNullable().unique().index(`${UserBio.tableName}_user_id`)
        table.string('gender', 16).nullable()
        table.string('born', 10).nullable()
        table.string('phoneNumber', 16).nullable()
        table.string('identityNumber', 32).nullable()
        table.timestamp('modifiedAt').defaultTo(knex.fn.now())
        table.string('modifiedBy', 48)

        table.foreign('userId').references('id').inTable(User.tableName)
      })
    }
  } catch (error) {
    throw new Error(error)
  }
}
