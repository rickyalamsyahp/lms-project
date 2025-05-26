import { Model, JSONSchema, RelationMappings } from 'objection'
import objectionVisibility from 'objection-visibility'
import Question from '../question/model'
import { Knex } from 'knex'

export default class Answer extends objectionVisibility(Model) {
  id: string
  questionId: string
  content: string
  imageUrl?: string
  audioUrl?: string
  isCorrect: boolean

  static tableName = 'answers'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['questionId', 'content'],
    properties: {
      id: { type: 'string' },
      questionId: { type: 'string' },
      content: { type: 'string' },
      imageUrl: { type: ['string', 'null'] },
      audioUrl: { type: ['string', 'null'] },
      isCorrect: { type: 'boolean' },
    },
  }

  static relationMappings: RelationMappings = {
    question: {
      relation: Model.BelongsToOneRelation,
      modelClass: Question,
      join: { from: 'answers.questionId', to: 'questions.id' },
    },
  }
}

export const createSchemaAnswer = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable('answers'))) {
      await knex.schema.createTable('answers', (table) => {
        table.string('id').primary()
        table.string('questionId').notNullable()
        table.text('content').notNullable()
        table.string('imageUrl').nullable()
        table.string('audioUrl').nullable()
        table.boolean('isCorrect').defaultTo(false)
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('updatedAt').defaultTo(knex.fn.now())
      })
    }
  } catch (err) {
    throw new Error(err)
  }
}
