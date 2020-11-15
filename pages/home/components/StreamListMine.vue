<template>
  <div>
    <div class="tabs">
      <el-radio-group v-model="current" @change="change">
        <el-radio-button label="send">
          My sent
        </el-radio-button>
        <el-radio-button label="receive">
          My Received
        </el-radio-button>
      </el-radio-group>
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
            <span :title="scope.row.unlockRatio">{{ scope.row.startBlock | precision18 }}</span>
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
            <NuxtLink to="/detail">
              <el-button :id="scope.id" size="small" round>
                View Detail
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

export default {
  name: 'StreamListMine',
  data () {
    return {
      current: 'receive',
      sendInfo: {
        list: [],
        page: 1,
        total: 1000
      },
      receiveInfo: {
        list: [],
        page: 1,
        total: 1000
      }
    }
  },
  computed: {
    curTableData () {
      return this.current === 'send' ? this.sendInfo.list : this.receiveInfo.list
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
      this.current === 'send'
        ? this.getListBySender('refresh')
        : this.getListByRecipient('refresh')
    },
    // TODO 分页
    async getListBySender (type = 'refresh') {
      this.loading = true
      const ret = await this.$apollo.query({ query: STREAM_LIST_BY_SENDER, variables: { first: 10 } })
      console.log('StreamList send', ret)
      this.sendInfo.list = ret.data.streams
      this.loading = false
      return ret
    },
    async getListByRecipient (type = 'refresh') {
      this.loading = true
      const ret = await this.$apollo.query({ query: STREAM_LIST_BY_RECIPIENT, variables: { first: 10 } })
      console.log('StreamList receive', ret)
      this.receiveInfo.list = ret.data.streams
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
      console.log(obj)
      if (obj.columnIndex === 7 || obj.columnIndex === 8) {
        return 'background-color:#1e2049;border-bottom-color:#2E2F5C;color:#7E7F9C;'
      } else {
        return 'background-color:#272958;border-bottom-color:#2E2F5C;color:#7E7F9C;'
      }
    }
  }
}
</script>

<style scoped>
  .tabs {
    width: 938px;
    margin-bottom: 10px;
  }

  .pagination {
    width: 938px;
    margin-top: 20px;
  }
</style>
