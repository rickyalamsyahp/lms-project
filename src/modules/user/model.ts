import { Model, JSONSchema, RelationMappings, RelationMappingsThunk } from 'objection'

import { Knex } from 'knex'
import { register } from '../auth/service'
import objectionVisibility from 'objection-visibility'
import FileMeta from '../fileMeta/model'
import Teacher from '../teacher/model'
import Student from '../student/model'

export default class User extends objectionVisibility(Model) {
  id: number
  name: string
  email: string
  isActive!: boolean
  role: string
  salt!: string
  hashedPassword!: string
  avatar: string

  createdAt: Date
  createdBy: string
  modifiedAt: Date
  modifiedBy: string

  static tableName = 'user'
  static hidden = ['hashedPassword', 'salt']
  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['name', 'email', 'password', 'role'],
    properties: {
      name: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
      role: { type: 'string', enum: ['admin', 'guru', 'siswa'] },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  }

  static relationMappings: RelationMappings | RelationMappingsThunk = {
    teacher: {
      relation: Model.HasManyRelation,
      modelClass: Teacher,
      join: {
        from: 'user.id',
        to: 'teacher.userId',
      },
    },
    student: {
      relation: Model.HasManyRelation,
      modelClass: Student,
      join: {
        from: 'user.id',
        to: 'student.authorId',
      },
    },
  }
}

export const createSchema = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable(User.tableName))) {
      await knex.schema.createTable(User.tableName, (table) => {
        table.string('id').notNullable().unique().index(`${User.tableName}_id`)
        table.string('name', 48).notNullable().index(`${User.tableName}_name`)
        table.string('email', 72).nullable().unique().index(`${User.tableName}_email`)
        table.string('role', 72).nullable()
        table.boolean('is_active').defaultTo(false)
        table.string('salt', 120).notNullable()
        table.string('hashed_password', 120).notNullable()

        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('modifiedAt').defaultTo(knex.fn.now())
        table.string('createdBy', 48)
        table.string('modifiedBy', 48)
        table.foreign('avatar').references('filename').inTable(FileMeta.tableName)
      })
    }

    await seed()
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
      email: 'admin@mail.com',
      password: 'Admin!23@#',
      role: 'admin',
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
