<template>
  <el-footer class="footer" height="78px">
    <div class="footerContent">
      <a href="/">
        <img src="~@/assets/logo.png" alt="pebbles" height='30'>
      </a>
      <p>2020 xDefi</p>
      <div>
        <router-link
          :to="{ name: 'home' }"
          class="d-inline-block text-blue d-flex"
        >
          <img
            src="~/@/assets/1.svg"
            class="mr-2 v-align-middle"
          >
        </router-link>
        <router-link
          :to="{ name: 'home' }"
          class="d-inline-block text-blue d-flex"
        >
          <img
            src="~/@/assets/2.svg"
            class="mr-2 v-align-middle"
          >
        </router-link>
        <router-link
          :to="{ name: 'home' }"
          class="d-inline-block text-blue d-flex"
        >
          <img
            src="~/@/assets/3.svg"
            class="mr-2 v-align-middle"
          >
        </router-link>
        <router-link
          :to="{ name: 'home' }"
          class="d-inline-block text-blue d-flex"
        >
          <img
            src="~/@/assets/4.svg"
            class="mr-2 v-align-middle"
          >
        </router-link>
        <router-link
          :to="{ name: 'home' }"
          class="d-inline-block text-blue d-flex"
        >
          <img
            src="~/@/assets/5.svg"
            class="mr-2 v-align-middle"
          >
        </router-link>
      </div>
    </div>
    <Login class='account'/>
  </el-footer>
</template>

<script>
import Login from './Login'
export default {
  name: 'Footer',
  components: {
    Login
  }
}
</script>

<style scoped lang="scss">
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    justify-content: center;
    background: #161638;
    width: 100%;
    z-index: 3001;
    display: flex;
    align-items: center;

    .footerContent {
      padding: 10px 0;
      width: 100%;
      text-align: center;
      display: flex !important;
      justify-content: center;
      align-items: center !important;

      p {
        color: #999;
        margin: 0 2rem;
        display: flex;
        align-items: center;
      }
    }

    .account {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .footer {
      .footerContent {
        display: none !important;
      }

      .account {
        display: block;
      }
    }
  }
</style>
