<template>
  <div class="navs">
    <a
      v-for='nav in navs'
      :key='nav.name'
      :href="nav.name !== 'halfLife' ? nav.href : '/'"
      :class="['d-inline', 'd-flex', 'nav-item', nav.name === 'halfLife' ? 'active' : '' ]"
      :target="nav.name !== 'halfLife' ? '_blank' : '' "
    >
      <span class="text">{{nav.name}}</span>
      <span class="indicator" />
    </a>
  </div>
</template>

<script>
import navs from 'xdefi-assets/ui/navs.json'

export default {
  name: 'Navs',
  data () {
    return {
      navs
    }
  }
}
</script>

<style lang="scss" scoped>
@import './header.scss';

.navs {
  .nav-item {
    text-transform: capitalize;
  }
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
