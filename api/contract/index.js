import { ethers } from 'ethers'
import { provider } from '@/api/contract/ethers'
import XHalfLifeABI from './abis/XHalfLife'

export const XHalfLifeContract = new ethers.Contract(process.env.XHALFLIFE_CONTRACT_ADDTRESS, XHalfLifeABI, provider)

export const XHalfLife = XHalfLifeContract // TODO  XHalfLifeContract.deployed()
