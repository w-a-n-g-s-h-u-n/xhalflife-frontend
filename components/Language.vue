<template>
  <div class="language">
    <el-select v-model="$i18n.locale"><el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
  </div>
</template>

<script>

export default {
  name: 'Language',
  props: ['show'],
  data () {
    return {
      options: [
        {
          label: 'English',
          value: 'en-US'
        },
        {
          label: '简体中文',
          value: 'zh-CN'
        }
      ]
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import './header.scss';
</style>
