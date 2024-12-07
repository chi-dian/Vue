<template>
  <div class="admin-login">
    <el-card style="max-width: 480px; margin: auto;">
      <template #header>
        <div class="card-header">
          <span>管理员登录页面</span>
        </div>
      </template>
      <el-form ref="loginForm" :model="loginForm" label-width="120px">
        <el-form-item label="账号">
          <el-input v-model="loginForm.username" placeholder="请输入管理员账号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入管理员密码"></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <el-input v-model="loginForm.captcha" placeholder="请输入验证码" style="width: 200px;"></el-input>
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

<script>
import { userLogin, useCode } from '@/api/user'; // 确保路径正确

export default {
  name: 'AdminLogin',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        captcha: '',
        checkCodeKey: '' // 验证码密钥
      },
      responseMessage: '',
      captchaLoading: false
    };
  },
  methods: {
    // 获取验证码的方法
    getCaptcha() {
      // 这里应该是调用后端接口获取验证码的逻辑
      useCode()
        .then(data => {
          this.loginForm.checkCodeKey = data.checkCodeKey; // 假设后端返回了验证码密钥
          this.responseMessage = '验证码已发送';
        })
        .catch(error => {
          this.responseMessage = '验证码获取失败';
          console.log(error);

        });
    },
    // 提交表单的方法
    submitForm() {
      this.responseMessage = '';
      userLogin(this.loginForm.username, this.loginForm.password, this.loginForm.checkCodeKey, this.loginForm.captcha)
        .then(data => {
          this.responseMessage = '登录成功';
          // 这里可以进行跳转或其他逻辑处理
          console.log(data);

        })
        .catch(error => {
          this.responseMessage = '登录失败: ' + error.message;
        });
    }
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
