import auth from '@/modules/auth/route'
import * as user from '@/modules/user/route'

import * as courseData from '@/modules/courseData/route'
import route from '@/modules/route/route'
import * as submission from '@/modules/submission/route'
import * as courseApi from '@/modules/course/route'
import * as courseExamApi from '@/modules/courseExam/route'
import * as courseSettingApi from '@/modules/courseSetting/route'
import * as fileMeta from '@/modules/fileMeta/route'
import * as lessonApi from '@/modules/lesson/route'
import * as CategoryApi from '@/modules/category/route'
import { isAuthenticated } from '@/modules/auth/service'
import { Express } from 'express'
import { ScopeSlug } from '@/modules/scope/model'
import authAPIDocs from './docs/auth'
import userAPIDocs from './docs/user'
import submissoinAPIDocs from './docs/submission'
import courseAPIDocs from './docs/course'
import courseExamAPIDocs from './docs/course-exam'
import courseSettingAPIDocs from './docs/course-setting'
import lessonAPIDocs from './docs/lesson'

type Route = {
  path: string
  source: any
  version?: string
  baseUrl?: string
  scopes?: ScopeSlug[] | null
  docs?: () => void
}

const apis: Route[] = [
  { baseUrl: '', path: '/auth', source: auth, docs: authAPIDocs },
  { baseUrl: '', path: '/file', source: fileMeta.publicRoute },
  { baseUrl: '/open', path: '/user-account', source: user.openRoute },
  { baseUrl: '', path: '/course-data', source: courseData.publicRouteCourseData },
  { baseUrl: '', path: '/my-profile', source: user.myProfile, scopes: [], docs: userAPIDocs },
  { baseUrl: '', path: '/route', source: route, scopes: [] },

  { baseUrl: '/public', path: '/user-account', source: user.publicRoute, scopes: [] },
  { baseUrl: '/public', path: '/submission', source: submission.publicRoute, scopes: [], docs: submissoinAPIDocs },
  { baseUrl: '/public', path: '/course', source: courseApi.publicRoute, scopes: [], docs: courseAPIDocs },
  { baseUrl: '/public', path: '/course-exam', source: courseExamApi.publicRoute, scopes: [], docs: courseExamAPIDocs },
  { baseUrl: '/public', path: '/course-setting', source: courseSettingApi.publicRoute, scopes: [], docs: courseSettingAPIDocs },
  { baseUrl: '/public', path: '/lesson', source: lessonApi.publicRoute, scopes: [], docs: lessonAPIDocs },

  { baseUrl: '/admin', path: '/user-account', source: user.adminRoute, scopes: [ScopeSlug.ADMIN] },
  { baseUrl: '/admin', path: '/submission', source: submission.adminRoute, scopes: [ScopeSlug.ADMIN] },
  { baseUrl: '/admin', path: '/course', source: courseApi.adminRoute, scopes: [ScopeSlug.ADMIN] },
  { baseUrl: '/admin', path: '/course-exam', source: courseExamApi.adminRoute, scopes: [ScopeSlug.ADMIN] },
  { baseUrl: '/admin', path: '/course-setting', source: courseSettingApi.adminRoute, scopes: [ScopeSlug.ADMIN] },
  { baseUrl: '/admin', path: '/lesson', source: lessonApi.adminRoute, scopes: [ScopeSlug.ADMIN] },
  { baseUrl: '/admin', path: '/category', source: CategoryApi.adminRoute, scopes: [ScopeSlug.ADMIN] },

  { baseUrl: '/instructor', path: '/user-account', source: user.instructorRoute, scopes: [ScopeSlug.INSTRUCTOR] },
  { baseUrl: '/instructor', path: '/submission', source: submission.instructorRoute, scopes: [ScopeSlug.INSTRUCTOR] },
  { baseUrl: '/instructor', path: '/course', source: courseApi.instructorRoute, scopes: [ScopeSlug.INSTRUCTOR] },
  { baseUrl: '/instructor', path: '/course-exam', source: courseExamApi.instructorRoute, scopes: [ScopeSlug.INSTRUCTOR] },
  { baseUrl: '/instructor', path: '/course-setting', source: courseSettingApi.instructorRoute, scopes: [ScopeSlug.INSTRUCTOR] },
  { baseUrl: '/instructor', path: '/lesson', source: lessonApi.instructorRoute, scopes: [ScopeSlug.INSTRUCTOR] },
]

export default (app: Express) => {
  for (const a of apis) {
    const url = `${a.baseUrl ? a.baseUrl : ''}${a.path}${a.version ? `/${a.version}` : ''}`
    if (a.scopes) app.use(url, isAuthenticated(a.scopes), a.source(app))
    else app.use(url, a.source(app))
    if (a.docs) a.docs()
  }
}
