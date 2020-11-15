<template>
  <div class="container">
    <div class="header">
      <div class="content">
        <img class="logo" src="~/assets/logo.png" alt="">
        <span class="nav-item active">
          <span class="text">xHalfLife</span>
          <span class="indicator" />
        </span>
        <Login style="float: right;" />
        <div style="clear: both;" />
      </div>
    </div>

    <div class="module">
      <div class="actions">
        <div> ID：1</div>

        <div>
          <el-button type="primary">
            WithDraw
          </el-button>
          <el-button type="success">
            Cancel
          </el-button>
        </div>
      </div>
      <div class="detail-cards">
        <div class="left">
          <el-card class="card" shadow="always">
            <div slot="header">
              Recipent
            </div>
            729 XDEX
          </el-card>
          <el-card class="card" shadow="always">
            <div slot="header">
              Withdrawable
            </div>
            101 XDEX
          </el-card>
        </div>
        <div class="right">
          <el-card class="card" shadow="always">
            <div slot="header">
              DATE
            </div>
            08 Jan 2019
          </el-card>
          <el-card class="card" shadow="always">
            <div slot="header">
              Withdrawable
            </div>
            AMOUNT
          </el-card>
          <el-card class="card" shadow="always">
            <div slot="header">
              Receiver
            </div>
            0xd0A1...029C
          </el-card>
          <el-card class="card" shadow="always">
            <div slot="header">
              TRX ID
            </div>
            0xd0A1...029C
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { STREAM_FUNDS_BY_STREAMID } from '@/api/apollo/queries'

export default {
  name: 'Detail',
  data () {
    return {
      id: 1
    }
  },
  mounted () {
    console.log('Home mounted')
    this.getData()
  },
  methods: {
    async getData () {
      const ret = await this.$apollo.query({ query: STREAM_FUNDS_BY_STREAMID })
      console.log('getStreamStats', ret)
      const stats = (ret.data && ret.data.streamTotalDatas && ret.data.streamTotalDatas[0]) || {}
      this.stats = stats
    }
  }
}
</script>

<style scoped lang="scss">

  @import "~/pages/home/index.scss";

  .actions {
    display: flex;
    justify-content: space-around;
    margin: 30px;
  }

  .card {
    margin: 5px;
  }

  .detail-cards {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      flex-direction: column;
      width: 320px;

      .card {
        width: 300px;
      }
    }

    .right {
      width: 670px;
      display: flex;
      flex-wrap: wrap;

      .card {
        width: 300px;
      }
    }
  }

</style>
