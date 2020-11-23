<template>
  <div>
    <div class="tabs">
      <div class="tab" :class="{'active':current=='sent'}" @click="change('sent')">
        My sent
      </div>
      <div class="tab" :class="{'active':current=='received'}" @click="change('received')">
        My Received
      </div>
    </div>

    <div>
      <el-table
        v-loading="loading"
        :data="curTableData"
        class="table"
        :cell-style="cellStyle"
        :header-cell-style="cellStyle"
      >
        <el-table-column
          width="80"
          prop="id"
          label="ID"
        />
        <el-table-column align="center" label="Recipient" style="background: #272958;" min-width="100">
          <template slot-scope="scope">
            <span :title="scope.row.recipient">{{ scope.row.recipient | addr }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Deposited">
          <template slot-scope="scope">
            <span :title="scope.row.depositAmount">{{ scope.row.depositAmount | precision18 }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Withdrawable" min-width="120">
          <template slot-scope="scope">
            <span :title="scope.row.withdrawable">{{ (detailCache[scope.row.id] && detailCache[scope.row.id].withdrawable) | precision18 }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Start Block" min-width="100">
          <template slot-scope="scope">
            <span :title="scope.row.startBlock">#{{ scope.row.startBlock }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Status" min-width="120">
          <template slot-scope="scope">
            <stream-status
              :start-block="scope.row.startBlock"
              :current-block="blockNumber"
              :remaining="detailCache[scope.row.id] && detailCache[scope.row.id].remaining"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="Sender" min-width="100">
          <template slot-scope="scope">
            <span :title="scope.row.sender">{{ scope.row.sender | addr }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Date" fixed="right" min-width="100">
          <template slot-scope="scope">
            <span :title="scope.row.timestamp">{{ scope.row.timestamp | date }}</span>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          label=""
          width="110"
        >
          <template slot-scope="scope">
            <NuxtLink :to="`/detail?id=${scope.row.id}`">
              <el-button :id="scope.row.id" size="small" round class="view-detail-btn" @click="drawer = true">
                View Detail
                <stream-balance :id="scope.row.id" :row="scope.row" />
              </el-button>
            </NuxtLink>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        :current-page.sync="currentPage"
        :page-size="100"
        layout="prev, pager, next, jumper"
        :total="1000"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { STREAM_LIST_BY_SENDER, STREAM_LIST_BY_RECIPIENT } from '@/api/apollo/queries'
import { mapState } from 'vuex'

export default {
  name: 'StreamListMine',
  data () {
    return {
      current: 'received',
      sendInfo: {
        // list: [],
        page: 1,
        total: 1000
      },
      receiveInfo: {
        // list: [],
        page: 1,
        total: 1000
      }
    }
  },
  computed: {
    ...mapState({
      MySentList (state) {
        return state.MySentList
      },
      myReceivedList (state) {
        return state.myReceivedList
      },
      detailCache (state) {
        return state.detailCache
      }
    }),
    curTableData () {
      return this.current === 'send' ? this.MySentList : this.myReceivedList
    },
    currentPage () {
      return this.current === 'send' ? this.sendInfo.page : this.receiveInfo.page
    }

  },
  mounted () {
    console.log('StreamList mounted', this.current)
    this.current === 'send' ? this.getListBySender() : this.getListByRecipient()
  },
  methods: {
    change (v) {
      console.log('change', v)
      this.current = v
      this.current === 'send'
        ? this.getListBySender('refresh')
        : this.getListByRecipient('refresh')
    },
    // TODO 分页
    async getListBySender (type = 'refresh') {
      this.loading = true
      const ret = await this.$apollo.query({ query: STREAM_LIST_BY_SENDER, variables: { first: 10 } })
      console.log('StreamList send', ret)
      // this.sendInfo.list = ret.data.streams
      this.$store.commit('updateSteamList', { key: 'MySentList', value: ret.data.streams })
      this.loading = false
      return ret
    },
    async getListByRecipient (type = 'refresh') {
      this.loading = true
      const ret = await this.$apollo.query({ query: STREAM_LIST_BY_RECIPIENT, variables: { first: 10 } })
      console.log('StreamList receive', ret)
      // this.receiveInfo.list = ret.data.streams
      this.$store.commit('updateSteamList', { key: 'myReceivedList', value: ret.data.streams })

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
      return 'background-color:#272958;border-bottom-color:#2E2F5C;color:#7E7F9C;'
      // if (obj.columnIndex === 8) {
      //   return 'background-color:#1e2049;border-bottom-color:#2E2F5C;color:#7E7F9C;'
      // } else {
      //   return 'background-color:#272958;border-bottom-color:#2E2F5C;color:#7E7F9C;'
      // }
    }
  }
}
</script>

<style scoped lang="scss">
  .tabs {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
    text-align: left;
    padding-left: 10px;

    .tab {
      height: 36px;
      padding-left: 29.5px;
      padding-right: 29.5px;
      line-height: 36px;
      text-align: center;
      background: #272958;
      border-radius: 8px;
      //font-family: PingFangSC-Semibold;
      font-size: 16px;
      color: #56588e;
      letter-spacing: 0;
      margin-right: 10px;

      &.active {
        //font-family: PingFangSC-Semibold;
        background: #fced3e;
        border-radius: 8px;
        font-size: 16px;
        color: #1f2049;
        letter-spacing: 0;
        text-align: center;
      }
    }
  }

  .pagination {
    width: 938px;
    margin-top: 20px;
  }

  .view-detail-btn {
    //font-family: PingFang-SC-Bold;
    background-image: linear-gradient(136deg, #2bf7dd 0%, #3a8ff7 51%, #da37fa 100%);
    border-radius: 20px;
    width: 98px;
    height: 27.7px;
    font-size: 13px;
    color: #fff;
    letter-spacing: 0;
    text-align: center;
  }
</style>
