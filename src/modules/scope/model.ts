import { Knex } from 'knex'
import { Model, JSONSchema } from 'objection'

export enum ScopeSlug {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  TRAINEE = 'trainee',
}

export default class Scope extends Model {
  id!: number
  name!: string
  slug!: string

  static tableName = 'scope'
  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['name', 'slug'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 3, maxLength: 16 },
      slug: { type: 'string', minLength: 3, maxLength: 16 },
    },
  }
}

export const createSchema = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(Scope.tableName))) {
      console.log(`Create table ${Scope.tableName}`)
      await knex.schema.createTable(Scope.tableName, (table) => {
        table.increments()
        table.string('name', 16).notNullable().unique()
        table.string('slug', 16).notNullable().unique()
      })
    }
    await seed()
  } catch (error) {
    throw new Error(error)
  }
}

export const seed = async () => {
  const total: any = await Scope.query().count('* as count').first()
  if (Number(total?.count) > 0) return
  console.log(`Populate ${Scope.tableName}`)
  await Scope.query().insertGraph([
    {
      name: 'Admin',
      slug: ScopeSlug.ADMIN,
    },
    {
      name: 'Instructor',
      slug: ScopeSlug.INSTRUCTOR,
    },
    {
      name: 'Trainee',
      slug: ScopeSlug.TRAINEE,
    },
  ])
}
