import { JSONSchema, Model } from 'objection'

export default class Classroom extends Model {
  id: number
  name: string // e.g., "X IPA 1"

  static tableName = 'classrooms'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string' },
    },
  }
}
