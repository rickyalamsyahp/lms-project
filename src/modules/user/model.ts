import { Model, JSONSchema, RelationMappings, RelationMappingsThunk } from 'objection'
import Scope, { ScopeSlug } from '../scope/model'
import { Knex } from 'knex'
import { register } from '../auth/service'
import objectionVisibility from 'objection-visibility'
import FileMeta from '../fileMeta/model'
import UserBio, { createSchema as createSchemaUserBio } from './ref/bio/model'

export default class User extends objectionVisibility(Model) {
  id!: string
  name!: string
  username!: string
  email!: string
  isActive!: boolean
  scope?: ScopeSlug
  salt!: string
  hashedPassword!: string
  createdAt: Date
  createdBy: string
  modifiedAt: Date
  modifiedBy: string
  avatar: string

  bio: UserBio

  static tableName = 'user'
  static hidden = ['hashedPassword', 'salt', 'scopeSlug']

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['username', 'name'],
    properties: {
      id: { type: 'string' },
      name: { type: 'string', minLength: 3, maxLength: 48 },
      username: { type: 'string', minLength: 3, maxLength: 32 },
      email: { type: 'string', minLength: 8, maxLength: 72 },
    },
  }

  static relationMappings: RelationMappings | RelationMappingsThunk = () => ({
    bio: {
      relation: Model.HasOneRelation,
      modelClass: UserBio,
      join: {
        from: `${this.tableName}.id`,
        to: `${UserBio.tableName}.userId`,
      },
    },
  })
}

export const createSchema = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(User.tableName))) {
      await knex.schema.createTable(User.tableName, (table) => {
        table.string('id').notNullable().unique().index(`${User.tableName}_id`)
        table.string('name', 48).notNullable().index(`${User.tableName}_name`)
        table.string('username', 32).notNullable().unique().index(`${User.tableName}_username`)
        table.string('email', 72).notNullable().unique().index(`${User.tableName}_email`)
        table.string('scope').notNullable()
        table.boolean('is_active').defaultTo(false)
        table.string('salt', 120).notNullable()
        table.string('hashed_password', 120).notNullable()
        table.string('avatar', 32).nullable()
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('modifiedAt').defaultTo(knex.fn.now())
        table.string('createdBy', 48)
        table.string('modifiedBy', 48)

        table.foreign('scope').references('slug').inTable(Scope.tableName)
        table.foreign('avatar').references('filename').inTable(FileMeta.tableName)
      })
    }

    await seed()
    await createSchemaUserBio(knex)
  } catch (error) {
    throw new Error(error)
  }
}

export const seed = async () => {
  const total: any = await User.query().count('* as count').first()
  if (Number(total?.count) > 0) return
  console.log(`Populate ${User.tableName}`)

  const users: any[] = [
    {
      name: 'Administrator',
      username: 'admin',
      email: 'admin@mail.com',
      password: 'Admin!23@#',
      scope: ScopeSlug.ADMIN,
      createdBy: 'system',
    },
    {
      name: 'Instructor',
      username: 'instructor',
      email: 'instructor@mail.com',
      password: 'Instructor!23@#',
      scope: ScopeSlug.INSTRUCTOR,
      createdBy: 'system',
    },
    {
      name: 'Trainee',
      username: 'trainee',
      email: 'trainee@mail.com',
      password: 'Trainee!23@#',
      scope: ScopeSlug.TRAINEE,
      createdBy: 'system',
    },
  ]

  for (const user of users) {
    await new Promise(async (resolve) => {
      try {
        const id = await register(user, user.scope, true)
        resolve(`New user with id ${id} has been registered by system`)
      } catch (error) {
        resolve(true)
      }
    })
  }
}
