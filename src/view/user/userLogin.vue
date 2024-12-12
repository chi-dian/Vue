<template>
  <div class="user-login-register">
    <!-- 使用Element UI组件库中的el-card构建卡片布局 -->
    <el-card style="max-width: 480px; margin: auto;">
      <template #header>
        <div class="card-header">
          <!-- 根据isLogin的值显示登录或注册标题 -->
          <span>{{ isLogin ? '用户登录' : '用户注册' }}</span>
        </div>
      </template>
      <!-- 登录表单 -->
      <el-form ref="userFormRef" :model="userForm" label-width="120px" v-show="isLogin">
        <el-form-item label="账号">
          <el-input v-model="userForm.email" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="userForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <el-input v-model="userForm.captcha" placeholder="请输入验证码" style="width: 200px;"></el-input>
          <!-- 显示获取到的验证码图片 -->
          <img :src="imageData" alt="验证码" @click="getCaptcha" style="cursor: pointer;"/>
          <el-button @click="getCaptcha" :loading="captchaLoading">获取验证码</el-button>
        </el-form-item>
      </el-form>
      <!-- 注册表单 -->
      <el-form ref="registerForm" :model="userForm" label-width="120px" v-show="!isLogin">
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="输入密码">
          <el-input type="password" v-model="userForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="userForm.confirmPassword" placeholder="请确认密码"></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <el-input v-model="userForm.captcha" placeholder="请输入验证码" style="width: 200px;"></el-input>
          <!-- 显示获取到的验证码图片 -->
          <img :src="imageData" alt="验证码" @click="getCaptcha" style="cursor: pointer;"/>
          <el-button @click="getCaptcha" :loading="captchaLoading">获取验证码</el-button>
        </el-form-item>
      </el-form>
      <!-- 按钮组 -->
      <div class="action">
        <el-button type="primary" @click="submitForm">{{ isLogin ? '登录' : '注册' }}</el-button>
        <el-button @click="toggleView">切换到{{ isLogin ? '注册' : '登录' }}</el-button>
      </div>
      <!-- 响应消息显示 -->
      <div class="message">{{ responseMessage }}</div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getCode, register, login } from '@/api/user'; // 确保路径正确
import { useRouter } from 'vue-router';

// 响应式数据
const isLogin = ref(true);
const userForm = reactive({
  username: '',
  password: '',
  email: '',
  confirmPassword: '',
  captcha: '',
  checkCodeKey: '' // 验证码密钥
});
const captchaLoading = ref(false);
const responseMessage = ref('');
const imageData = ref(''); // 存储图像的Base64数据
const router=useRouter();//创建router实例

// 获取验证码的方法
const getCaptcha = async () => {
  try {
    captchaLoading.value = true;
    const response = await getCode(); // 假设后端提供了获取验证码的API
    userForm.checkCodeKey = response.data.checkCodeKey;
    const base64Data = response.data.checkCode.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''); // 移除data URL的MIME类型部分
    imageData.value = `data:image/png;base64,${base64Data}`; // 更新imageData

    ElMessage.success('验证码已发送');
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
const submitForm = async () => {
  responseMessage.value = '';
  if (isLogin.value) {
    // 登录逻辑
    try {
      const response = await login(userForm.username, userForm.password, userForm.checkCodeKey, userForm.captcha);
      ElMessage.success('登录成功');
      router.push('userInfo')
      console.log(response.data);


      // 处理登录成功的逻辑，例如跳转到主页
    } catch (error) {
      responseMessage.value = error.message || '登录失败';
    }
  } else {
      if (userForm.password!=userForm.confirmPassword) {
        ElMessage.error('两次输入密码不一致');
        return null
      }
    // 注册逻辑
    try {
      console.log(userForm);
      const response = await register(userForm.username,userForm.email, userForm.password, userForm.checkCodeKey, userForm.captcha);
      ElMessage.success('注册成功');
      let result = response.data;
      if(result.status=="error"){
        ElMessage.error(result.info+result.data);
      }

      // 处理注册成功的逻辑，例如跳转到登录页面
    } catch (error) {
      responseMessage.value = error.message || '注册失败';
    }
  }
};

// 切换登录和注册视图的方法
const toggleView = () => {
  isLogin.value = !isLogin.value;
};
</script>

<style scoped>
.user-login-register {
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

.captcha-display {
  margin-left: 10px;
  background-color: #f0f0f0;
  padding: 5px;
  border-radius: 4px;
}
</style>
