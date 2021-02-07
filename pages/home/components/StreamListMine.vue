<template>
  <div>
    <div class="tabs">
      <div class="tab" :class="{'active':current=='received'}" @click="change('received')">
        {{$t('home.Received')}}
      </div>
      <div class="tab" :class="{'active':current=='send'}" @click="change('send')">
        {{$t('home.Sent')}}
      </div>
    </div>

    <div v-if="current=='send'">
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
            <span :title="scope.row.sender" class="icons">
            <i v-if="!scope.row.imgShow">?</i>
            <img v-else :src="scope.row.imgUrl" />
            {{ scope.row.token.symbol}}</span>
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
                {{$t('detail.detail')}}
                <stream-balance :id="scope.row.id" :row="scope.row" />
              </el-button>
            </NuxtLink>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        :page-size="sendInfo.pageSize"
        layout="prev, pager, next"
        :total="sendInfo.total"
        @current-change="handleCurrentChange"
      />
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
            <span :title="scope.row.sender" class="icons">
            <i v-if="!scope.row.imgShow">?</i>
            <img v-else :src="scope.row.imgUrl" />
            {{ scope.row.token.symbol}}</span>
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
      <el-pagination
        class="pagination"
        :current-page.sync="receiveInfo.page"
        :page-size="receiveInfo.pageSize"
        layout="prev, pager, next"
        :total="receiveInfo.total"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { STREAM_LIST_BY_SENDER, STREAM_LIST_BY_RECIPIENT } from '@/api/apollo/queries'
import { mapState } from 'vuex'
import { ethers } from 'ethers'
import { statusedList } from '@/utils/index'
import mixin from './mixin'
import web3 from 'web3'
export default {
  name: 'StreamListMine',
  mixins: [mixin],
  data () {
    return {
      current: 'received',
      sendInfo: {
        loading: false,
        page: 1,
        pageSize: 10,
        total: 10
      },
      http:window.location.origin.indexOf('ethereum')<0?'https://static.xdefi.net/blockchains/kovan/':'https://static.xdefi.net/blockchains/ethereum/',

      receiveInfo: {
        loading: false,
        pageSize: 10,
        page: 1,
        total: 10
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
      return this.current === 'send' ? this.MySentList : this.myReceivedList
    },
    currentPage () {
      return this.current === 'send' ? this.sendInfo.page : this.receiveInfo.page
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
      if (!ethers.utils.isAddress(this.account)) {
        this.$message({
          message: 'Please connect to metemask account first',
          type: 'warning'
        })
        return
      }
      this.current = v
      this.current === 'send'
        ? this.getListBySender('refresh')
        : this.getListByRecipient('refresh')
    },
    formData(data,type){
      let arr = []
      data.map((obj,id)=>{

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
        this.$store.commit('updateSteamList', { key: type, value: arr })
      },1000)
    },
    // TODO 分页 我发出的
    async getListBySender (type = 'refresh') {
      this.sendInfo.loading = true
      const queryVariable = {
        first: this.sendInfo.pageSize,
        skip: type === 'refresh' ? 0 : (this.sendInfo.page - 1) * this.sendInfo.pageSize,
        sender: this.account
      }
      const ret = await this.$apollo.query({ query: STREAM_LIST_BY_SENDER, variables: queryVariable })
      console.log(`StreamList send ${this.sendInfo.page}`, ret)
      if (ret.data.streams.length < this.sendInfo.pageSize) {
        this.sendInfo.total = (this.sendInfo.page - 1) * this.sendInfo.pageSize + ret.data.streams.length
      } else {
        this.sendInfo.total = this.sendInfo.total + this.sendInfo.pageSize
      }
      let arr=[]
      ret.data.streams.map(obj=>{
        console.log(`StreamList send remaining`, this.detailCache[obj.id])
        if(!(obj.startBlock&&this.blockNumber&&this.detailCache[obj.id] && this.detailCache[obj.id].remaining)){
          return
        }
        arr.push(obj)
      })
      setTimeout(()=>{
        this.$store.commit('updateSteamList', { key: 'MySentList', value: statusedList(arr) })
        this.sendInfo.loading = false
      },300)

      this.formData(statusedList(ret.data.streams),'MySentList')




      const ids = ret.data.streams.map(item => item.id)
      this.refreshBalanceOfStreams(ids)

      return ret
    },
    // 我收到的
    async getListByRecipient (type = 'refresh') {
      this.receiveInfo.loading = true
      const queryVariable = {
        first: this.receiveInfo.pageSize,
        skip: type === 'refresh' ? 0 : (this.receiveInfo.page - 1) * this.receiveInfo.pageSize,
        recipient: this.account
      }
      const ret = await this.$apollo.query({ query: STREAM_LIST_BY_RECIPIENT, variables: queryVariable })
      if (ret.data.streams.length < this.receiveInfo.pageSize) {
        this.receiveInfo.total = (this.receiveInfo.page - 1) * this.receiveInfo.pageSize + ret.data.streams.length
      } else {
        this.receiveInfo.total = this.receiveInfo.total + this.receiveInfo.pageSize
      }
      let arr=[]
      ret.data.streams.map(obj=>{
        if(!(obj.startBlock&&this.blockNumber&&this.detailCache[obj.id] && this.detailCache[obj.id].remaining)){
          return
        }
        arr.push(obj)
      })
      setTimeout(()=>{
        this.$store.commit('updateSteamList', { key: 'myReceivedList', value: statusedList(arr) })
        this.sendInfo.loading = false
      },300)

      //this.$store.commit('updateSteamList', { key: 'myReceivedList', value: statusedList(arr) })
      this.formData(statusedList(ret.data.streams),'myReceivedList')
      //this.receiveInfo.loading = false

      const ids = ret.data.streams.map(item => item.id)
      this.refreshBalanceOfStreams(ids)

      return ret
    },

    handleCurrentChange (val) {
      if (this.current === 'received') {
        this.receiveInfo.page = val
        this.getListByRecipient('fetch')
      } else {
        this.sendInfo.page = val
        this.getListBySender('fetch')
      }
    },
    cellStyle (obj) {
      return 'background-color:#272958;border-bottom-color:#2E2F5C;color:#7E7F9C;'
    }
  }
}
</script>

<style scoped lang="scss">
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
      cursor: pointer;

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
