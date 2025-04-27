import objectionVisibility from 'objection-visibility'
import { JSONSchema, Model, RelationMappings } from 'objection'
import Jurusan from '../jurusan/model'

export default class Classroom extends objectionVisibility(Model) {
  static tableName = 'kelas'
  kode: any
  nama: string
  kodeKompetensikeahlian: number

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['kode', ' nama'],
    properties: {
      nama: { type: 'string' },
      kode_kompetensikeahlian: { type: 'integer' },
      kode_guru: { type: 'string' },
      tingkat: { type: 'string' },
      kode: { type: 'string' },
      ket: { type: 'string' },
      created_by: { type: 'string' },
      created_time: { type: 'string', format: 'date-time' },
      modified_by: { type: 'string' },
      modified_time: { type: 'string', format: 'date-time' },
    },
  }
  static relationMappings: RelationMappings = {
    jurusans: {
      relation: Model.BelongsToOneRelation,
      modelClass: Jurusan,
      join: { from: `${this.tableName}.kodeKompetensikeahlian`, to: `${Jurusan.tableName}.kode` },
    },
  }
}
