<template>
  <el-card style="max-width: 100%;">
    <template #header>
      <div class="card-header">
        <span>修改用户状态</span>
      </div>
      <el-input class="input" v-model="form.userId" style="max-width: 240px;" placeholder="请输入用户ID"/>
      <br>
      <el-button type="primary" style="margin-left: 25%;"  @click="disable">禁用该账户</el-button>
      <el-button type="primary"  @click="activation">激活该账户</el-button>
    </template>
  </el-card>
</template>

<script setup>


import { changeStatus } from '@/api/user';
import { showMessage } from '@/utils/util';
import { reactive,  } from 'vue';


const form = reactive({
    userId: '',
    status: '0',
})

function disable(){
  form.status=0;
  const response = changeStatus(form.userId,form.status);
  if (response.status=='success') {
    showMessage('成功修改用户信息');
  }else{
    showMessage(response.data,'error')
  }
}

function activation() {
  form.status=1;
}



</script>

<style>
/* CSS样式 */
  .input {
    margin-left: 25%;

  }
</style>



