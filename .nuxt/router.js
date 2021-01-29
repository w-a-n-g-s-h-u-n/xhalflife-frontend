import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from '@nuxt/ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _1b4a2743 = () => interopDefault(import('../pages/detail/index.vue' /* webpackChunkName: "pages/detail/index" */))
const _4eba8411 = () => interopDefault(import('../pages/home/index.vue' /* webpackChunkName: "pages/home/index" */))
const _1d413cf8 = () => interopDefault(import('../pages/home/components/CreateStreamForm.vue' /* webpackChunkName: "pages/home/components/CreateStreamForm" */))
const _aed3f4d4 = () => interopDefault(import('../pages/home/components/mixin.js' /* webpackChunkName: "pages/home/components/mixin" */))
const _4df4c7b6 = () => interopDefault(import('../pages/home/components/StreamList.vue' /* webpackChunkName: "pages/home/components/StreamList" */))
const _0af62fa9 = () => interopDefault(import('../pages/home/components/StreamListMine.vue' /* webpackChunkName: "pages/home/components/StreamListMine" */))
const _daa2f59a = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'hash',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/detail",
    component: _1b4a2743,
    name: "detail"
  }, {
    path: "/home",
    component: _4eba8411,
    name: "home"
  }, {
    path: "/home/components/CreateStreamForm",
    component: _1d413cf8,
    name: "home-components-CreateStreamForm"
  }, {
    path: "/home/components/mixin",
    component: _aed3f4d4,
    name: "home-components-mixin"
  }, {
    path: "/home/components/StreamList",
    component: _4df4c7b6,
    name: "home-components-StreamList"
  }, {
    path: "/home/components/StreamListMine",
    component: _0af62fa9,
    name: "home-components-StreamListMine"
  }, {
    path: "/",
    component: _daa2f59a,
    name: "index"
  }],

  fallback: false
}

function decodeObj(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = decode(obj[key])
    }
  }
}

export function createRouter () {
  const router = new Router(routerOptions)

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    const r = resolve(to, current, append)
    if (r && r.resolved && r.resolved.query) {
      decodeObj(r.resolved.query)
    }
    return r
  }

  return router
}
