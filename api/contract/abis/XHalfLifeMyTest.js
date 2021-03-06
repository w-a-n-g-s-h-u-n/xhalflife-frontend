
export const KOVAN_ADDRESS = '0xd5dB530E49De5dc001226e843Fa95815b1dabA6D'

export const ABI = [
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: 'streamId',
        type: 'uint256'
      }
    ],
    name: 'cancelStream',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'depositAmount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'startBlock',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'kBlock',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'unlockRatio',
        type: 'uint256'
      }
    ],
    name: 'createStream',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: 'streamId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'fundStream',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract XDEX',
        name: '_xdexToken',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'streamId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'senderBalance',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'recipientBalance',
        type: 'uint256'
      }
    ],
    name: 'StreamCanceled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'streamId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'depositAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'startBlock',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'kBlock',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'unlockRatio',
        type: 'uint256'
      }
    ],
    name: 'StreamCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'streamId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'StreamFunded',
    type: 'event'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: 'streamId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'withdrawFromStream',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'streamId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'WithdrawFromStream',
    type: 'event'
  },
  {
    constant: true,
    inputs: [],
    name: '_xdex',
    outputs: [
      {
        internalType: 'contract XDEX',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'uint256',
        name: 'streamId',
        type: 'uint256'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: 'withdrawable',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'remaining',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'uint256',
        name: 'streamId',
        type: 'uint256'
      }
    ],
    name: 'getStream',
    outputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'depositAmount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'startBlock',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'kBlock',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'remaining',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'withdrawable',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'unlockRatio',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'lastRewardBlock',
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
    name: 'getVersion',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    payable: false,
    stateMutability: 'pure',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'uint256',
        name: 'streamId',
        type: 'uint256'
      }
    ],
    name: 'isStream',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'nextStreamId',
    outputs: [
      {
        internalType: 'uint256',
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
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'streams',
    outputs: [
      {
        internalType: 'uint256',
        name: 'depositAmount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'remaining',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'withdrawable',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'startBlock',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'kBlock',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'unlockRatio',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'lastRewardBlock',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'sender',
        type: 'address'
      },
      {
        internalType: 'bool',
        name: 'isEntity',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
]
