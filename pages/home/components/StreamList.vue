<template>
  <div style="width: 100%;">
    <el-table
      v-loading="loading"
      :data="homeList"
      class="table"
      :cell-style="cellStyle"
      :header-cell-style="cellStyle"
    >
      <el-table-column
        width="50"
        prop="id"
        label="ID"
      />
      <el-table-column
        label="Recipient"
        style="background: #272958;"
      >
        <template slot-scope="scope">
          <span :title="scope.row.recipient">{{ scope.row.recipient | addr }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Deposited" width="100">
        <template slot-scope="scope">
          <span :title="scope.row.depositAmount">{{ scope.row.depositAmount | precision18 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Withdrawable">
        <template slot-scope="scope">
          <span :title="scope.row.withdrawable">{{ (detailCache[scope.row.id] && detailCache[scope.row.id].withdrawable) | precision18 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Start Block" width="150">
        <template slot-scope="scope">
          <span :title="scope.row.startBlock">#{{ scope.row.startBlock }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="startBlock"
        label="Status"
      />
      <el-table-column label="Sender" width="100">
        <template slot-scope="scope">
          <span :title="scope.row.sender">{{ scope.row.sender | addr }}</span>
        </template>
      </el-table-column>

      <el-table-column label="" fixed="right" width="100">
        <template slot-scope="scope">
          <span :title="scope.row.timestamp">{{ scope.row.timestamp | date }}</span>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label=""
        width="100"
      >
        <template slot-scope="scope">
          <NuxtLink :to="`/detail?id=${scope.row.id}`">
            <el-button :id="scope.row.id" size="small" round @click="drawer = true">
              View Detail
              <stream-balance :id="scope.row.id" :row="scope.row" />
            </el-button>
          </NuxtLink>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      :current-page.sync="page"
      :page-size="100"
      layout="prev, pager, next, jumper"
      :total="1000"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { STREAM_LIST } from '@/api/apollo/queries'
import { mapState } from 'vuex'

export default {
  name: 'StreamList',
  // fetch () {
  //   this.getList()
  // },
  /*
  * depositAmount: (...)
id: (...)
kBlock: (...)
recipient: (...)
sender: (...)
startBlock: (...)
timestamp: (...)
txs: (...)
unlockRatio: (...)
__typename: (...)
  *
  * */
  data () {
    return {
      page: 1,
      loading: false
    }
  },

  computed: mapState({
    homeList (state) {
      return state.homeList
    },
    detailCache (state) {
      return state.detailCache
    }
  }),
  created () {
    console.log('StreamList mounted')
    this.getList()
  },
  methods: {
    async getList () {
      this.loading = true
      const ret = await this.$apollo.query({ query: STREAM_LIST, variables: { first: 10 } })
      // console.log('StreamList ret', ret)
      this.$store.commit('updateSteamList', { key: 'homeList', value: ret.data.streams })
      this.loading = false
      return ret
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    cellStyle (obj) {
      if (obj.columnIndex === 7 || obj.columnIndex === 8) {
        return 'background-color:#1e2049;border-bottom-color:#2E2F5C;color:#7E7F9C;'
      } else {
        return 'background-color:#272958;border-bottom-color:#2E2F5C;color:#7E7F9C;'
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .pagination {
    width: 938px;
    margin-top: 20px;
  }

  .table {
    width: 100%;

    &::before {
      border: none;
    }
  }

  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    border: none;
  }
</style>
