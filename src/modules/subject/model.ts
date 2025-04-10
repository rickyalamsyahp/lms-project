import { JSONSchema, Model } from 'objection'

export default class Subject extends Model {
  id: number
  name: string

  static tableName = 'subjects'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string' },
    },
  }
}
