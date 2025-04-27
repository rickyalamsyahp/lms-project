import objectionVisibility from 'objection-visibility'
import { Model, JSONSchema, RelationMappings } from 'objection'
import { Knex } from 'knex'

export default class Student extends objectionVisibility(Model) {
  static tableName = 'siswa'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['nisn', 'kode_kelas', 'nama'],
    properties: {
      nis: { type: 'string' },
      nisn: { type: 'string' },
      kode_kelas: { type: 'string' },
      nama: { type: 'string' },
      foto: { type: 'string' },
      agama: { type: 'integer' },
      sekolah_asal: { type: 'string' },
      stb_sekolah_asal: { type: 'string' },
      alamat_sekolah_asal: { type: 'string' },
      tahun_sttb: { type: 'string' },
      tahun_terima: { type: 'string' },
      tanggal_terima: { type: 'string', format: 'date' },
      kelas_terima: { type: 'integer' },
      kota_lahir: { type: 'string' },
      tanggal_lahir: { type: 'string', format: 'date' },
      gender: { type: 'integer' },
      alamat: { type: 'string' },
      kelurahan: { type: 'string' },
      kecamatan: { type: 'string' },
      kota: { type: 'string' },
      provinsi: { type: 'string' },
      kodepos: { type: 'string' },
      telepon: { type: 'string' },
      mobile: { type: 'string' },
      anakke: { type: 'integer' },
      stat_keluarga: { type: 'string' },
      semester_terima: { type: 'integer' },
      pek_ayah: { type: 'string' },
      pek_ibu: { type: 'string' },
      pek_wali: { type: 'string' },
      skhun_nomor: { type: 'string' },
      skhun_tahun: { type: 'string' },
      ayah: { type: 'string' },
      ibu: { type: 'string' },
      alamat_ortu: { type: 'string' },
      telp_ortu: { type: 'string' },
      wali: { type: 'string' },
      alamat_wali: { type: 'string' },
      telp_wali: { type: 'string' },
      created_by: { type: 'string' },
      created_time: { type: 'string', format: 'date-time' },
      modified_time: { type: 'string', format: 'date-time' },
    },
  }
}
