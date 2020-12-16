export const extend = (app, mixin) => {
  if (!app.mixins) {
    app.mixins = []
  }
  app.mixins.push(mixin)
}

export const statusedList = (list) => {
  return list.map(item => item.txs.some(x => x.event === 'CancelStream') ? { ...item, isCanceled: true } : { ...item, isCanceled: false })
}

export default {
  extend
}
