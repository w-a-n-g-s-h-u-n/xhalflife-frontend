import { ethers } from 'ethers'
import { provider } from '@/api/contract/ethers'
import XHalfLifeABI from './abis/XHalfLife.abi'

export const XHalfLifeContract = new ethers.Contract(process.env.XHALFLIFE_TOKEN_ADDRESS, XHalfLifeABI, provider)

export const XHalfLife = XHalfLifeContract // TODO  XHalfLifeContract.deployed()
