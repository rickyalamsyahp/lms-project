import { Model, JSONSchema, RelationMappings } from 'objection'
import User from '../user/model'
import Classroom from '../classroom/model'

export default class Student extends Model {
  id: number
  userId: number
  classroomId: number
  name: string
  nis: string
  gender: 'L' | 'P'
  address: string

  static tableName = 'students'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['userId', 'classroomId', 'name', 'nis'],
    properties: {
      userId: { type: 'integer' },
      classroomId: { type: 'integer' },
      name: { type: 'string' },
      nis: { type: 'string' },
      gender: { type: 'string', enum: ['L', 'P'] },
      address: { type: 'string' },
    },
  }

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: { from: 'students.userId', to: 'users.id' },
    },
    classroom: {
      relation: Model.BelongsToOneRelation,
      modelClass: Classroom,
      join: { from: 'students.classroomId', to: 'classrooms.id' },
    },
  }
}
