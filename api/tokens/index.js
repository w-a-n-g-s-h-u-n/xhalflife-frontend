import tokens from 'xdefi-assets/tokens/kovan.json'

export const selectSymbolByName = (name) => {
  return tokens.find(token => token.name === name).symbol
}

export const selectDecimalByName = (symbol) => {
  if (tokens.filter(token => token.symbol === symbol).length) {
    return tokens.find(token => token.symbol === symbol).decimals
  } else {
    return 18
  }
}

export const selectAddressByName = (symbol) => {
  if (tokens.filter(token => token.symbol === symbol).length) {
    return tokens.find(token => token.symbol === symbol).address
  } else {
    return ''
  }
}

export default tokens
