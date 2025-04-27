import { Model, JSONSchema, RelationMappings } from 'objection'
import objectionVisibility from 'objection-visibility'
import Question from '../question/model'
import { Knex } from 'knex'

export default class Answer extends objectionVisibility(Model) {
  id: string
  questionId: string
  option: string
  content: string
  static tableName = 'answers'
  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['questionId', 'option', 'content'],
    properties: {
      id: { type: 'string' },
      questionId: { type: 'string' },
      option: { type: 'string', enum: ['a', 'b', 'c', 'd', 'e'] },
      content: { type: 'string' },
    },
  }
}

export const createSchemaAnswer = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable('answers'))) {
      await knex.schema.createTable('answers', (table) => {
        table.string('id').primary()
        table.string('questionId').notNullable()
        table.enu('option', ['a', 'b', 'c', 'd', 'e']).notNullable()
        table.text('content').notNullable()
      })
    }
  } catch (err) {
    throw new Error(err)
  }
}
