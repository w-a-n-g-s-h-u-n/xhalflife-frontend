import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './lang/en.json'
import zh from './lang/zh.json'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en-US',
  messages: {
    'zh-CN': zh,
    'en-US': en
  }
})
export default i18n
