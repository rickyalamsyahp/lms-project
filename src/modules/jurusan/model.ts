import objectionVisibility from 'objection-visibility'
import { JSONSchema, Model } from 'objection'

export default class Jurusan extends objectionVisibility(Model) {
  static tableName = 'kompetensi_keahlian'
  nama: string
  kode: string
  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['kode', 'nama'],
    properties: {
      kode: { type: 'integer' }, // bigint dianggap integer di TS/JS
      nama: { type: 'string' },
      created_by: { type: 'string' },
      created_time: { type: 'string', format: 'date-time' },
      modified_by: { type: 'string' },
      modified_time: { type: 'string', format: 'date-time' },
    },
  }
}
