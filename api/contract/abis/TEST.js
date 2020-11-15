
// kovan合约地址 0x008A068bd00576c105F2f7bd874313e0789D45DB
export const ABI = [
  {
    constant: false,
    inputs: [
      {
        name: 'a',
        type: 'uint256'
      },
      {
        name: 'b',
        type: 'uint256'
      }
    ],
    name: 'add',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'n',
        type: 'string'
      }
    ],
    name: 'set',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'a',
        type: 'uint256'
      },
      {
        name: 'b',
        type: 'uint256'
      }
    ],
    name: 'f',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'get',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getCount',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
]

export const KOVAN_ADDRESS = '0x94bb12AB638b899de388C3C36663a278DC95E6CE'
