import { Model, JSONSchema, RelationMappings } from 'objection'
import User from '../user/model'
import Subject from '../subject/model'
import Classroom from '../classroom/model'

export default class Teacher extends Model {
  id: number
  userId: number
  name: string
  nip: string
  gender: 'L' | 'P'
  address: string

  static tableName = 'teachers'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['userId', 'name', 'nip'],
    properties: {
      userId: { type: 'integer' },
      name: { type: 'string' },
      nip: { type: 'string' },
      gender: { type: 'string', enum: ['L', 'P'] },
      address: { type: 'string' },
    },
  }

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: { from: 'teachers.userId', to: 'users.id' },
    },
    subjects: {
      relation: Model.ManyToManyRelation,
      modelClass: Subject,
      join: {
        from: 'teachers.id',
        through: {
          from: 'teacher_subjects.teacherId',
          to: 'teacher_subjects.subjectId',
        },
        to: 'subjects.id',
      },
    },
    classrooms: {
      relation: Model.ManyToManyRelation,
      modelClass: Classroom,
      join: {
        from: 'teachers.id',
        through: {
          from: 'teacher_classrooms.teacherId',
          to: 'teacher_classrooms.classroomId',
        },
        to: 'classrooms.id',
      },
    },
  }
}
