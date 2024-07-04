import hello from '@/modules/hello/route'
import auth from '@/modules/auth/route'
import * as user from '@/modules/user/route'
import route from '@/modules/route/route'
import * as submission from '@/modules/submission/route'

import { isAuthenticated } from '@/modules/auth/service'
import { Express } from 'express'
import { ScopeSlug } from '@/modules/scope/model'

type Route = {
  path: string
  source: any
  version?: string
  baseUrl?: string
  scopes?: ScopeSlug[] | null
}

const apis: Route[] = [
  { baseUrl: '/world', path: '/hello', source: hello },
  { baseUrl: '', path: '/auth', source: auth },
  { baseUrl: '', path: '/my-profile', source: user.myProfile, scopes: [] },
  { baseUrl: '', path: '/route', source: route, scopes: [] },

  { baseUrl: '/admin', path: '/user', source: user.adminRoute, scopes: [ScopeSlug.ADMIN] },

  { baseUrl: '/instructor', path: '/user', source: user.instructorRoute, scopes: [ScopeSlug.INSTRUCTOR] },
  { baseUrl: '/instructor', path: '/submission', source: submission.instructorRoute, scopes: [ScopeSlug.INSTRUCTOR] },
]

export default (app: Express) => {
  for (const a of apis) {
    const url = `${a.baseUrl ? a.baseUrl : ''}${a.path}${a.version ? `/${a.version}` : ''}`
    if (a.scopes) app.use(url, isAuthenticated(a.scopes), a.source(app))
    else app.use(url, a.source(app))
  }
}
