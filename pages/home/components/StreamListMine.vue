<template>
  <div>
    <div>
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
        :data="curTableData"
        style="width: 100%;"
      >
        <el-table-column
          prop="id"
          label="ID"
        />
        <el-table-column
          prop="recipient"
          label="Recipient"
        />
        <el-table-column
          prop="depositAmount"
          label="Deposited"
        />
        <el-table-column
          prop="unlockRatio"
          label="Withdrawable"
        />
        <el-table-column
          prop="startBlock"
          label="Start Block"
        />

        <el-table-column
          prop="startBlock"
          label="Status"
        />
        <el-table-column
          prop="sender"
          label="Sender"
        />
        <el-table-column
          prop="timestamp"
          label="Date"
        />
        <el-table-column
          fixed="right"
          label=""
          width="120"
        >
          <template slot-scope="scope">
            <el-button :id="scope.id" size="small" round>
              View Detail
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
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
      const ret = await this.$apollo.query({ query: STREAM_LIST_BY_SENDER, variables: { first: 10 } })
      console.log('StreamList send', ret)
      this.sendInfo.list = ret.data.streams
      return ret
    },
    async getListByRecipient (type = 'refresh') {
      const ret = await this.$apollo.query({ query: STREAM_LIST_BY_RECIPIENT, variables: { first: 10 } })
      console.log('StreamList receive', ret)
      this.receiveInfo.list = ret.data.streams
      return ret
    },

    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<!--<style scoped>-->

<!--</style>-->
