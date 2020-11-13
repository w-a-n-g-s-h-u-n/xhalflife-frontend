<template>
  <el-button :disabled="isMetaMaskConnected" @click="onClick" round>
    {{ isMetaMaskConnected?'MetaMask Connected':'Connect MetaMask' }}
  </el-button>
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

<!--<style scoped>-->
<!--</style>-->
