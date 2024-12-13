<template>
  <div class="register-main h-[600px]" >
      <div class="flex justify-center mt-[0px]">
          <p class="text-[36px]">注册</p>
      </div>
      <form class="max-w-sm mx-auto" @submit.prevent="submitForm">
        <div class="mb-5">
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">邮箱</label>
              <input v-model="email" type="text" id="email" name="email"
              :class="{ 'border-red-500': emailError, 'border-green-500': emailValid }"
              class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  required>
                  <p v-if="emailError" class="text-red-500 text-sm mt-1">邮箱不符合规范，请重新输入</p>
                  <p v-if="emailValid" class="text-green-500 text-sm mt-1">邮箱有效</p>
          </div>
          <div class="mb-5">
              <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">用户名</label>
              <input v-model="username" type="text" id="username" name="username"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  required>
          </div>
          <div class="mb-5">
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">登录密码</label>
              <input v-model="password" type="password" id="password" name="password"
                  :class="{ 'border-red-500': passwordError, 'border-green-500': passwordValid }"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  required>
              <p v-if="passwordError" class="text-red-500 text-sm mt-1">密码太短,请至少输入6个字符</p>
              <p v-if="passwordValid" class="text-green-500 text-sm mt-1">密码有效</p>
          </div>
          <div class="mb-5">
              <label for="confirmPassword"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">确认密码</label>
              <input v-model="confirmPassword" type="password" id="confirmPassword" name="confirmPassword"
                  :class="{ 'border-red-500': confirmPasswordError, 'border-green-500': confirmPasswordValid }"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  required>
              <p v-if="confirmPasswordError" class="text-red-500 text-sm mt-1">密码不匹配</p>
              <p v-if="confirmPasswordValid" class="text-green-500 text-sm mt-1">密码匹配</p>
          </div>
          <div class="mb-5">
        <label for="captcha" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">验证码</label>
        <div class="captcha-container">
          <input v-model="captcha"
            class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
             required>
          <img :src="imageData" alt="验证码" @click="getCaptcha" :loading="captchaLoading" style="cursor: pointer;"/>
        </div>
      </div>
      <div class="mb-5">
        <div class="flex items-start mb-5">
          <div class="flex items-center h-5">
            <input v-model="acceptTerms" id="terms" type="checkbox" value=""
              class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              required>
          </div>
          <label for="terms" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            阅读并接受
            <a href="#" class="text-blue-600 hover:underline dark:text-blue-500">用户协议</a>
            <span>&nbsp;和&nbsp;</span>
            <a href="#" class="text-blue-600 hover:underline dark:text-blue-500">隐私政策</a>
          </label>
        </div>
      </div>
      <div class="mb-5">
        <div class="flex items-start justify-center mb-5">
        <button type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
          font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700
          dark:focus:ring-blue-800">
          注册
        </button>
      </div>
      </div>
      </form>
  </div>
</template>

<script setup>
import { ref,watch,onMounted } from 'vue'
import { register } from '@/api/user'
import { useRouter } from 'vue-router'
import { showMessage } from '@/utils/util'
import { getCode } from "@/api/user";
import { ElMessage } from 'element-plus';


const router = useRouter()
const username = ref('')
const password = ref('')
const email=ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)
const emailError = ref(false);
const emailValid = ref(false);
const passwordError = ref(false);
const passwordValid = ref(false);
const confirmPasswordError = ref(false);
const confirmPasswordValid = ref(false);
const captcha = ref();
const captchaLoading = ref(false);
const checkCodeKey = ref();
const imageData = ref(''); // 存储图像的Base64数据




// 获取验证码的方法
const getCaptcha = async () => {
  try {
    captchaLoading.value = true;
    const response = await getCode(); // 假设后端提供了获取验证码的API
    checkCodeKey.value = response.data.checkCodeKey;
    const base64Data = response.data.checkCode.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''); // 移除data URL的MIME类型部分
    imageData.value = `data:image/png;base64,${base64Data}`; // 更新imageData

    // ElMessage.success('验证码已发送');
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

//检查邮箱是否规范
watch(email, (newVal) => {
      // 检查是否包含'@'，且'@'不在开头或结尾，并且包含'.com'，且'.com'在'@'之后
      const atPosition = newVal.indexOf('@');
      const comPosition = newVal.lastIndexOf('.com');
      if (atPosition > 0 && comPosition > atPosition + 1 && comPosition < newVal.length - 1) {
        emailError.value = false;
        emailValid.value = true;
      } else {
        emailError.value = true;
        emailValid.value = false;
      }
    });

//密码
watch(password, (newVal) => {
  if (newVal.length < 6) {
      passwordError.value = true;
      passwordValid.value = false;
  } else {
      passwordError.value = false;
      passwordValid.value = true;
  }
});
//确认密码
watch(confirmPassword, (newVal) => {
  if (newVal !== password.value) {
      confirmPasswordError.value = true;
      confirmPasswordValid.value = false;
  } else {
      confirmPasswordError.value = false;
      confirmPasswordValid.value = true;
  }
});
const submitForm = async () => {
  // 验证通过后执行注册逻辑
  if (!passwordValid.value || !confirmPasswordValid.value || !acceptTerms.value) {
      // 处理未同意条款或者密码不匹配的逻辑
      return;
  }
  try {

      await register(username.value,email.value, password.value,checkCodeKey.value,captcha.value)
      showMessage("注册成功！")
      return router.push('/login')
      // eslint-disable-next-line
  } catch (error) {
      showMessage("注册失败,请重试！")
  }
}

</script>

<style>
/* .register-main{
  display: flex;
  justify-content: center;
  align-items: center;
} */
.captcha-container {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  gap: 8px; /* 设置组件之间的间距 */
}
</style>
