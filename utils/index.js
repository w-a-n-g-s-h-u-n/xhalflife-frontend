import { ethers } from 'ethers'
import { BigNumber } from 'bignumber.js'

export const extend = (app, mixin) => {
  if (!app.mixins) {
    app.mixins = []
  }
  app.mixins.push(mixin)
}

export const statusedList = (list) => {
  return list.map(item => item.txs.some(x => x.event === 'CancelStream') ? { ...item, isCanceled: true, withdrawable: 0, remaining: 0 } : { ...item, isCanceled: false })
}

export const decimalsNumber = (value) => {
  if (!value || isNaN(value)) { return 0 }
  const n = ethers.BigNumber.from(value).toString()
  const decimalsNumber = BigNumber(n).shiftedBy(0 - 18).toNumber()
  if (decimalsNumber < 1) {
    return decimalsNumber.toFixed(3)
  }
  return decimalsNumber.toFixed(2)
}

export default {
  extend
}
