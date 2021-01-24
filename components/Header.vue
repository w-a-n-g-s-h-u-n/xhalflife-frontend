<template>
  <el-header class="header" height="78px">
    <div class="content">
      <img class="logo" src="~/assets/xdefi.svg" alt="" />
      <div class="navContent">
        <span class="nav-item active">
          <NuxtLink to="/">
            <span class="text">{{ $t('nav.HalfLife') }}</span>
          </NuxtLink>
          <span class="indicator" />
        </span>
        <Navs />
        <div class="language">
          <el-select v-model="$i18n.locale"><el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
        </div>
      </div>
      <i class="el-icon-s-fold navIcon" @click="drawer = true" />
      <el-drawer :visible.sync="drawer" :show-close="false" :wrapperClosable="true" size="50%" class="drawer"><Navs /></el-drawer>
      <Login class="account" />
    </div>
  </el-header>
</template>

<script>
import Navs from './Navs'

export default {
  name: 'Header',
  components: {
    Navs
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
