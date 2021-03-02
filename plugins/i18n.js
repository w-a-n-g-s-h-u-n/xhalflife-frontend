import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from '../lang/en.json'
import zh from '../lang/zh.json'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en-US',
  messages: {
    'zh-CN': zh,
    'en-US': en
  }
})

console.log(window.location.search);

export default ({
  app,
  store
}) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = i18n
  app.i18n.path = (link) => {
    // 如果是默认语言，就省略
    if (app.i18n.locale === app.i18n.fallbackLocale) {
      return `/${link}`
    }
    return `/${link}?lang=/${app.i18n.locale}`
  }
}
