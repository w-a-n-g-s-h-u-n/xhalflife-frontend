<template>
  <div>
    <el-table v-loading="loading" :data="homeListData" class="table" :cell-style="cellStyle" :header-cell-style="cellStyle">
      <el-table-column width="70" prop="id" label="ID" />
      <el-table-column align="center" label="Token" min-width="90">
        <template slot-scope="scope">
          <span :title="scope.row.sender" class="icons">
            <i v-if="!scope.row.imgShow">?</i>
            <img v-else :src="scope.row.imgUrl" />
            {{ scope.row.token.symbol }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('Sender')" min-width="120">
        <template slot-scope="scope">
          <span :title="scope.row.sender">{{ scope.row.sender | addr }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('Recipient')" style="background: #272958;" min-width="120">
        <template slot-scope="scope">
          <span :title="scope.row.recipient">{{ scope.row.recipient | addr }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('Deposited')" min-width="100">
        <template slot-scope="scope">
          <span :title="scope.row.depositAmount">{{ scope.row.depositAmount | decimaledAmount(scope.row.token.decimals) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('Withdrawable')" min-width="110">
        <template slot-scope="scope">
          <span :title="scope.row.withdrawable">{{ detailCache[scope.row.id] && detailCache[scope.row.id].withdrawable | decimaledAmount(scope.row.token.decimals) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('StartBlock')" min-width="100">
        <template slot-scope="scope">
          <span :title="scope.row.startBlock">#{{ scope.row.startBlock }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="$t('Status')" min-width="120">
        <template slot-scope="scope">
          <stream-status
            :start-block="scope.row.startBlock"
            :current-block="blockNumber"
            :remaining="detailCache[scope.row.id] && detailCache[scope.row.id].remaining"
            :isCanceled="scope.row.isCanceled"
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('Date')" width="90">
        <template slot-scope="scope">
          <span :title="scope.row.timestamp">{{ scope.row.timestamp | date }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="">
        <template slot-scope="scope">
          <NuxtLink :to="`/detail?id=${scope.row.id}`">
            <el-button :id="scope.row.id" size="small" round class="view-detail-btn" @click="drawer = true">{{ $t('detail.detail') }}</el-button>
          </NuxtLink>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      :current-page.sync="query.page"
      :page-size="query.limit"
      layout="prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { STREAM_LIST } from '@/api/apollo/queries'
import { mapState } from 'vuex'
import web3 from 'web3'
import { statusedList, isKovanEnv } from '@/utils/index'
// import gql from 'graphql-tag'
import mixin from './mixin'
export default {
  name: 'StreamList',
  mixins: [mixin],
  data () {
    return {
      loading: false,
      list: [],
      homeListData:[],
	    http: isKovanEnv() ?'https://static.xdefi.net/blockchains/kovan/':'https://static.xdefi.net/blockchains/ethereum/',
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
      return Number(state.stats.count) || 0
    },
    homeList (state) {
      return state.homeList
    },
    detailCache (state) {
      return state.detailCache
    }
  }),
  created () {
    this.getList()
    this.$store.dispatch('refreshLatestBlockNumber')
  },
  methods: {
    async getList () {
      this.loading = true
      const ret = await this.$apollo.query({ query: STREAM_LIST, variables: { first: this.query.limit, skip: this.skip } })

      const statusList = statusedList(ret.data.streams)
      this.homeListData=statusList
      this.$store.commit('updateSteamList', { key: 'homeList', value: statusList })
      let arr = []
      statusList.map((obj,id)=>{
        let item = obj

        let url
        if(item.token.id === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'){
          url = this.http +'info/logo.png'
        }else{
          url = this.http +'assets/'+ web3.utils.toChecksumAddress(item.token.id) + '/logo.png';

        }
        const img = new Image();
        img.src= url;

        img.onload=()=>{
          item = Object.assign({},obj,{
            imgShow:true,
            imgUrl:url
          })

          arr[id] = item
        }
        img.onerror=()=>{
          item = Object.assign({},item,{
            imgUrl:'',
            imgShow:false
          })
          arr[id] = item
        }




      })
      setTimeout(()=>{
        this.homeListData=arr
        this.$store.commit('updateSteamList', { key: 'homeList', value: arr })
      },1000)

      const ids = statusList.filter(item => !item.isCanceled).map(item => item.id)
      this.refreshBalanceOfStreams(ids)

      this.loading = false
      return ret
    },


    handleSizeChange (val) {

    },
    handleCurrentChange (val) {
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
.icons {
  display: flex;
  align-items: center;
  justify-content: center;
}
.icons i {
  width: 20px;
  height: 20px;
  line-height: 20px;
  font-size: 11px;
  font-style: normal;
  color: #fff;
  margin-right: 5px;
  background-color: #90a4ae;
  border-radius: 50%;
}
.icons img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  object-fit: cover;
  border-radius: 50%;
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
