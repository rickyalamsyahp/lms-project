import knex from 'knex'
import { Model, knexSnakeCaseMappers } from 'objection'
import { CREATE_TABLE } from '@/constant/env'

import { createSchemaBankSoal } from '@/modules/bankSoal/model'
import { createSchemaExamResult } from '@/modules/examResult/model'
import { createSchemaAnswer } from '@/modules/answer/model'
import { createSchemaQuestions } from '@/modules/question/model'

// Helper untuk generate nama database dari tahun pelajaran
const getDbNameFromThnPelajaran = (thn_pelajaran: string): string => {
  const dbSuffix = thn_pelajaran.replace('-', '')
  return `eraporsmkn57_${dbSuffix}`
}

// Fungsi utama untuk buat koneksi DB
export const getDbConnection = async (thn_pelajaran: string) => {
  const databaseName = getDbNameFromThnPelajaran(thn_pelajaran)

  const knexInstance = knex({
    client: 'mysql2',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'Sm4rt0nline#',
      database: databaseName,
    },
    ...knexSnakeCaseMappers(),
  })

  // Attach knex ke Objection
  Model.knex(knexInstance)
  console.log(`Connected to database: ${databaseName}`)

  if (CREATE_TABLE === '1') {
    try {
      console.log(`Creating tables in: ${databaseName}`)
      await createSchemaBankSoal(knexInstance)
      await createSchemaExamResult(knexInstance)
      await createSchemaQuestions(knexInstance)
      await createSchemaAnswer(knexInstance)
    } catch (error) {
      console.error(`Failed to create schema in ${databaseName}`, error)
      throw error
    }
  }

  return knexInstance
}
