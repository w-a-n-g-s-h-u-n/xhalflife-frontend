import gql from 'graphql-tag'

// TODO 参数化、分页
export const STREAM_LIST = gql`
  query streams($first: Int!) {
    streams(first: $first) {
        id
        sender
        recipient
        depositAmount
        startBlock
        kBlock
        unlockRatio
        timestamp
        txs(first: $first, orderBy: timestamp, orderDirection: desc) {
          block
          event
          from
          timestamp
          to
          txhash
        }
      }
  }
 `

export const STREAM_GET_TOTAL_DATA = gql`{
  streamTotalDatas(first: 1) {
    id
    totalCount
    xdexLocked
    xdexWithdrawed
  }
}`

export const STREAM_LIST_BY_RECIPIENT = gql`{
  streams(first: 10, where: {recipient: "0x54be6df7b1c9fee57af2e8255bf319da65e4c0c0"}) {
    id
    sender
    recipient
    depositAmount
    startBlock
    kBlock
    unlockRatio
    timestamp
    txs(first: 10, orderBy: timestamp, orderDirection: desc) {
      block
      event
      from
      timestamp
      to
      txhash
    }
  }
}`

export const STREAM_LIST_BY_SENDER = gql`{
  streams(first: 10, where: {sender: "0xa031f03424aa6278afb74bf5e036a00f159c46d2"}) {
    id
    sender
    recipient
    depositAmount
    startBlock
    kBlock
    unlockRatio
    timestamp
    txs(first: 10, orderBy: timestamp, orderDirection: desc) {
      block
      event
      from
      timestamp
      to
      txhash
    }
  }
}`

export const STREAM_FUNDS_BY_STREAMID = gql`{
  streams(where: {id: 2}) {
    id
    funds(first: 10, orderBy: timestamp, orderDirection: desc) {
      amount
      timestamp
      token {
        name
        symbol
        decimals
      }
    }
  }
}`

export const STREAM_TRANSACTIONS = gql`{
  streamTransactions(first: 5, orderBy: timestamp, orderDirection: desc) {
    block
    event
    from
    timestamp
    to
    txhash
    streamId
    stream {
      recipient
      sender
      depositAmount
    }
  }
}`

export const STREAM_WITHDRAWALS_BY_STREAM_ID = gql`{
  streams(where: {id: 2}) {
  id
  withdrawals(first: 10, orderBy: timestamp, orderDirection: desc) {
    id
    amount
    timestamp
    token {
      name
      symbol
      decimals
    }
  }
}
}`
