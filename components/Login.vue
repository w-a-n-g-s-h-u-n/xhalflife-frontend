<template>
  <el-button v-if="isMetaMaskConnected" class="connected" size="mini" type="success">
    MetaMask Connected
  </el-button>
  <el-button v-else round @click="onClick">
    Connect MetaMask
  </el-button>
<!--  <el-button v-else :class="{'connected':isMetaMaskConnected}" round @click="onClick">-->
<!--    {{ isMetaMaskConnected?'MetaMask Connected':'Connect MetaMask' }}-->
<!--  </el-button>-->
</template>

<script>
import metamask from '@/api/wallet/metamask'
import { mapGetters } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'isMetaMaskConnected'
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
  .connected {
    color: green;
    margin-top: 15px;
  }
</style>
