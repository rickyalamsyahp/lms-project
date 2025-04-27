import { JSONSchema, Model } from 'objection'

export default class Matapelajaran extends Model {
  static tableName = 'matapelajaran'
  nama: string

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['kode', 'nama', 'kbp1', 'kbk1', 'desp1', 'desk1', 'jp1', 'jk1'],
    properties: {
      kode: { type: 'string', maxLength: 5 },
      nama: { type: 'string' },
      jenis: { type: ['string', 'null'] },
      kkm: { type: ['number', 'null'] },

      kbp1: { type: 'integer' },
      kbk1: { type: 'integer' },
      desp1: { type: 'string' },
      desk1: { type: 'string' },
      jp1: { type: 'integer' },
      jk1: { type: 'integer' },
      jp1a: { type: 'integer' },
      jk1a: { type: 'integer' },
      desp21: { type: ['string', 'null'] },
      desk21: { type: ['string', 'null'] },

      kbp2: { type: 'integer' },
      kbk2: { type: 'integer' },
      desp2: { type: 'string' },
      desk2: { type: 'string' },
      jp2: { type: 'integer' },
      jk2: { type: 'integer' },
      jp2a: { type: 'integer' },
      jk2a: { type: 'integer' },
      desp22: { type: ['string', 'null'] },
      desk22: { type: ['string', 'null'] },

      kbp3: { type: 'integer' },
      kbk3: { type: 'integer' },
      desp3: { type: 'string' },
      desk3: { type: 'string' },
      jp3: { type: 'integer' },
      jk3: { type: 'integer' },
      jp3a: { type: 'integer' },
      jk3a: { type: 'integer' },
      desp23: { type: ['string', 'null'] },
      desk23: { type: ['string', 'null'] },

      kbp4: { type: 'integer' },
      kbk4: { type: 'integer' },
      desp4: { type: 'string' },
      desk4: { type: 'string' },
      jp4: { type: 'integer' },
      jk4: { type: 'integer' },
      jp4a: { type: 'integer' },
      jk4a: { type: 'integer' },
      desp24: { type: ['string', 'null'] },
      desk24: { type: ['string', 'null'] },

      kbp5: { type: 'integer' },
      kbk5: { type: 'integer' },
      desp5: { type: 'string' },
      desk5: { type: 'string' },
      jp5: { type: 'integer' },
      jk5: { type: 'integer' },
      jp5a: { type: 'integer' },
      jk5a: { type: 'integer' },
      desp25: { type: ['string', 'null'] },
      desk25: { type: ['string', 'null'] },

      kbp6: { type: 'integer' },
      kbk6: { type: 'integer' },
      desp6: { type: 'string' },
      desk6: { type: 'string' },
      jp6: { type: 'integer' },
      jk6: { type: 'integer' },
      jp6a: { type: 'integer' },
      jk6a: { type: 'integer' },
      desp26: { type: ['string', 'null'] },
      desk26: { type: ['string', 'null'] },

      created_by: { type: 'string', maxLength: 30 },
      created_time: { type: 'string', format: 'date-time' },
      modified_by: { type: 'string', maxLength: 30 },
      modified_time: { type: 'string', format: 'date-time' },
    },
  }
}
