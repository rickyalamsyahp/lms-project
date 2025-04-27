import { Model, JSONSchema, RelationMappings } from 'objection'
import objectionVisibility from 'objection-visibility'
import QuestionBank from '../bankSoal/model'
import Answer from '../answer/model'
import { Knex } from 'knex'

export default class Question extends objectionVisibility(Model) {
  static tableName = 'questions'

  id: string
  questionBankId: string
  content: string
  correctAnswer: string

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['questionBankId', 'content', 'correctAnswer'],
    properties: {
      id: { type: 'string' },
      questionBankId: { type: 'string' },
      content: { type: 'string' },
      correctAnswer: { type: 'string', enum: ['a', 'b', 'c', 'd', 'e'] },
    },
  }

  static relationMappings: RelationMappings = {
    questionBank: {
      relation: Model.BelongsToOneRelation,
      modelClass: QuestionBank,
      join: { from: 'questions.questionBankId', to: 'question_banks.id' },
    },
    answers: {
      relation: Model.HasManyRelation,
      modelClass: Answer,
      join: { from: 'questions.id', to: `answers.questionId` },
    },
  }
}

export const createSchemaQuestions = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable('questions'))) {
      await knex.schema.createTable('questions', (table) => {
        table.string('id').primary()
        table.string('questionBankId').notNullable()
        table.text('content').notNullable()
        table.enu('correctAnswer', ['a', 'b', 'c', 'd', 'e']).notNullable()
      })
    }
  } catch (err) {
    throw new Error(err)
  }
}
