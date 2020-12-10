<template>
  <div class="header">
    <div class="content">
      <img class="logo" src="~/assets/logo.png" alt="">
      <span class="nav-item active">
        <span class="text">xHalfLife</span>
        <span class="indicator" />
      </span>
      <Login style="float: right;" />
      <div style="clear: both;" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style lang="scss" scoped>
  .header {
    background-color: #161638;
    color: #333;
    text-align: center;
    height: 60px;
    position: fixed;
    width: 100%;
    z-index: 1000;

    .content {
      width: 998px;
      position: relative;
      margin: 0 auto;
      height: 100%;

      .logo {
        width: 110px;
        height: 30px;
        position: absolute;
        left: -110px;
        top: 15px;
      }

      .nav-item.active {
        float: left;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        height: 33px;
        margin-top: 18px;
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
    }
  }
</style>
