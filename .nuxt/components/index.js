export { default as Footer } from '../../components/Footer.vue'
export { default as Header } from '../../components/Header.vue'
export { default as Language } from '../../components/Language.vue'
export { default as Login } from '../../components/Login.vue'
export { default as Logo } from '../../components/Logo.vue'
export { default as Navs } from '../../components/Navs.vue'
export { default as StreamBalance } from '../../components/StreamBalance.vue'
export { default as StreamStatus } from '../../components/StreamStatus.vue'

export const LazyFooter = import('../../components/Footer.vue' /* webpackChunkName: "components/Footer" */).then(c => c.default || c)
export const LazyHeader = import('../../components/Header.vue' /* webpackChunkName: "components/Header" */).then(c => c.default || c)
export const LazyLanguage = import('../../components/Language.vue' /* webpackChunkName: "components/Language" */).then(c => c.default || c)
export const LazyLogin = import('../../components/Login.vue' /* webpackChunkName: "components/Login" */).then(c => c.default || c)
export const LazyLogo = import('../../components/Logo.vue' /* webpackChunkName: "components/Logo" */).then(c => c.default || c)
export const LazyNavs = import('../../components/Navs.vue' /* webpackChunkName: "components/Navs" */).then(c => c.default || c)
export const LazyStreamBalance = import('../../components/StreamBalance.vue' /* webpackChunkName: "components/StreamBalance" */).then(c => c.default || c)
export const LazyStreamStatus = import('../../components/StreamStatus.vue' /* webpackChunkName: "components/StreamStatus" */).then(c => c.default || c)
