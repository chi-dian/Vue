<template>
  <nav class="bg-white border-gray-200 border-b dark:bg-gray-900">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <!-- 指向默认页面 -->
          <a href="/" class="flex items-center">
              <img src="../assets/img/LOGO.png" class="h-12 mr-3" alt="shopLogo" />
          </a>

          <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
              <ul
                  class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                  <li>
                      <router-link to="/"
                          class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                          aria-current="page">首页</router-link>
                  </li>
                  <li>
                      <router-link to="/category"
                          class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700
                          md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white
                          md:dark:hover:bg-transparent dark:border-gray-700">分类</router-link>
                  </li>
                  <li>
                    <router-link to="/forum"
                          class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700
                          md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white
                          md:dark:hover:bg-transparent dark:border-gray-700">论坛</router-link>
                  </li>
                  <li>
                      <router-link to="/feedback"
                          class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700
                          md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white
                          md:dark:hover:bg-transparent dark:border-gray-700">反馈</router-link>
                  </li>
              </ul>
          </div>
          <!-- 输入框 -->
          <div class="items-center justify-between hidden  w-full md:flex md:w-auto md:order-2">
              <form class="w-[400px]">
                  <label for="default-search"
                      class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                  <div class="relative">
                      <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                          <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                          </svg>
                      </div>
                      <input type="search" id="default-search"
                          class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="搜索你想要的内容吧~" required>
                      <button type="submit"
                          class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">搜索</button>
                  </div>
              </form>
          </div>
          <!-- 购物车，判断登录状态-->
          <div class="flex items-center md:order-3">
              <el-button type="info" text @click="toCart()"><el-icon><ShoppingCart /></el-icon></el-button>
          </div>
          <div class="flex items-center md:order-4">
              <!-- 登录 -->
              <div v-if="!isLogined" class="text-gray-900  mr-1 hover:text-blue-700" >
                  <el-button type="primary" text bg @click="$router.push('/login')">登录</el-button>
                  <el-button type="primary" text bg @click="$router.push('/register')">注册</el-button>
                  </div>
            <div class="ml-5">
                    <!-- <el-dropdown v-if="isLogined" class="flex items-center justify-center" @command="handleCommand"> -->
                <el-dropdown  class="flex items-center justify-centerr" @command="handleCommand">
                <span class="el-dropdown-link flex items-center justify-center text-gray-700 text-xs">
        <!-- 头像 Avatar -->
                <el-avatar class="mr-2" :size="25" src="https://newonebucket.oss-cn-hongkong.aliyuncs.com/mall/touxiang.png" />
                 <!-- 显示用户姓名 -->
                {{ userStore.userInfo.username }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <!-- 跳转界面 -->
          <el-dropdown-item command="Ofme">个人中心</el-dropdown-item>
          <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
          </div>

      </div>
  </nav>
</template>

<script setup>
import { ref,watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { showModel, showMessage } from '@/utils/util'


// // 引入了用户 Store
const userStore = useUserStore()
const router = useRouter()

// // 是否登录，通过 userStore 中的 userInfo 对象是否有数据来判断
// // 获取 userInfo 对象所有属性名称的数组
const keys = Object.keys(userStore.userInfo)
// // 若大于零，则表示用户已登录,记录为true
const isLogined = ref(keys.length > 0)

// // 监听 userStore.userInfo.username 的变化
watch(() => userStore.userInfo.username, (newUsername) => {
//   // 当用户名变化时，执行相应的逻辑
  isLogined.value = !!newUsername; // 或者使用其他逻辑来判断是否登录
});
// // 下拉菜单事件处理
const handleCommand = (command) => {
  if(command == 'Ofme'){
    if(isLogined.value)
    {router.push('./ofme')}
  else{
    showMessage('请先登录！')
  }
  }
//   // 更新密码
  if (command == 'updatePassword') {
//       // 调用修改密码API
  } else if (command == 'logout') { // 退出登录
    if(isLogined.value)
    {logout()}
    else{
      showMessage('你还未登录~')
    }
  }
}

// // 退出登录
function logout() {
  showModel('是否确认要退出登录？').then(() => {
      userStore.logout()
      // 标记为未登录
      isLogined.value = false
      showMessage('退出登录成功！')
      // 跳转登录页
      router.push('/login')
  })
}
// //跳转到cart
function toCart() {
  if (isLogined.value) {
      router.push("/cart")
  } else {
      showMessage("请先登录！")
      return ;
  }
}

// 初始化 flowbit 相关组件
</script>
<style>
.el-dropdown:focus {
  outline: none;
}

.el-dropdown:hover {
  border: none;
}

.el-avatar:focus {
  outline: none;
}

.el-avatar:hover {
  border: none;
}
</style>
