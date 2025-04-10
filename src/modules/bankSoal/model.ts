import Teacher from '../teacher/model'
import Subject from '../subject/model'
import Classroom from '../classroom/model'
import { JSONSchema, Model, RelationMappings } from 'objection'

export default class QuestionBank extends Model {
  id: number
  teacherId: number
  subjectId: number
  classroomId: number
  title: string
  scheduledAt: Date

  static tableName = 'question_banks'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['teacherId', 'subjectId', 'classroomId', 'title'],
    properties: {
      teacherId: { type: 'integer' },
      subjectId: { type: 'integer' },
      classroomId: { type: 'integer' },
      title: { type: 'string' },
      scheduledAt: { type: 'string', format: 'date-time' },
    },
  }

  static relationMappings: RelationMappings = {
    teacher: {
      relation: Model.BelongsToOneRelation,
      modelClass: Teacher,
      join: { from: 'question_banks.teacherId', to: 'teachers.id' },
    },
    subject: {
      relation: Model.BelongsToOneRelation,
      modelClass: Subject,
      join: { from: 'question_banks.subjectId', to: 'subjects.id' },
    },
    classroom: {
      relation: Model.BelongsToOneRelation,
      modelClass: Classroom,
      join: { from: 'question_banks.classroomId', to: 'classrooms.id' },
    },
  }
}
