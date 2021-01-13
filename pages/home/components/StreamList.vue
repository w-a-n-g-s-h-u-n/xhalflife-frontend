<template>
  <div>
    <el-table
      v-loading="loading"
      :data="homeList"
      class="table"
      :cell-style="cellStyle"
      :header-cell-style="cellStyle"
    >
      <el-table-column
        width="40"
        prop="id"
        label="ID"
      />
      <el-table-column align="center" label="Token" min-width="90">
        <template slot-scope="scope">
          <span :title="scope.row.sender">{{ scope.row.token.symbol}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Sender" min-width="120">
        <template slot-scope="scope">
          <span :title="scope.row.sender">{{ scope.row.sender | addr }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Recipient" style="background: #272958;" min-width="120">
        <template slot-scope="scope">
          <span :title="scope.row.recipient">{{ scope.row.recipient | addr }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Deposited" min-width="100">
        <template slot-scope="scope">
          <span :title="scope.row.depositAmount">{{ scope.row.depositAmount | decimaledAmount(scope.row.token.decimals) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Withdrawable" min-width="110">
        <template slot-scope="scope">
          <span :title="scope.row.withdrawable">{{ detailCache[scope.row.id] && detailCache[scope.row.id].withdrawable | decimaledAmount(scope.row.token.decimals) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Start Block" min-width="100">
        <template slot-scope="scope">
          <span :title="scope.row.startBlock">#{{ scope.row.startBlock }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed='right' label="Status" min-width="120">
        <template slot-scope="scope">
          <stream-status
            :start-block="scope.row.startBlock"
            :current-block="blockNumber"
            :remaining="detailCache[scope.row.id] && detailCache[scope.row.id].remaining"
            :isCanceled="scope.row.isCanceled"
          />
        </template>
      </el-table-column>
      <el-table-column label="Date"  width="90">
        <template slot-scope="scope">
          <span :title="scope.row.timestamp">{{ scope.row.timestamp | date }}</span>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label=""
      >
        <template slot-scope="scope">
          <NuxtLink :to="`/detail?id=${scope.row.id}`">
            <el-button :id="scope.row.id" size="small" round class="view-detail-btn" @click="drawer = true">
              Detail
            </el-button>
          </NuxtLink>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="total>0"
      class="pagination"
      :current-page.sync="query.page"
      :page-size="query.limit"
      layout="prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { STREAM_LIST } from '@/api/apollo/queries'
import { mapState } from 'vuex'
import { statusedList } from '@/utils/index'
// import gql from 'graphql-tag'
import mixin from './mixin'
export default {
  name: 'StreamList',
  mixins: [mixin],
  data () {
    return {
      loading: false,
      list: [],
      query: {
        page: 1,
        limit: 10
      }
    }
  },
  computed: mapState({
    blockNumber (state) {
      return state.blockNumber
    },
    skip () {
      return (this.query.page - 1) * this.query.limit
    },
    total (state) {
      return Number(state.stats.totalCount) || 0
    },
    homeList (state) {
      return state.homeList
    },
    detailCache (state) {
      return state.detailCache
    }
  }),
  created () {
    console.log('StreamList mounted', this.homeList)
    this.getList()
    this.$store.dispatch('refreshLatestBlockNumber')
  },
  methods: {
    async getList () {
      this.loading = true
      const ret = await this.$apollo.query({ query: STREAM_LIST, variables: { first: this.query.limit, skip: this.skip } })
      console.log('StreamList ret', ret)
      const statusList = statusedList(ret.data.streams)
      this.$store.commit('updateSteamList', { key: 'homeList', value: statusList })

      const ids = statusList.map(item => item.id)
      this.refreshBalanceOfStreams(ids)

      this.loading = false
      return ret
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.getList()
    },
    cellStyle (obj) {
      return 'background-color:#272958;border-bottom-color:#2E2F5C;color:#7E7F9C;overflow:hidden;text-overflow: ellipsis;'
    }
  }
}
</script>

<style scoped lang="scss">
  .pagination {
    width: 100%;
    margin-top: 20px;
  }

  .table {
    width: 100%;
  }

  .el-pagination button:disabled {
    background-color: transparent !important;
  }

  .el-pager li {
    background: transparent !important;
  }

  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    border: none;
  }

  .view-detail-btn {
    display: flex;
    align-items: center;
    border-radius: 20px;
    font-size: 13px;
    background: transparent;
    color: #fced3e;
    border: 1px solid #fced3e;
    letter-spacing: 0;
    text-align: center;
  }
</style>
