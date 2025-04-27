import { JSONSchema, Model } from 'objection'
import objectionVisibility from 'objection-visibility'

export default class Teacher extends objectionVisibility(Model) {
  static tableName = 'guru'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['kode', 'name', 'nip'],
    properties: {
      kode: { type: 'integer' },
      nama: { type: 'string' },
      nip: { type: 'string' },
      skdmapel: { type: 'string' },
      foto: { type: 'string' },
      fotott: { type: 'integer' },
      pwd: { type: 'string' },
      uidg: { type: 'string' },
      upwdg: { type: 'string' },
      ulevelg: { type: 'string' },
      alloweditmp: { type: 'integer' },
      created_by: { type: 'string' },
      created_time: { type: 'string', format: 'date-time' },
      modified_by: { type: 'string' },
      modified_time: { type: 'string', format: 'date-time' },
      alloweditrkeg: { type: 'integer' },
    },
  }
}
