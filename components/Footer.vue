<template>
  <el-footer class="footer" height="78px">
    <div class="footerContent">
      <a href="/">
        <img src="~@/assets/logo.png" alt="pebbles" height='30'>
      </a>
      <div class='contractIcons'>
        <a class='iconContent' href="https://www.chainnews.com/u/895866208677.htm" target="_blank">
          <div class='chainNews'></div>
        </a>
        <a
          v-for="contact in contacts"
          :key="contact.name"
          class="iconContent"
          :href="contact.href"
          target="_blank"
        >
          <font-awesome-icon :icon="contact.iconClass" size="lg"/>
          <span class='lang' v-if="contact.name.includes('telegram')">{{contact.name === 'telegramCn' ? '中' : 'EN'}}</span>
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
    <Language />
  </el-footer>
</template>

<script>
import contacts from 'xdefi-assets/ui/footer.json'
import Login from './Login'
import Language from './Language'

export default {
  name: 'Footer',
  components: {
    Login, Language
  },
  data () {
    return {
      contacts
    }
  },
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
      z-index: 1001;

      .footerContent {
        display: none !important;
      }

      .account {
        display: block;
      }
    }
  }
</style>
