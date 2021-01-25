<template>
  <el-header class="header" height="78px">
    <div class="content">
      <img class="logo" src="~/assets/xdefi.svg" alt="" />
      <div class="navContent">
        <span class="nav-item active currentSite">
          <NuxtLink to="/">
            <span class="text">{{ $t('nav.HalfLife') }}</span>
          </NuxtLink>
          <span class="indicator" />
        </span>
        <Navs />
        <Language :show="true"/>
      </div>
      <i class="el-icon-s-fold navIcon" @click="drawer = true" />
      <el-drawer :visible.sync="drawer" :show-close="false" :wrapperClosable="true" size="50%" class="drawer"><Navs /></el-drawer>
      <Login class="account" />
    </div>
  </el-header>
</template>

<script>
import Navs from './Navs'
import Language from './Language'
export default {
  name: 'Header',
  components: {
    Navs, Language
  },
  data () {
    return {
      drawer: false,
      options: [
        {
          label: 'English',
          value: 'en-US'
        },
        {
          label: '简体中文',
          value: 'zh-CN'
        }
      ]
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import './header.scss';
</style>
