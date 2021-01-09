import gql from 'graphql-tag'

export const SUPPORT_TOKENS = gql`{
  tokens(first: 10) {
    id
    decimals
    name
    symbol
  }
}
`

// TODO 参数化、分页
export const STREAM_LIST = gql`
  query streams($first: Int!, $skip:Int!) {
    streams(first: $first, skip: $skip, orderBy: timestamp, orderDirection: desc) {
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
        token {
          id
          decimals
          name
          symbol
        }
      }
  }
 `

export const STREAM_DETAIL = gql`
  query streams($id: Int!) {
    streams(where: {id: $id}) {
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
        token {
          symbol
        }
      }
  }
 `

export const STREAM_GET_TOTAL_DATA = gql`
  query streams($id: Bytes!) {
    streamTotalDatas(where: {id: $id}) {
      id
      count
      locked
      withdrawed
      token {
        id
        decimals
        name
        symbol
      }
    }
}`

export const STREAM_LIST_BY_RECIPIENT = gql`
  query streams($first: Int!, $recipient:Bytes!) {
    streams(first: $first, where: {recipient: $recipient}, orderBy: timestamp, orderDirection: desc) {
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
      token {
        id
        decimals
        name
        symbol
      }
    }
  }`

export const STREAM_LIST_BY_SENDER = gql`
  query streams($first: Int!, $sender:Bytes!) {
    streams(first: $first, where: {sender: $sender}, orderBy: timestamp, orderDirection: desc) {
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
      token {
        id
        decimals
        name
        symbol
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
