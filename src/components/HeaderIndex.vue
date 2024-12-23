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
                          <svg class="w-4 h-4 text-gray-500 dark:text-gray-400"
                              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                          </svg>
                      </div>
                      <input type="search" id="default-search" v-model="searchQuery" @keyup.enter="handleSearch"
                          class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="搜索你想要的内容吧~" required>
                      <button type="submit" @click="handleSearch"
                          class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">搜索</button>
                  </div>
              </form>
          </div>
          <!-- 购物车，判断登录状态-->
          <div class="flex items-center md:order-3">
            <el-badge
                  :value="cartItemCount"
                  :hidden="cartItemCount === 0"
                  class="cart-badge"
                  >
              <el-button type="info" text @click="toCart()"><el-icon><ShoppingCart /></el-icon></el-button>
            </el-badge>
            </div>
          <!-- 卖闲置 -->
          <div class="flex items-center md:order-3">

              <el-button type="info" text @click="toSellItems()"><el-icon><Camera /></el-icon></el-button>

          </div>
          <div class="flex items-center md:order-4">
              <!-- 登录 -->
              <el-dropdown v-if="currentUser" class="flex items-center justify-center" @command="handleCommand">
                <span class="el-dropdown-link flex items-center justify-center text-gray-700 text-xs">
        <!-- 头像 Avatar -->
                <el-avatar class="mr-2" :size="25" :src="currentUser.avatar" />
                 <!-- 显示用户姓名 -->
                {{ currentUser.username }}
               <el-icon class="el-icon--right">
                <arrow-down />
                </el-icon>
               </span>
          <template #dropdown>
           <el-dropdown-menu>
            <!-- 跳转界面 -->
           <el-dropdown-item command="Ofme">个人中心</el-dropdown-item>
           <el-dropdown-item command="SellItems">想卖闲置</el-dropdown-item>
           <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
    </el-dropdown>
           <div v-else class="text-gray-900  mr-1 hover:text-blue-700" >
           <el-button type="primary" text bg @click="$router.push('/login')">登录</el-button>
           <el-button type="primary" text bg @click="$router.push('/register')">注册</el-button>
           </div>
  </div>
  </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const store = useStore()
const router = useRouter()
const route = useRoute()

const currentUser = computed(() => store.state.currentUser)

const cartItemCount = computed(() => {
  if (!currentUser.value) return 0
  return store.getters.cartItemCount(currentUser.value.id)
})

const searchQuery = ref(route.query.search || '')

const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  router.push({
    path: '/',
    query: { search: searchQuery.value }
  })
}

const handleCommand = (command) => {
  if (command === 'logout') {
    store.dispatch('logout')
    router.push('/')
  } else if (command === 'Ofme') {
    router.push('/user')
  } else {
    router.push('/sell')
  }
}

function toCart() {
  if (!currentUser.value) {
    ElMessage.error('请先登录')
    router.push('/login')
  } else {
    router.push('/cart')
  }
}

function toSellItems() {
  if (!currentUser.value) {
    ElMessage.error('请先登录')
    router.push('/login')
  } else {
    router.push('/sell')
  }
}
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
