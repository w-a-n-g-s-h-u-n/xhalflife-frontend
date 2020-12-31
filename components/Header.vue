<template>
  <el-header class="header" height='78px'>
    <div class="content">
      <img class="logo" src="~/assets/xdefi.svg" alt="">
      <div class='navContent'>
        <span class="nav-item active">
          <NuxtLink to="/"><span class="text">HalfLife</span></NuxtLink>
          <span class="indicator" />
        </span>
        <Navs />
      </div>
      <i class="el-icon-s-fold navIcon" @click="drawer=true" />
      <el-drawer
        :visible.sync="drawer"
        :show-close="false"
        :wrapperClosable="true"
        size="50%"
        class="drawer"
      >
        <Navs />
      </el-drawer>
      <Login class="account"/>
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
      drawer: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import './header.scss';
</style>
