<template>
  <div>
    <div class="btn">
      <el-button v-if="isMetaMaskConnected"  round type="success" @click="accountDialog = true">
        {{ metamask.account | addr }}
      </el-button>
      <el-button v-else type='primary' round @click="accountDialog = true">
        Connect Wallet
      </el-button>
    </div>
    <el-dialog
      title="Account"
      :visible.sync="accountDialog"
      width="20%"
    >
      <el-button v-if="!isMetaMaskConnected" @click="onClick" class='wallet'>METAMASK</el-button>
      <el-button v-else type="primary" @click="logout" class='wallet'>logout</el-button>
    </el-dialog>
  </div>
</template>

<script>
import metamask from '@/api/wallet/metamask'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      accountDialog: false
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

<style scoped>
  .btn {
    margin-top: 15px;
  }

  .wallet {
    width: 100%;
    height: 40px;
    border-radius: 20px;
    text-align: center;
    margin-bottom: 10px;
    margin-left: 0;
  }
</style>
