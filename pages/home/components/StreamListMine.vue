<template>
  <div>
    <div class="tabs">
      <div class="tab" :class="{'active':current=='sent'}" @click="change('sent')">
        My Sent
      </div>
      <div class="tab" :class="{'active':current=='received'}" @click="change('received')">
        My Received
      </div>
    </div>

    <div v-if="current=='sent'">
      <el-table
        v-loading="sendInfo.loading"
        :data="MySentList"
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
        <el-table-column align="center" label="Recipient" min-width="120">
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
            <span :title="scope.row.withdrawable">{{ (detailCache[scope.row.id] && detailCache[scope.row.id].withdrawable) | decimaledAmount(scope.row.token.decimals) }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Start Block" min-width="100">
          <template slot-scope="scope">
            <span :title="scope.row.startBlock">#{{ scope.row.startBlock }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Status" fixed="right" min-width="120">
          <template slot-scope="scope">
            <stream-status
              :start-block="scope.row.startBlock"
              :current-block="blockNumber"
              :remaining="detailCache[scope.row.id] && detailCache[scope.row.id].remaining"
            />
          </template>
        </el-table-column>

        <el-table-column label="Date" width="90">
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
                <stream-balance :id="scope.row.id" :row="scope.row" />
              </el-button>
            </NuxtLink>
          </template>
        </el-table-column>
      </el-table>
      <!--      <el-pagination-->
      <!--        class="pagination"-->
      <!--        :current-page.sync="currentPage"-->
      <!--        :page-size="100"-->
      <!--        layout="prev, pager, next, jumper"-->
      <!--        :total="1000"-->
      <!--        @size-change="handleSizeChange"-->
      <!--        @current-change="handleCurrentChange"-->
      <!--      />-->
    </div>
    <div v-else>
      <el-table
        v-loading="receiveInfo.loading"
        :data="myReceivedList"
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
            <span :title="scope.row.withdrawable">{{ (detailCache[scope.row.id] && detailCache[scope.row.id].withdrawable) | decimaledAmount(scope.row.token.decimals) }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Start Block" min-width="100">
          <template slot-scope="scope">
            <span :title="scope.row.startBlock">#{{ scope.row.startBlock }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" fixed="right" label="Status" min-width="120">
          <template slot-scope="scope">
            <stream-status
              :start-block="scope.row.startBlock"
              :current-block="blockNumber"
              :remaining="detailCache[scope.row.id] && detailCache[scope.row.id].remaining"
            />
          </template>
        </el-table-column>
        <el-table-column label="Date" width="90">
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
      <!--      <el-pagination-->
      <!--        class="pagination"-->
      <!--        :current-page.sync="currentPage"-->
      <!--        :page-size="100"-->
      <!--        layout="prev, pager, next, jumper"-->
      <!--        :total="1000"-->
      <!--        @size-change="handleSizeChange"-->
      <!--        @current-change="handleCurrentChange"-->
      <!--      />-->
    </div>
  </div>
</template>

<script>
import { STREAM_LIST_BY_SENDER, STREAM_LIST_BY_RECIPIENT } from '@/api/apollo/queries'
import { mapState } from 'vuex'
import { ethers } from 'ethers'
import { statusedList } from '@/utils/index'
import mixin from './mixin'

export default {
  name: 'StreamListMine',
  mixins: [mixin],
  data () {
    return {
      current: 'received',
      sendInfo: {
        loading: false,
        // list: [],
        page: 1,
        total: 1000
      },
      receiveInfo: {
        loading: false,
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
      },
      account (state) {
        return state.metamask && state.metamask.account
      },
      blockNumber (state) {
        return state.blockNumber
      }

    }),
    curTableData () {
      return this.current === 'sent' ? this.MySentList : this.myReceivedList
    },
    currentPage () {
      return this.current === 'sent' ? this.sendInfo.page : this.receiveInfo.page
    }

  },
  mounted () {
    if (!ethers.utils.isAddress(this.account)) {
      this.$message({
        message: 'Please connect to metemask account first',
        type: 'warning'
      })
      return
    }
    console.log('StreamList mounted', this.current)
    this.current === 'send' ? this.getListBySender() : this.getListByRecipient()
    this.$store.dispatch('refreshLatestBlockNumber')
  },
  methods: {
    change (v) {
      console.log('change', v)
      if (!ethers.utils.isAddress(this.account)) {
        this.$message({
          message: 'Please connect to metemask account first',
          type: 'warning'
        })
        return
      }
      this.current = v
      this.current === 'sent'
        ? this.getListBySender('refresh')
        : this.getListByRecipient('refresh')
    },
    // TODO 分页 我发出的
    async getListBySender (type = 'refresh') {
      this.sendInfo.loading = true
      const ret = await this.$apollo.query({ query: STREAM_LIST_BY_SENDER, variables: { first: 100, sender: this.account } })
      console.log('StreamList send', ret)
      // this.sendInfo.list = ret.data.streams

      this.$store.commit('updateSteamList', { key: 'MySentList', value: statusedList(ret.data.streams) })
      this.sendInfo.loading = false

      const ids = ret.data.streams.map(item => item.id)
      this.refreshBalanceOfStreams(ids)

      return ret
    },
    // 我收到的
    async getListByRecipient (type = 'refresh') {
      this.receiveInfo.loading = true
      const ret = await this.$apollo.query({ query: STREAM_LIST_BY_RECIPIENT, variables: { first: 100, recipient: this.account } })
      console.log('StreamList receive', ret)
      // this.receiveInfo.list = ret.data.streams
      this.$store.commit('updateSteamList', { key: 'myReceivedList', value: statusedList(ret.data.streams) })
      this.receiveInfo.loading = false

      const ids = ret.data.streams.map(item => item.id)
      this.refreshBalanceOfStreams(ids)

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

    @media (max-width: 768px) {
      padding-left: 0;
    }

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
