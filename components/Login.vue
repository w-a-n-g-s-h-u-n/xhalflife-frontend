<template>
  <div class="account">
    <div class="btn">
      <el-button v-if="isMetaMaskConnected"  round type="success" @click="accountDialog = true">
        {{ metamask.account | addr }}
      </el-button>
      <el-button v-else type='primary' round @click="accountDialog = true" :size="isMobile ? 'small' : 'medium'">
        Connect Wallet
      </el-button>
    </div>
    <el-dialog
      title="Account"
      :visible.sync="accountDialog"
      :width="isMobile ? '80%' : '25%' "
      class="userManage"
    >
      <el-button v-if="!isMetaMaskConnected" @click="onClick" class='wallet'>METAMASK</el-button>
      <el-button v-else type="primary" @click="logout" class='wallet'>logout</el-button>
    </el-dialog>
  </div>
</template>

<script>
import metamask from '@/api/wallet/metamask'
import { mapGetters, mapState } from 'vuex'
import { isMobile } from '@/utils/index'

export default {
  name: 'Login',
  data () {
    return {
      accountDialog: false,
      isMobile: isMobile()
    }
  },
  computed: {
    ...mapState(['metamask']),
    ...mapGetters([
      'isMetaMaskConnected',
      'isMetaMaskNetworkRight'
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

  @media (max-width: 768px) {
    .userManage {
      width: 100%;
    }
  }
</style>
