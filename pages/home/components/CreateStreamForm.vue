<template>
  <div class="wrap">
    <el-form label-position="top" label-width="80px" :model="formData" class="form">
      <el-form-item label="Which Token">
        <el-input v-model="formData.token" />
      </el-form-item>
      <el-form-item label="How Much To Start">
        <el-input v-model="formData.amount" />
      </el-form-item>
      <el-form-item label="The Recipent Address">
        <el-input v-model="formData.recipentAddress" />
      </el-form-item>

      <div style="display: flex; justify-content: space-around; align-items: center;">
        <el-form-item label="When Should Start">
          <el-input v-model="formData.start" placeholder="" />
        </el-form-item>
        <el-form-item label="Unlock K Block">
          <el-select v-model="formData.unlockK" placeholder="活动区域">
            <el-option label="100" value="100" />
            <el-option label="200" value="200" />
          </el-select>
        </el-form-item>

        <el-form-item label="Unlock Ratio">
          <el-select v-model="formData.unlockRadio" placeholder="活动区域">
            <el-option label="0.1%" value="0.1" />
            <el-option label="0.2" value="0.2" />
            <el-option label="0.3" value="0.3" />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="actions">
      <el-button type="primary" round class="start-btn btn" @click="onSubmit">
        Start
      </el-button>

      <el-button round class="cancel-btn btn">
        Cancel
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateStreamForm',
  data () {
    return {
      formData: {}
    }
  },
  methods: {
    onSubmit () {
      console.log(this.formData)
    }
  }
}
</script>

<style scoped lang="scss">
  .wrap {
    text-align: left;

    .actions {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .btn {
        width: 343px;
        margin: 0 auto;
      }

      .start-btn {
        background-image: linear-gradient(136deg, #2bf7dd 0%, #3a8ff7 51%, #da37fa 100%);
        border-radius: 28px;
        margin-bottom: 10px;
      }
    }
  }

</style>
