import { ethers } from 'ethers'
import { BigNumber } from 'bignumber.js'

export const extend = (app, mixin) => {
  if (!app.mixins) {
    app.mixins = []
  }
  app.mixins.push(mixin)
}

export const isKovanEnv = () => {
  return Boolean(window.location.host.includes('kovan'))
}

export const statusedList = (list) => {
  return list.map(item => item.txs.some(x => x.event === 'CancelStream') ? { ...item, isCanceled: true, withdrawable: 0, remaining: 0 } : { ...item, isCanceled: false })
}

export const decimalsNumber = (value, decimal = 18) => {
  if (!value || isNaN(value)) { return 0 }
  const n = ethers.BigNumber.from(value).toString()
  const decimalsNumber = BigNumber(n).shiftedBy(0 - decimal).toNumber()
  if (decimal === 0) {
    return decimalsNumber.toString()
  } else {
    return decimalsNumber.toFixed(2)
  }
}

export const isMobile = () => {
  const userAgentInfo = navigator.userAgent
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPod']
  let flag = false
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = true
      break
    }
  }
  return flag
}

export const isEth = (address) => {
  return address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
}

export const formatAddress = (v) => {
  if (!v) { return '' }
  return v.slice(0, 6) + '...' + v.slice(-4)
}
export default {
  extend,
  statusedList,
  decimalsNumber,
  isMobile,
  isEth,
  formatAddress
}
