import hello from '@/modules/hello/route'
import auth from '@/modules/auth/route'
import * as user from '@/modules/user/route'
import route from '@/modules/route/route'
import * as submission from '@/modules/submission/route'
import * as moduleApi from '@/modules/module/route'

import { isAuthenticated } from '@/modules/auth/service'
import { Express } from 'express'
import { ScopeSlug } from '@/modules/scope/model'
import authAPIDocs from './docs/auth'
import userAPIDocs from './docs/user'
import submissoinAPIDocs from './docs/submission'
import moduleAPIDocs from './docs/module'

type Route = {
  path: string
  source: any
  version?: string
  baseUrl?: string
  scopes?: ScopeSlug[] | null
  docs?: () => void
}

const apis: Route[] = [
  { baseUrl: '/world', path: '/hello', source: hello },
  { baseUrl: '', path: '/auth', source: auth, docs: authAPIDocs },
  { baseUrl: '', path: '/my-profile', source: user.myProfile, scopes: [], docs: userAPIDocs },
  { baseUrl: '', path: '/route', source: route, scopes: [] },
  { baseUrl: '/public', path: '/module', source: moduleApi.publicRoute, scopes: [] },
  { baseUrl: '/public', path: '/submission', source: submission.publicRoute, scopes: [], docs: submissoinAPIDocs },
  { baseUrl: '/public', path: '/module', source: moduleApi.publicRoute, scopes: [], docs: moduleAPIDocs },

  { baseUrl: '/admin', path: '/user-account', source: user.adminRoute, scopes: [ScopeSlug.ADMIN] },
  { baseUrl: '/admin', path: '/module', source: moduleApi.adminRoute, scopes: [ScopeSlug.ADMIN] },

  { baseUrl: '/instructor', path: '/user-account', source: user.instructorRoute, scopes: [ScopeSlug.INSTRUCTOR] },
  { baseUrl: '/instructor', path: '/submission', source: submission.instructorRoute, scopes: [ScopeSlug.INSTRUCTOR] },
]

export default (app: Express) => {
  for (const a of apis) {
    const url = `${a.baseUrl ? a.baseUrl : ''}${a.path}${a.version ? `/${a.version}` : ''}`
    if (a.scopes) app.use(url, isAuthenticated(a.scopes), a.source(app))
    else app.use(url, a.source(app))
    if (a.docs) a.docs()
  }
}
