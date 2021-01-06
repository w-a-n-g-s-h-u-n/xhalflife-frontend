<template>
  <el-footer class="footer" height="78px">
    <div class="footerContent">
      <a href="/">
        <img src="~@/assets/logo.png" alt="pebbles" height='30'>
      </a>
      <div class='contractIcons'>
        <a class='iconContent' href="ttps://www.chainnews.com/u/895866208677.htm" target="_blank">
          <div class='chainNews'></div>
        </a>
        <a class='iconContent' href="https://xdefilab.medium.com/" target="_blank">
          <font-awesome-icon :icon="['fab', 'medium-m']" size="lg"/>
        </a>
        <a class='iconContent' href="https://twitter.com/xdefilab" target="_blank">
          <font-awesome-icon :icon="['fab', 'twitter']" size="lg"/>
        </a>
        <a class='iconContent' href="https://github.com/xdefilab" target="_blank">
          <font-awesome-icon :icon="['fab', 'github']" size="lg"/>
        </a>
        <a class='iconContent' href="https://discord.gg/SuXhDHbAN3" target="_blank">
          <font-awesome-icon :icon="['fab', 'discord']" size="lg"/>
        </a>
        <a class='iconContent' href="https://t.me/xdeficn" target="_blank">
          <font-awesome-icon :icon="['fab', 'telegram-plane']" size="lg"/>
          <span class='lang'>中</span>
        </a>
        <a class='iconContent' href="https://t.me/xdefilab" target="_blank">
          <font-awesome-icon :icon="['fab', 'telegram-plane']" size="lg"/>
          <span class='lang'>EN</span>
        </a>
        <el-popover
          placement="top"
          width="200"
          trigger="click">
          <div class="popover" style="text-align: center;">
            <img src='~@/assets/wechat.png' alt='' width='150'/>
          </div>
          <div class='iconContent' slot="reference">
            <font-awesome-icon :icon="['fab', 'weixin']" size="lg"/>
          </div>
        </el-popover>
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
    background: #161638;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .footerContent {
      padding: 10px 0;
      width: 100%;
      text-align: center;
      display: flex !important;
      justify-content: space-around;
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

    .contractIcons {
      display: flex;
      justify-content: flex-end;
    }

    .iconContent {
      width: 40px;
      height: 40px;
      margin: 0 8px;
      background: rgba(83, 84, 132, 0.6);
      border-radius: 3px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #000;
      text-align: center;
      position: relative;

      .chainNews {
        width: 35px;
        height: 18px;
        background: url('~@/assets/chainNews.svg') 105% center no-repeat;
        background-size: cover;
        overflow: hidden;
      }

      .lang {
        position: absolute;
        bottom: 5px;
        left: 5px;
        font-size: 6px !important;
        transform: scale(0.6);
      }
    }
  }

  @media (max-width: 768px) {
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 3001;

      .footerContent {
        display: none !important;
      }

      .account {
        display: block;
      }
    }
  }
</style>
