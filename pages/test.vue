<template>
  <div class="wrap">
    <div
      style="width: 998px; height: 100%; background-color: #3a8ee6; margin: 0 auto; position: relative; padding-top: 200px;"
    >
      <div style="position: absolute; left: 0; top: 0;">
        <el-table
          :data="tableData"
          class="table"
          style="width: 1198px;"
        >
          <el-table-column
            prop="date"
            label="日期"
            width="150"
          />
          <el-table-column
            prop="name"
            label="姓名"
            width="120"
          />
          <el-table-column
            prop="province"
            label="省份"
            width="220"
          />
          <el-table-column
            prop="city"
            label="市区"
            width="220"
          />
          <el-table-column
            prop="address"
            label="地址"
            width="300"
          />
          <el-table-column
            fixed="right"
            prop="zip"
            label=""
            width="100"
            style="background-color: transparent;"
          />
          <el-table-column
            fixed="right"
            label=""
            width="100"
            style="background-color: transparent;"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleClick(scope.row)">
                查看
              </el-button>
              <el-button type="text" size="small">
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>
</template>

<script>
export default {

  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1517 弄',
        zip: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1519 弄',
        zip: 200333
      }, {
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1516 弄',
        zip: 200333
      }]
    }
  },
  methods: {
    handleClick (row) {
      console.log(row)
    }
  }
}
</script>

<style scoped>
  .wrap {
    width: 100%;
    height: 100%;
    background-color: #5daf34;
  }

  .table {
    width: 1098px;
    margin: 100px auto;
  }
</style>
