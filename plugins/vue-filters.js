import Vue from 'vue'
import moment from 'moment'
import { ethers } from 'ethers'
import { BigNumber } from 'bignumber.js'

// 简化地址
Vue.filter('addr', function (v) {
  if (!v) { return '' }
  return v.slice(0, 6) + '...' + v.slice(-4)
})

Vue.filter('date', function (v) {
  if (!v || isNaN(v)) { return '' }
  const d = moment(v * 1000).format('YYYY-MM-DD HH:mm:ss')
  return d
})

Vue.filter('precision18', function (v) {
  if (!v || isNaN(v)) { return 0 }
  const n = ethers.BigNumber.from(v).toString()
  const value = BigNumber(n).shiftedBy(0 - 18).toNumber()
  if (value < 1) {
    return value.toFixed(3)
  }

  return value.toFixed(2)
})
