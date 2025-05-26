import objectionVisibility from 'objection-visibility'
import { JSONSchema, Model, RelationMappings } from 'objection'
import QuestionBank from '../bankSoal/model'
import Answer from '../answer/model'
import { Knex } from 'knex'

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  COMPLEX_MULTIPLE_CHOICE = 'complex_multiple_choice',
  TRUE_FALSE = 'true_false',
  ESSAY = 'essay',
}

// Create a base class without the mixin first
class QuestionBase extends Model {
  static tableName = 'questions'

  id!: string
  questionBankId!: string
  content!: string
  type!: QuestionType
  correctAnswer?: string | null
  correctAnswers?: string | null // Will be stored as JSON string
  keywords?: string | null // Will be stored as JSON string
  imageUrl?: string | null
  audioUrl?: string | null
  equation?: string | null
  points!: number
  explanation?: string | null
  order!: number
  createdAt?: Date
  updatedAt?: Date

  // Relations (optional, loaded via withGraphFetched)
  questionBank?: any
  answers?: any[]
}

// Apply the mixin to the base class
export default class Question extends objectionVisibility(QuestionBase) {
  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['questionBankId', 'content', 'type', 'points'],
    properties: {
      id: { type: 'string' },
      questionBankId: { type: 'string' },
      content: { type: 'string' },
      type: { type: 'string', enum: Object.values(QuestionType) },
      correctAnswer: { type: ['string', 'null'] },
      correctAnswers: { type: ['string', 'null'] }, // JSON string in DB
      keywords: { type: ['string', 'null'] }, // JSON string in DB
      imageUrl: { type: ['string', 'null'] },
      audioUrl: { type: ['string', 'null'] },
      equation: { type: ['string', 'null'] },
      points: { type: 'integer', minimum: 1 },
      explanation: { type: ['string', 'null'] },
      order: { type: 'integer' },
    },
  }

  // Getter for correctAnswers to parse JSON
  get correctAnswersParsed(): string[] {
    if (!this.correctAnswers) return []
    try {
      return JSON.parse(this.correctAnswers)
    } catch {
      return []
    }
  }

  // Getter for keywords to parse JSON
  get keywordsParsed(): string[] {
    if (!this.keywords) return []
    try {
      return JSON.parse(this.keywords)
    } catch {
      return []
    }
  }

  static get relationMappings(): RelationMappings {
    return {
      questionBank: {
        relation: Model.BelongsToOneRelation,
        modelClass: QuestionBank,
        join: { from: 'questions.questionBankId', to: 'question_banks.id' },
      },
      answers: {
        relation: Model.HasManyRelation,
        modelClass: Answer,
        join: { from: 'questions.id', to: 'answers.questionId' },
      },
    }
  }
}

// Interface for insert operations to avoid type inference issues
export interface QuestionInsertData {
  id: string
  questionBankId: string
  content: string
  type: QuestionType
  correctAnswer?: string | null
  correctAnswers?: string | null
  keywords?: string | null
  imageUrl?: string | null
  audioUrl?: string | null
  equation?: string | null
  points: number
  explanation?: string | null
  order: number
}

// Interface for update operations
export interface QuestionUpdateData {
  content?: string
  type?: QuestionType
  correctAnswer?: string | null
  correctAnswers?: string | null
  keywords?: string | null
  imageUrl?: string | null
  audioUrl?: string | null
  equation?: string | null
  points?: number
  explanation?: string | null
  order?: number
}

export const createSchemaQuestions = async (knex: Knex) => {
  try {
    if (!(await knex.schema.hasTable('questions'))) {
      await knex.schema.createTable('questions', (table) => {
        table.string('id').primary()
        table.string('questionBankId').notNullable()
        table.text('content').notNullable()
        table.enu('type', Object.values(QuestionType)).notNullable()
        table.string('correctAnswer').nullable()
        table.json('correctAnswers').nullable()
        table.json('keywords').nullable()
        table.string('imageUrl').nullable()
        table.string('audioUrl').nullable()
        table.text('equation').nullable()
        table.integer('points').notNullable().defaultTo(1)
        table.text('explanation').nullable()
        table.integer('order').notNullable().defaultTo(0)
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('updatedAt').defaultTo(knex.fn.now())

        // Add foreign key constraint
        table.foreign('questionBankId').references('id').inTable('question_banks').onDelete('CASCADE')

        // Add indexes for better performance
        table.index('questionBankId')
        table.index('type')
        table.index('order')
      })
    }
  } catch (err: any) {
    throw new Error(`Failed to create questions table: ${err.message}`)
  }
}
