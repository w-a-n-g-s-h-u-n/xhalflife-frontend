<template>
  <div class="navs">
    <a
      href="https://swap.kovan.xdefi.com/"
      class="d-inline d-flex nav-item"
      target="_blank"
    >
      Swap
    </a>
    <a
      href="https://pool.kovan.xdefi.com/"
      class="d-inline d-flex nav-item"
      target="_blank"
    >
      Pool
    </a>
    <a
      href="https://farm.kovan.xdefi.com/"
      class="d-inline d-flex nav-item"
      target="_blank"
    >
      Fram
    </a>
    <span class="nav-item active">
      <NuxtLink to="/"><span class="text">HalfLife</span></NuxtLink>
      <span class="indicator" />
    </span>
    <a
      href="https://stat.kovan.xdefi.com/"
      class="d-inline d-flex nav-item"
      target="_blank"
    >
      Stat
    </a>
    <a
      href="https://vote.kovan.xdefi.com/"
      class="d-inline d-flex nav-item"
      target="_blank"
    >
      Vote
    </a>
    <a
      href="https://community.kovan.xdefi.com/"
      class="d-inline d-flex nav-item"
      target="_blank"
    >
      Forum
    </a>
  </div>
</template>

<script>
export default {
  name: 'Navs'
}
</script>

<style lang="scss" scoped>
@import './header.scss';

.navs {
  .nav-item.active {
    display: none !important;
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

        &.active {
          margin-left: 0 !important;
          display: block !important;
        }
      }
    }
  }
}
</style>
