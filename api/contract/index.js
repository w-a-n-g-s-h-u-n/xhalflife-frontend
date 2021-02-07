import { ethers } from 'ethers'
import { provider } from './ethers'
import XHalfLifeABI from './abis/XHalfLife.json'
import XDEXABI from './abis/XDEX.json'

const tokenAbi = {
  others: require('./abis/IERC20.json').abi
}

export const selectAbi = (name) => {
  if (tokenAbi[name]) {
    return tokenAbi[name]
  } else {
    return tokenAbi.others
  }
}

export const XHalfLifeContract = new ethers.Contract(process.env.XHALFLIFE_CONTRACT_ADDTRESS, XHalfLifeABI, provider)

export const XDEXTokenContract = new ethers.Contract(process.env.XDEX_TOKEN_ADDRESS, XDEXABI, provider)

export const getXHalfLifeContractWithSigner = (signer) => {
  const XDEXTokenContract = new ethers.Contract(process.env.XHALFLIFE_CONTRACT_ADDTRESS, XHalfLifeABI, signer)
  return XDEXTokenContract
}
