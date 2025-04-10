import Student from '../student/model'
import QuestionBank from '../bankSoal/model'
import { JSONSchema, Model, RelationMappings } from 'objection'

export default class ExamResult extends Model {
  id: number
  studentId: number
  questionBankId: number
  score: number

  static tableName = 'exam_results'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['studentId', 'questionBankId', 'score'],
    properties: {
      studentId: { type: 'integer' },
      questionBankId: { type: 'integer' },
      score: { type: 'number' },
    },
  }

  static relationMappings: RelationMappings = {
    student: {
      relation: Model.BelongsToOneRelation,
      modelClass: Student,
      join: { from: 'exam_results.studentId', to: 'students.id' },
    },
    questionBank: {
      relation: Model.BelongsToOneRelation,
      modelClass: QuestionBank,
      join: { from: 'exam_results.questionBankId', to: 'question_banks.id' },
    },
  }
}
