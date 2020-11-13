<template>
  <div>
    <el-table
      :data="tableData"
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
      tableData: [],
      page: 1
    }
  },
  mounted () {
    console.log('StreamList mounted')
    this.getList()
  },
  methods: {
    async getList () {
      const ret = await this.$apollo.query({ query: STREAM_LIST, variables: { first: 10 } })
      console.log('StreamList ret', ret)
      this.tableData = ret.data.streams
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
