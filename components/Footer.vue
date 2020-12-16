<template>
  <div class="d-flex flex-items-center footer">
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
</template>
<style scoped lang="scss">
  .d-flex {
    display: flex !important;
  }

  .flex-items-center {
    align-items: center !important;
  }

  .d-inline-block {
    display: inline-block !important;
  }

  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    justify-content: center;
    background: #161638;
    padding: 10px;
    width: 100%;
    z-index: 999;

    p {
      color: #999;
      margin: 2.5rem;
      display: flex;
      align-items: center;
      padding-right: 150px;
    }

    @media (max-width: 768px) {
      display: none !important;
    }
  }
</style>
