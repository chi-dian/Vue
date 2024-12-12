import { defineStore } from 'pinia'
import { ref } from 'vue'
import {obUserInfo } from '@/api/user'
import { removeToken } from '@/composables/auth'

// 第一个参数是应用程序中store的唯一id
export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref({})

  // 设置用户信息
  function setUserInfo() {
    // 调用后头获取用户信息接口
    obUserInfo().then(res => {
      if (res.data.success) {
        userInfo.value = res.data.data
      }
    })
  }

  //退出登录
  function logout() {
    //删除cookie中的令牌
    removeToken()
    //删除登录用户的信息
    userInfo.value={}
  }

  return { userInfo, setUserInfo,logout }
},
{
  // 开启持久化
  persist: true,
}
)
