import Vue from 'vue'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faDiscord, faTelegramPlane, faGithub, faTwitter, faMediumM, faWeixin } from '@fortawesome/free-brands-svg-icons'

config.autoAddCss = false

library.add(faDiscord, faTelegramPlane, faGithub, faTwitter, faMediumM, faWeixin)

Vue.component('font-awesome-icon', FontAwesomeIcon)
