<template>
  <div class="mainParent">
    <div class="hKxtfS"><img src="../assets/bg.png" /></div>
    <Home />
    <div class="fQDgZz"><img src="../assets/bg.png" /></div>
  </div>
</template>

<script>
import Home from '@/pages/home';
export default {
  components: { Home }
};
</script>
<style lang="scss" scoped>
  .mainParent{
    position: relative;
    overflow: hidden;
  }
.hKxtfS {
  width: 50%;
  min-width: 300px;
  position: absolute;
  left: 200px;
  top: 0px;
  z-index: 0;
}
.hKxtfS img {
  width: 100%;
}
.fQDgZz img {
  width: 100%;
}
.fQDgZz {
  position: absolute;
  bottom: 0px;
  width: 50%;
  min-width: 300px;
  left: auto;
  margin-top: 0px;
  transform: rotateX(180deg);
  top: auto;
  right: 100px !important;
}
</style>
