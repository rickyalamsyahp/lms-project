import { Model, JSONSchema } from 'objection'

export default class MapMatapelajaranKelas extends Model {
  static tableName = 'map_matapelajaran_kelas'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['id', 'kode_matapelajaran', 'kode_kelas', 'semester'],
    properties: {
      id: { type: 'integer' }, // bigint di DB, tapi bisa pakai integer di JS
      kode_matapelajaran: { type: ['string', 'null'], maxLength: 10 },
      matapelajaran: { type: ['string', 'null'] },
      kode_kelas: { type: 'integer' },
      semester: { type: 'integer' },

      created_by: { type: ['string', 'null'], maxLength: 30 },
      created_time: { type: 'string', format: 'date-time' },
      modified_by: { type: ['string', 'null'], maxLength: 30 },
      modified_time: { type: 'string', format: 'date-time' },
    },
  }
}
