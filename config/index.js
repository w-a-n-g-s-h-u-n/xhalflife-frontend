import multicall from 'xdefi-assets/abi/Multicall.json'
import registry from 'xdefi-assets/generated/pm/registry.homestead.json';
import registryKovan from 'xdefi-assets/generated/pm/registry.kovan.json';
import halflifeContract from '@/api/contract/abis/XHalfLife.json'
export const CHAIN_LABEL = {
  // '0x1': 'Main',
  '0x2a': 'Kovan'
  // '0x3': 'Ropsten',
  // '0x4': 'Rinkeby',
  // '0x5': 'Goerli'
}

console.log(registryKovan);

// 不同网络不同合约地址 TODO
export const NETWORK_CONFIG = {
  '0x2a': {
    ...registryKovan,
    addresses:{
      ...registryKovan.addresses,
      halflife: "0x2891B0BeaF0765f254c80696Cd71Da398C4815B3"
    },
    abis:{
      halflife: halflifeContract,
      multicall: multicall.abi
    }
  }
}
