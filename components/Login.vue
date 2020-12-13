<template>

  <div v-if="isMetaMaskNetworkRight" class="btn">
    <el-button v-if="isMetaMaskConnected"  round type="success">
      {{ metamask.account | addr }}
    </el-button>
    <el-button v-else round @click="onClick">
      Connect MetaMask
    </el-button>
  </div>
  <el-button v-else round type="danger" class="btn">
    Wrong network
  </el-button>

<!--  <el-button v-else :class="{'connected':isMetaMaskConnected}" round @click="onClick">-->
<!--    {{ isMetaMaskConnected?'MetaMask Connected':'Connect MetaMask' }}-->
<!--  </el-button>-->
</template>

<script>
import metamask from '@/api/wallet/metamask'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {}
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
    },
    async connect () {
      const accounts = await metamask.connectMetaMask()
      this.$store.commit('updateAccounts', { accounts, source: 'MetaMask' })
    }
  }
}
</script>

<style scoped>
  .btn {
    margin-top: 15px;
  }
</style>
