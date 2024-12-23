<template>
  <div class="admin-login">
    <el-card style="max-width: 480px; margin: auto;">
      <template #header>
        <div class="card-header">
          <span>管理员登录页面</span>
        </div>
      </template>
      <el-form :model="loginForm" label-width="120px">
        <!-- 注意这里移除了 ref="loginForm" -->
        <el-form-item label="账号">
          <el-input v-model="loginForm.username" placeholder="请输入管理员账号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入管理员密码"></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <el-input v-model="loginForm.captcha" placeholder="请输入验证码" style="width: 200px;"></el-input>
          <img :src="imageData" alt="验证码" @click="getCaptcha" :loading="captchaLoading" style="cursor: pointer; margin-left: 8px;" />
          <el-button @click="getCaptcha" :loading="captchaLoading">获取验证码</el-button>
        </el-form-item>
      </el-form>
      <div class="action">
        <el-button type="primary" @click="submitForm">登录</el-button>
      </div>
      <div class="message">{{ responseMessage }}</div>
    </el-card>
  </div>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { userLogin, getCode } from '@/api/user'; // 确保路径正确
import {  useRouter } from 'vue-router'

const loginForm = reactive({
  username: '',
  password: '',
  captcha: '',
  checkCodeKey: '' // 验证码密钥
});
const responseMessage = ref('');
const captchaLoading = ref(false);
const imageData = ref(''); // 存储图像的Base64数据
const router = useRouter();

// 获取验证码的方法
const getCaptcha = async () => {
  try {
    captchaLoading.value = true;
    const response = await getCode(); // 假设后端提供了获取验证码的API
    if (response && response.data && response.data.checkCode && response.data.checkCodeKey) {
      loginForm.checkCodeKey = response.data.checkCodeKey;
      const base64Data = response.data.checkCode.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''); // 移除data URL的MIME类型部分
      imageData.value = `data:image/png;base64,${base64Data}`; // 更新imageData
      ElMessage.success('验证码已发送');
    } else {
      ElMessage.error('验证码获取失败');
    }
  } catch (error) {
    ElMessage.error('验证码获取失败');
    console.log(error);
  } finally {
    captchaLoading.value = false;
  }
};

// 在组件挂载后获取初始验证码
onMounted(() => {
  getCaptcha();
});

// 提交表单的方法
async function submitForm() {
  responseMessage.value = '';
  try {
    const data = await userLogin(loginForm.username, loginForm.password, loginForm.checkCodeKey, loginForm.captcha);
    responseMessage.value = '登录成功';
    // 这里可以进行跳转或其他逻辑处理
    router.push('/admin')
    console.log(data);
  } catch (error) {
    responseMessage.value = '登录失败: ' + error.message;
  }
}
</script>

<style>
.admin-login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.el-card {
  background-color: white;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #409eff;
  color: white;
  padding: 10px;
}

.action {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.message {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>
