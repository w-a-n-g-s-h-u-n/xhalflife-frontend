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
        label="Recipient"
      >
        <template slot-scope="scope">
          <span :title="scope.row.recipient">{{ scope.row.recipient | addr }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Deposited">
        <template slot-scope="scope">
          <span :title="scope.row.depositAmount">{{ scope.row.depositAmount | precision18 }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="unlockRatio"
        label="Withdrawable"
      />

      <el-table-column label="Start Block">
        <template slot-scope="scope">
          <span :title="scope.row.startBlock">#{{ scope.row.startBlock }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="startBlock"
        label="Status"
      />
      <el-table-column label="Sender">
        <template slot-scope="scope">
          <span :title="scope.row.sender">{{ scope.row.sender | addr }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Date">
        <template slot-scope="scope">
          <span :title="scope.row.timestamp">{{ scope.row.timestamp | date }}</span>
        </template>
      </el-table-column>

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
