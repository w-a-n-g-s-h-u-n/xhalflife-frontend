<template>
  <el-header class="header">
    <div class="content">
      <div class="navContent">
        <img class="logo" src="~/assets/xdefi.svg" alt="">
        <span class="nav-item active">
          <NuxtLink to="/"><span class="text">HalfLife</span></NuxtLink>
          <span class="indicator" />
        </span>
      </div>
      <Login/>
    </div>
  </el-header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style lang="scss" scoped>
  @import "~/pages/home/index.scss";

  .header {
    background-color: #161638;
    color: #333;
    text-align: center;
    height: 60px;
    width: 100%;
    padding: 0;

    .content {
      width: 1000px;
      position: relative;
      margin: 0 auto;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .navContent {
        flex: 1 1 70%;
        display: flex;
      }

      .logo {
        width: 110px;
        height: 30px;
        position: absolute;
        left: -110px;
      }

      .nav-item.active {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        height: 33px;
        margin-left: 50px;
        width: 80px;

        .text {
          /* font-family: pingfangsc-semibold; */
          font-size: 16px;
          color: #fff;
          letter-spacing: 0;
          text-align: center;
        }

        .indicator {
          background-image: linear-gradient(136deg, #2bf7dd 0%, #3a8ff7 51%, #da37fa 100%);
          border-radius: 3px;
          width: 20px;
          height: 4px;
          margin-top: 7px;
        }
      }

      @media (max-width: 768px) {
        width: 100%;
        padding: 0 0.5rem;

        .logo {
          width: auto;
          position: relative;
          left: 0.5rem;
          height: 1.5rem;
        }

        .nav-item.active {
          margin-left: 1rem;
        }
      }
    }
  }
</style>
