<template>
  <div id="app">
    <Header />
    <el-alert
      v-if="$nuxt.isOffline"
      title="您可能未连接到互联网, 请连接网络后重试~"
      type="error"
      effect="dark"
      style="z-index: 999; max-width: 340px; position: fixed; top: 20px; right: 20px;"
    />
    <Nuxt/>
    <Footer />
  </div>
</template>
<script> !(function(c,b,d,a){c[a]||(c[a]={});c[a].config={pid:"bi3fe2q9bd@c4babfe7fafae7b",appType:"web",imgUrl:"https://arms-retcode.aliyuncs.com/r.png?",sendResource:true,enableLinkTrace:true,behavior:true}; with(b)with(body)with(insertBefore(createElement("script"),firstChild))setAttribute("crossorigin","",src=d) })(window,document,"https://retcode.alicdn.com/retcode/bl.js","__bl"); </script>
<style>
html {
  background-color: #1f2049;
  color: #90a4ae;
  height: 100%;
  font-family:
    'PingFangSC-Semibold'
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body,
#__nuxt,
#__layout,
#app,
.container {
  background-color: #1f2049;
  color: #90a4ae;
  height: 100%;
  position: relative;
}

.overflow-hidden {
  overflow: hidden !important;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

a {
  text-decoration: none;
  cursor: pointer;
}
</style>
