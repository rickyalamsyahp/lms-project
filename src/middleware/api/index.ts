import auth from '@/modules/auth/route'
import * as kelas from '@/modules/classroom/route'
import * as mapmatapelajarankelas from '@/modules/mapmatapelajarankelas/route'
import * as matapelajaran from '@/modules/matapelajaran/route'
import * as profile from '@/modules/profile/route'
import * as banksoal from '@/modules/bankSoal/route'
import * as jurusan from '@/modules/jurusan/route'
import * as question from '@/modules/question/route'
import * as result from '@/modules/examResult/route'
import { isAuthenticated } from '@/modules/auth/service'

import { Express } from 'express'
import authAPIDocs from './docs/auth'
import userAPIDocs from './docs/user'

type Route = {
  path: string
  source: any
  version?: string
  baseUrl?: string
  scopes?: any | null
  docs?: () => void
}

const apis: Route[] = [
  { baseUrl: '', path: '/auth', source: auth, docs: authAPIDocs },
  { baseUrl: '', path: '/my-profile', source: profile.siswaRoute, scopes: [] },
  { baseUrl: '/public', path: '/kelas', source: kelas.publicRoute },
  { baseUrl: '/public', path: '/mapmatapelajaran', source: mapmatapelajarankelas.publicRoute },
  { baseUrl: '/public', path: '/matapelajaran', source: matapelajaran.publicRoute },
  { baseUrl: '/public', path: '/jurusan', source: jurusan.publicRoute },

  { baseUrl: '/guru', path: '/kelas', source: kelas.guruRoute, scopes: 'guru' },
  { baseUrl: '/guru', path: '/jurusan', source: jurusan.guruRoute, scopes: 'guru' },
  { baseUrl: '/guru', path: '/examresult', source: result.ExamResultGuruRoute, scopes: 'guru' },
  { baseUrl: '/guru', path: '/question', source: question.guruRoute, scopes: 'guru' },
  { baseUrl: '/soal', path: '/banksoal', source: banksoal.BankSoalRoute, scopes: ['guru', 'siswa'] },
  { baseUrl: '/siswa', path: '/kelas', source: kelas.siswaRoute, scopes: 'siswa' },
  { baseUrl: '/siswa', path: '/jurusan', source: jurusan.siswaRoute, scopes: 'siswa' },
  { baseUrl: '/siswa', path: '/question', source: question.siswaRoute, scopes: 'siswa' },
  { baseUrl: '/siswa', path: '/examresult', source: result.ExamResultSiswaRoute, scopes: 'siswa' },
]

export default (app: Express) => {
  for (const a of apis) {
    const url = `${a.baseUrl ? a.baseUrl : ''}${a.path}${a.version ? `/${a.version}` : ''}`
    if (a.scopes) app.use(url, isAuthenticated(a.scopes), a.source(app))
    else app.use(url, a.source(app))
    if (a.docs) a.docs()
  }
}
