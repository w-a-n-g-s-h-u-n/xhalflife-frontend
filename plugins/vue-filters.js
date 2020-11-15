import Vue from 'vue'

// 简化地址
Vue.filter('addr', function (v) {
  if (!v) { return '' }
  return v.slice(0, 6) + '...' + v.slice(-4)
})

Vue.filter('date', function (v) {
  if (!v || isNaN(v)) { return '' }
  const d = new Date(v * 1000).toDateString().slice(4)
  return d
})

Vue.filter('precision18', function (v) {
  if (!v || isNaN(v)) { return '' }
  const n = v / 10000000000000000
  return n.toFixed(2)
})
