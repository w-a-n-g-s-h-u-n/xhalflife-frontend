
import Vue from 'vue'
const errorHandler = (error, vm) => {
  console.error('抛出全局异常')
  console.error(vm)
  console.error(error)
}

Vue.config.errorHandler = errorHandler
Vue.prototype.$throw = error => errorHandler(error, this)
