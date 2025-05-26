import { JSONSchema, Model, RelationMappings } from 'objection'
import { Knex } from 'knex'
import Teacher from '../teacher/model'
import Matapelajaran from '../matapelajaran/model'
import Classroom from '../classroom/model'
import Question from '../question/model'
import ExamResult from '../examResult/model'

export enum ExamStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export default class QuestionBank extends Model {
  id!: string
  teacherId!: number
  coTeacherIds?: number[]
  mataPelajaranId!: string
  classroomId?: number // Keep for backward compatibility
  title!: string
  description?: string
  scheduledAt!: string
  jamUjian!: string
  duration!: number
  semester!: string
  status!: ExamStatus
  randomizeQuestions!: boolean
  randomizeAnswers!: boolean
  showResults!: boolean
  allowReview!: boolean
  requireAllAnswers!: boolean
  autoSave!: boolean
  totalQuestions!: number
  totalPoints!: number
  passingScore?: number
  instructions?: string

  createdAt!: Date
  createdBy!: string
  modifiedAt?: Date
  modifiedBy?: string

  // Relations (optional, loaded via withGraphFetched)
  teacher?: any
  subject?: any
  classrooms?: any[]
  classroom?: any
  questions?: any[]
  results?: any[]

  static tableName = 'question_banks'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['teacherId', 'mataPelajaranId', 'title'],
    properties: {
      id: { type: 'string' },
      teacherId: { type: 'integer' },
      mataPelajaranId: { type: 'string' },
      classroomId: { type: ['integer', 'null'] },
      title: { type: 'string', maxLength: 120 },
      description: { type: ['string', 'null'] },
      duration: { type: 'integer' },
      semester: { type: 'string', maxLength: 120 },
      scheduledAt: { type: 'string', maxLength: 120 },
      jamUjian: { type: 'string', maxLength: 120 },
      status: { type: 'string', enum: Object.values(ExamStatus) },
      randomizeQuestions: { type: 'boolean' },
      randomizeAnswers: { type: 'boolean' },
      showResults: { type: 'boolean' },
      allowReview: { type: 'boolean' },
      requireAllAnswers: { type: 'boolean' },
      autoSave: { type: 'boolean' },
      totalQuestions: { type: 'integer' },
      totalPoints: { type: 'integer' },
      passingScore: { type: ['integer', 'null'] },
      instructions: { type: ['string', 'null'] },
    },
  }

  static get relationMappings(): RelationMappings {
    return {
      teacher: {
        relation: Model.BelongsToOneRelation,
        modelClass: Teacher,
        join: {
          from: 'question_banks.teacherId',
          to: 'guru.kode',
        },
      },
      subject: {
        relation: Model.BelongsToOneRelation,
        modelClass: Matapelajaran,
        join: {
          from: 'question_banks.mataPelajaranId',
          to: 'matapelajaran.kode',
        },
      },
      // Many-to-many relationship with classrooms through junction table
      classrooms: {
        relation: Model.ManyToManyRelation,
        modelClass: Classroom,
        join: {
          from: 'question_banks.id',
          through: {
            from: 'question_bank_classrooms.questionBankId',
            to: 'question_bank_classrooms.classroomId',
          },
          to: 'kelas.kode',
        },
      },
      // Keep single classroom relation for backward compatibility
      classroom: {
        relation: Model.BelongsToOneRelation,
        modelClass: Classroom,
        join: {
          from: 'question_banks.classroomId',
          to: 'kelas.kode',
        },
      },
      questions: {
        relation: Model.HasManyRelation,
        modelClass: Question,
        join: {
          from: 'question_banks.id',
          to: 'questions.questionBankId',
        },
      },
      results: {
        relation: Model.HasManyRelation,
        modelClass: ExamResult,
        join: {
          from: 'question_banks.id',
          to: 'exam_results.questionBankId',
        },
      },
    }
  }
}

export const createSchemaBankSoal = async (knex: Knex): Promise<void> => {
  try {
    // First, check if referenced tables exist and have the expected structure
    const tablesExist = await Promise.all([knex.schema.hasTable('teachers'), knex.schema.hasTable('matapelajarans'), knex.schema.hasTable('classrooms')])

    if (!tablesExist.every((exists) => exists)) {
      console.warn('Warning: Some referenced tables may not exist yet. Creating without foreign keys for now.')
    }

    if (!(await knex.schema.hasTable(QuestionBank.tableName))) {
      await knex.schema.createTable(QuestionBank.tableName, (table) => {
        table.string('id').notNullable().primary()
        table.integer('teacherId').notNullable().index()
        table.json('coTeacherIds').nullable()
        table.string('mataPelajaranId', 72).notNullable().index()
        table.integer('classroomId').nullable().index()
        table.string('title', 120).notNullable()
        table.text('description').nullable()
        table.integer('duration').notNullable()
        table.string('scheduledAt', 120).notNullable()
        table.string('jamUjian', 120).notNullable()
        table.string('semester', 120).notNullable()
        table.enu('status', Object.values(ExamStatus)).defaultTo(ExamStatus.DRAFT)
        table.boolean('randomizeQuestions').defaultTo(false)
        table.boolean('randomizeAnswers').defaultTo(false)
        table.boolean('showResults').defaultTo(true)
        table.boolean('allowReview').defaultTo(false)
        table.boolean('requireAllAnswers').defaultTo(true)
        table.boolean('autoSave').defaultTo(true)
        table.integer('totalQuestions').defaultTo(0)
        table.integer('totalPoints').defaultTo(0)
        table.integer('passingScore').nullable()
        table.text('instructions').nullable()
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('modifiedAt').defaultTo(knex.fn.now())
        table.string('createdBy', 48).notNullable()
        table.string('modifiedBy', 48).nullable()
      })

      // Add foreign key constraints separately after table creation
      // This approach is more reliable and allows for better error handling
      try {
        if (await knex.schema.hasTable('teachers')) {
          // Check if the 'kode' column exists in teachers table
          const teacherColumns = await knex('teachers').columnInfo()
          if ('kode' in teacherColumns) {
            await knex.schema.alterTable(QuestionBank.tableName, (table) => {
              table.foreign('teacherId').references('kode').inTable('teachers')
            })
          } else {
            console.warn('Warning: teachers.kode column not found - skipping foreign key constraint')
          }
        }
      } catch (error) {
        console.warn('Warning: Could not add teacher foreign key constraint:', error)
      }

      try {
        if (await knex.schema.hasTable('matapelajarans')) {
          const matpelColumns = await knex('matapelajarans').columnInfo()
          if ('kode' in matpelColumns) {
            await knex.schema.alterTable(QuestionBank.tableName, (table) => {
              table.foreign('mataPelajaranId').references('kode').inTable('matapelajarans')
            })
          } else {
            console.warn('Warning: matapelajarans.kode column not found - skipping foreign key constraint')
          }
        }
      } catch (error) {
        console.warn('Warning: Could not add matapelajaran foreign key constraint:', error)
      }

      try {
        if (await knex.schema.hasTable('classrooms')) {
          const classroomColumns = await knex('classrooms').columnInfo()
          if ('kode' in classroomColumns) {
            await knex.schema.alterTable(QuestionBank.tableName, (table) => {
              table.foreign('classroomId').references('kode').inTable('classrooms')
            })
          } else {
            console.warn('Warning: classrooms.kode column not found - skipping foreign key constraint')
          }
        }
      } catch (error) {
        console.warn('Warning: Could not add classroom foreign key constraint:', error)
      }
    }

    // Junction table for many-to-many relationship
    if (!(await knex.schema.hasTable('question_bank_classrooms'))) {
      await knex.schema.createTable('question_bank_classrooms', (table) => {
        table.string('questionBankId').notNullable()
        table.integer('classroomId').notNullable()
        table.primary(['questionBankId', 'classroomId'])
      })

      // Add foreign key constraints separately
      try {
        await knex.schema.alterTable('question_bank_classrooms', (table) => {
          table.foreign('questionBankId').references('id').inTable('question_banks').onDelete('CASCADE')
        })
      } catch (error) {
        console.warn('Warning: Could not add questionBankId foreign key constraint:', error)
      }

      try {
        if (await knex.schema.hasTable('classrooms')) {
          await knex.schema.alterTable('question_bank_classrooms', (table) => {
            table.foreign('classroomId').references('kode').inTable('classrooms').onDelete('CASCADE')
          })
        }
      } catch (error) {
        console.warn('Warning: Could not add classroomId foreign key constraint:', error)
      }
    }

    // Co-teacher junction table
    if (!(await knex.schema.hasTable('question_bank_teachers'))) {
      await knex.schema.createTable('question_bank_teachers', (table) => {
        table.string('questionBankId').notNullable()
        table.integer('teacherId').notNullable()
        table.primary(['questionBankId', 'teacherId'])
      })

      // Add foreign key constraints separately
      try {
        await knex.schema.alterTable('question_bank_teachers', (table) => {
          table.foreign('questionBankId').references('id').inTable('question_banks').onDelete('CASCADE')
        })
      } catch (error) {
        console.warn('Warning: Could not add questionBankId foreign key constraint for teachers:', error)
      }

      try {
        if (await knex.schema.hasTable('teachers')) {
          await knex.schema.alterTable('question_bank_teachers', (table) => {
            table.foreign('teacherId').references('kode').inTable('teachers').onDelete('CASCADE')
          })
        }
      } catch (error) {
        console.warn('Warning: Could not add teacherId foreign key constraint:', error)
      }
    }

    console.log('QuestionBank schema created successfully')
  } catch (error) {
    throw new Error(`Failed to create QuestionBank schema: ${error}`)
  }
}
