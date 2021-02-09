<template>
  <div class="navs">

    <el-menu class="navs" mode="horizontal" background-color="#161638" active-text-color="#fff">
      <div v-for="(nav, index) in navs" :key="index">
        <el-menu-item v-if="!nav.childrens":key="nav.name" class="menuItem">
          <a :href="nav.name === 'halfLife' ? '/' : nav.href" :class="['d-inline', 'd-flex', 'nav-item', nav.name === 'halfLife' ? 'active' : '']">
            <div class='text'>{{ $i18n.locale === 'zh-CN' ? nav['name-zh'] : nav['name-en'] }}</div>
            <b class='indicator'></b>

          </a>
        </el-menu-item>
        <el-submenu v-else class="menuItem">
          <template slot="title" class="submenu-title">
            <div class="nav-item">{{ $i18n.locale === 'zh-CN' ? nav['name-zh'] : nav['name-en'] }}</div>
          </template>
          <el-menu-item v-for="(child, childIndex) in nav.childrens" :key="`${index}-${childIndex}`" :index="`${index}-${childIndex}`" class="menuItemChild">
            <a :href="child.href"><div class='text'>{{ $i18n.locale === 'zh-CN' ? child['name-zh'] : child['name-en'] }}</div></a>
          </el-menu-item>
        </el-submenu>
      </div>
    </el-menu>
  </div>
</template>

<script>
import navs from 'xdefi-assets/ui/navs.json';

export default {
  name: 'Navs',
  data() {
    return {
      navs
    };
  }
};
</script>

<style lang="scss" scoped>
@import './header.scss';
.menuItem {
  padding: 0 !important;
  border: 0;
  .el-submenu__title {
    .nav-item {
      margin-right: 1.5rem;
    }
  }
}
.menuItemChild {
  height: 40px;
  a {
    width: 100%;
    color: #7e7f9c !important;
  }
}
.navs {
  border-bottom: 0;
  .nav-item {
    text-transform: capitalize;
  }
}
.active > b {

  width: 20px;
  height: 4px;
  background: linear-gradient(137deg, rgb(43, 247, 221) 0%, rgb(58, 143, 247) 51%, rgb(218, 55, 250) 100%);
  border-radius: 3px;
  margin-left: 5px;
}

@media (max-width: 768px) {
  .drawer {
    .navs {
      display: flex !important;
      flex-direction: column;
      padding: 0 1rem;

      .nav-item {
        width: 100%;
        padding: 10px 0;
        text-align: left;
        text-transform: capitalize;

        &.active {
          margin-left: 0 !important;
          display: block !important;
        }
      }
    }
  }
}
</style>
