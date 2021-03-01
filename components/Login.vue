<template>
  <div class="account">
    <div class="btn">
      <el-button v-if="metamaskChainId && !isMetaMaskNetworkRight" round type="danger">
        网络错误
      </el-button>
      <template v-else>
        <el-button v-if="metamaskChainId && metamaskChainId!='0x1'" type="text">
          {{ CHAIN_LABEL[metamaskChainId] || metamaskChainId }}
        </el-button>
      </template>

      <div v-if="isMetaMaskConnected" class="accountBtn" @click="accountDialog = true">
        <Avarter :address="metamask.account" :size="14"/>
        <div>{{ metamask.account | addr }}</div>
      </div>
      <el-button v-else type="primary" round :size="isMobile ? 'small' : 'medium'" @click="accountDialog = true">
        {{ $t('login.Connect') }}
      </el-button>
    </div>
    <el-dialog
      :title="$t('login.Account')"
      :visible.sync="accountDialog"
      class="userManage"
    >
      <el-button v-if="!isMetaMaskConnected" class="wallet" @click="onClick">
        {{ $t('login.METAMASK') }}
      </el-button>
      <el-button v-else type="primary" class="wallet" @click="logout">
        {{ $t('login.logout') }}
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import metamask from '@/api/wallet/metamask'
import { mapGetters, mapState } from 'vuex'
import { isMobile } from '@/utils/index'
import * as config from '@/config'
import Avarter from './Avatar';
export default {
  name: 'Login',
  data () {
    return {
      CHAIN_LABEL: config.CHAIN_LABEL,
      accountDialog: false,
      isMobile: isMobile()
    }
  },
  components: {
    Avarter
  },
  computed: {
    ...mapState(['metamask']),
    ...mapGetters([
      'isMetaMaskConnected',
      'isMetaMaskNetworkRight',
      'metamaskChainId'
    ])
  },
  mounted () {
    console.log('Login mounted')
  },
  methods: {
    onClick () {
      if (!this.isMetaMaskConnected) {
        this.connect()
      }
      this.accountDialog = false
    },
    async connect () {
      const accounts = await metamask.connectMetaMask()
      this.$store.commit('updateAccounts', { accounts, source: 'MetaMask' })
    },
    logout () {
      this.$store.commit('logout')
      this.accountDialog = false
    }
  }
}
</script>

<style scoped lang="scss">
  .btn{
    display: flex;
  }
  .userManage {
    .wallet {
      width: 100%;
      height: 40px;
      border-radius: 20px;
      text-align: center;
      margin-bottom: 10px;
      margin-left: 0;
    }
  }

  .accountBtn{
    margin-left: 24px;
    background: transparent;
    border: 1px solid rgb(65, 71, 107) !important;
    box-sizing: border-box;
    color:#fff;
    width:160px;
    padding: 0 16px;
    height: 44px;
    border-radius: 22px;
    display: flex; 
    justify-content: space-between;
    flex-wrap: nowrap;
    align-items: center
  }

  @media (max-width: 768px) {
    .userManage {
      width: 100%;
    }
  }
</style>
