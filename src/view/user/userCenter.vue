<template>
  <el-container class="user-center">
    <!-- 顶部 Header -->
    <el-header class="page-header">
      <div class="header-content">
        <h2>个人中心</h2>
        <el-button
          type="primary"
          link
          @click="handleBack"
          class="back-button"
        >
          <el-icon><ArrowLeft/></el-icon>
          返回首页
        </el-button>
      </div>
    </el-header>

    <!-- 主体内容区 -->
    <el-container class="main-container">
      <!-- 左侧导航 -->
      <el-aside width="200px">
        <el-menu
          :default-active="activeMenu"
          class="menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="profile">
            <el-icon><User /></el-icon>
            <span>个人信息</span>
          </el-menu-item>
          <el-menu-item index="products">
            <el-icon><Goods /></el-icon>
            <span>我的商品</span>
          </el-menu-item>
          <el-menu-item index="orders">
            <el-icon><ShoppingCart /></el-icon>
            <span>我的订单</span>
          </el-menu-item>
          <el-menu-item index="sales">
            <el-icon><Sell /></el-icon>
            <span>我的卖出</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 右侧内容 -->
      <el-main>
        <div>
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
    <!-- 底部 Footer -->
  </el-container>
</template>
<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Goods, ShoppingCart, Sell, User } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 计算属性，确定当前激活的菜单项
const activeMenu = computed(() => {
  return route.path.split('/').pop()
})

// 处理菜单选择的函数
const handleMenuSelect = (index) => {
  // 构建跳转路径，确保跳转时保持/user前缀
  router.push(`/user/${index}`)
}

// 处理返回首页的函数
const handleBack = () => {
  router.push('/')
}
</script>

<style scoped>
.user-center {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-header {
  padding: 0;
  height: 60px;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

}

.header-content h2 {
  margin: 0;
  font-size: 24px;
  color: #409EFF;

}

.back-button {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;

}

:deep(.back-button .el-icon) {
  color: #fff;
}

.main-container {
  flex: 1;
  background-color: #f5f7fa;
  display: flex;
}

.el-aside {
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  height: auto;
  flex: none;
}

.menu {
  height: 100%;
  border-right: none;
  position: sticky;
  top: 0;
}

.el-main {
  padding: 5px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.content-card {
  flex: 1;
  display: flex;
  flex-direction: column;
}

:deep(.content-card .el-card__body) {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.page-footer {
  background-color: #fff;
  border-top: 1px solid #e6e6e6;
  padding: 0;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
}

:deep(.el-menu-item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-menu-item .el-icon) {
  margin-right: 4px;
}
</style>
