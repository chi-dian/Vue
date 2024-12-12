<template>
  <div class="grid grid-cols-2 h-[650px]">
      <div class="col-span-2 order-2 p-10 md:col-span-1 md:order-1 bg_img">
        <!-- 使用动画类 animate.css 实现弹出效果 -->
          <div class="flex justify-center items-center h-full flex-col animate__animated animate__bounceInLeft animate__fast">
              <h2 class="font-bold text-4xl mb-7 text-white">校园易购——校园交易平台</h2>
              <p class="text-white">测试测试测试测试测试测试测试测试测试测试</p>
              <img src="../../assets/img/wle.png" class="w-1/2">
          </div>
      </div>
      <div class="col-span-2 order-2 p-10 md:col-span-1 md:order-1 bg-white">
          <div class="flex justify-center items-center h-full flex-col animate__animated animate__bounceInRight animate__fast">
              <h1 class="font-bold text-4xl mb-5">欢迎回来</h1>
              <div class="flex items-center justify-center mb-7 text-gray-400 space-x-2">
                  <span class="h-[1px] w-16 bg-gray-200"></span>
                  <span>用户登录</span>
                  <span class="h-[1px] w-16 bg-gray-200"></span>
              </div>
              <el-form class="w-5/6 md:w-2/5" ref="formRef" :model="form">
        <el-form-item>
          <el-input size="large" v-model="form.email" placeholder="请输入用户邮箱" :prefix-icon="Message" clearable />
        </el-form-item>
        <el-form-item>
          <el-input size="large" v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" clearable />
        </el-form-item>
        <el-form-item>
          <el-input size="large" type="password" v-model="form.password" placeholder="请输入用户密码" :prefix-icon="Lock" clearable />
        </el-form-item>
        <el-form-item >
            <el-input
              size="large"
              v-model="form.captcha"
              placeholder="请输入验证码"
              :prefix-icon="CreditCard"
              clearable
            />
            <img :src="captchaCode" class="captcha-image" alt="验证码" @click="getCaptcha" />
          </el-form-item>
        <el-form-item>
          <el-button class="w-full mt-2" size="large" type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
          </div>
    </div>
  </div>
</template>

<script setup>
import { User, Lock, Message, CreditCard } from '@element-plus/icons-vue'
import { getCode, login } from '@/api/user'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { setToken } from '@/composables/auth'//设置token
import { useUserStore } from '@/stores/user'
import { showMessage } from '@/utils/util'

const userStore = useUserStore()
const router = useRouter()

const form = reactive({
  username: '',
  password: '',
  email: '',
  captcha: '',
  checkCodeKey: ''
 })
 const captchaLoading = ref(false)
const captchaCode = ref('') // 存储验证码图片的URL
const formRef = ref(null)//存储表单DOM元素的引用

const getCaptcha = async () => {
  try {
    captchaLoading.value = true
    const response = await getCode() // 假设后端提供了获取验证码的API
    form.checkCodeKey = response.data.checkCodeKey
    captchaCode.value = response.data.captcha // 假设后端返回的验证码图片URL在响应的 captcha 字段
    ElMessage.success('验证码已发送')
  } catch (error) {
    ElMessage.error('验证码获取失败')
    console.error(error)
  } finally {
    captchaLoading.value = false
  }
}

const onSubmit = async () => {
  formRef.value.validate((valid) => {
    if (!valid) {
      showMessage('表单验证不通过')
      return false
    }
    login(form.email, form.username, form.password, form.checkCodeKey, form.captcha).then((res) => {
      if (res.data.success) {
        showMessage('登录成功')
        setToken(res.data.data.token)//保存token
        userStore.setUserInfo(res.data.data.userInfo)//持久化用户信息
        router.push('/index')
      } else {
        showMessage(res.data.message, 'error')
      }
    }).catch((error) => {
      ElMessage.error('登录失败')
      console.error(error)
    })
  })

}

// 初始化时获取验证码
// getCaptcha()
</script>

<style scoped>
.captcha-image {
  cursor: pointer;
  /* 添加一些样式来美化验证码图片 */
}
.bg_img{
  background-image: url('../../assets/img/bg.jpg');
  background-size: cover; /* 使图片覆盖整个元素 */
  background-position: center; /* 使图片居中 */
}
</style>
