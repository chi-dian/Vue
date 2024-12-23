<template>
  <div class="app-container">
    <div class="main-content">

          <div class="products-section">
            <div class="toolbar">
              <div class="sort-buttons">
                <el-radio-group v-model="sortType">
                  <el-radio-button label="time">最新发布</el-radio-button>
                  <el-radio-button label="priceAsc">价格从低到高</el-radio-button>
                  <el-radio-button label="priceDesc">价格从高到低</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="mt-4">
              <div class="grid grid-cols-4 gap-6">

                <div v-for="product in filteredProducts" :key="product.id" class="group relative cursor-pointer" @click="goToDetail(product.id)">
          <!-- 圆角内边距 -->
          <div class="bg-white rounded-lg p-4 group-hover:-translate-y-1 group-hover:shadow-lg">
            <img :src="product.images[0]" class="h-64 w-full object-cover" />
            <!-- 绝对定位和控制背景和布局 -->
            <div v-if="product.status === 'sold_out'" class="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold">
              已售罄
            </div>
            <!-- 外边距 -->
            <div class="mt-2">
              <h3 class="text-lg font-semibold">{{ product.title }}</h3>
              <div class="mt-1 flex items-center justify-between">
                <span class="text-red-500 font-bold text-xl">￥{{ product.price }}</span>
                <span class="text-gray-500">库存: {{ product.stock }}</span>
              </div>
              <div class="mt-1 text-gray-500">卖家: {{ getSeller(product.sellerId).username }}</div>
              <div class="mt-2 flex items-center">
                <el-button type="primary" size="large" round :disabled="isCurrentUserProduct(product) || product.status === 'sold_out'" @click.stop="handleBuy(product)" class="button-spacing">
                {{ getBuyButtonText(product) }}
              </el-button>
              <el-button size="large" :disabled="isCurrentUserProduct(product) || product.status === 'sold_out'" @click.stop="handleAddToCart(product)" type="warning" round class="button-spacing">
                加入购物车
              </el-button>
              </div>
            </div>
          </div>
            </div>
          </div>
          <div v-if="filteredProducts.length === 0" class="mt-4 text-center">
          <div class="text-gray-500">暂无商品</div>
          </div>
          </div>
      </div>
 </div>
   </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'



const store = useStore()
const route = useRoute()
const router = useRouter()


const sortType = ref('time')



const currentUser = computed(() => store.state.currentUser)

// 获取搜索关键词
const searchQuery = computed(() => route.query.search || '')

// 商品筛选和��序
const filteredProducts = computed(() => {
  console.log('store state products:', store.state.products)
  console.log('store getters availableProducts:', store.getters.availableProducts)

  let products = store.getters.availableProducts

  // 搜索过滤
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase()
    products = products.filter(p =>
      p.title.toLowerCase().includes(keyword)

    )
  }

    // 排序
  return [...products].sort((a, b) => {
    switch (sortType.value) {
      case 'priceAsc':
        return a.price - b.price
      case 'priceDesc':
        return b.price - a.price
      case 'time':
      default:
        return new Date(b.createTime || 0) - new Date(a.createTime || 0)
    }
  })
})



// 获取卖家信息
const getSeller = (sellerId) => {
  return store.state.users.find(u => u.id === sellerId) || {}
}

// 判断是否是当前用户的商品
const isCurrentUserProduct = (product) => {
  return currentUser.value && product.sellerId === currentUser.value.id
}

// 获取购买按钮文本
const getBuyButtonText = (product) => {
  if (isCurrentUserProduct(product)) {
    return '不可购买'
  }
  if (product.status === 'sold_out') {
    return '已售罄'
  }
  return '立即购买'
}

// 处理购买
const handleBuy = async (product) => {
  if (!currentUser.value) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  if (isCurrentUserProduct(product)) {
    ElMessage.warning('不能购买自己的商品')
    return
  }

  // 检查商品状态和库存
  if (product.status !== 'available') {
    ElMessage.error('商品已下架')
    return
  }

  if (product.stock <= 0) {
    ElMessage.error('商品库存不足')
    return
  }

  // 直接跳转到结算页面
  router.push({
    path: '/checkout',
    query: {
      from: 'direct',
      productId: product.id,
      quantity: 1
    }
  })
}



// 修改添加到购物车的方法
const handleAddToCart = (product) => {
  if (!currentUser.value) {
    router.push('/login')
    return
  }

  if (product.status !== 'available' || product.stock <= 0) {
    ElMessage.warning('商品已售罄')
    return
  }

  store.commit('ADD_TO_CART', {
    userId: currentUser.value.id,
    productId: product.id,
    quantity: 1
  })
  ElMessage.success('已加入购物车')
}

// 修改下拉菜单处理函数


// 添加跳转到详情页的方法
const goToDetail = (productId) => {
  router.push(`/product/${productId}`)
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #fff; /* 设置背景颜色为白色 */
  display: flex; /* 使用 flex 布局 */
  justify-content: center; /* 水平居中 */

  padding: 20px; /* 增加一些内边距 */
}

.main-content {
  max-width: 1400px;
  width: 100%; /* 使主内容区域宽度为100% */
}
.filter-section {
  position: sticky;
  top: 80px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-card:last-child {
  margin-bottom: 0;
}

.price-range {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  justify-content: center;
}

.separator {
  margin: 0 10px;
}

.filter-button {
  width: 100%;
}

.products-section {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.product-image {
  height: 250px;
  overflow: hidden;
  position: relative;
}

.product-image :deep(.el-image) {
  width: 100%;
  height: 100%;
}

.product-info {
  padding: 14px;
}

.product-title {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: normal;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.product-price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
}

.product-stock {
  color: #909399;
  font-size: 14px;
}

.product-seller {
  color: #606266;
  font-size: 14px;
  margin-bottom: 12px;
}

.product-actions {
  display: flex;
  justify-content: flex-end;
}

.empty-state {
  padding: 40px 0;
}

.confirm-content {
  padding: 20px 0;
}

.confirm-product {
  display: flex;
  gap: 16px;
}

.confirm-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}

.confirm-info {
  flex: 1;
}

.confirm-info h4 {
  margin: 0 0 10px;
  font-size: 16px;
  color: #333;
}

.confirm-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.confirm-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px 0;
}

.quantity-label {
  color: #606266;
}

.confirm-total {
  margin-top: 15px;
  font-size: 18px;
  color: #f56c6c;
  font-weight: bold;
}

.sold-out-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
}

.stock-warning {
  color: #e6a23c;
}

.product-actions :deep(.el-button.is-disabled) {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-dropdown-menu__item .el-icon) {
  margin-right: 4px;
  font-size: 16px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

:deep(.el-button .el-icon) {
  margin-right: 4px;
}

.latest-release {
  font-size: 25px;
  line-height: 2.5;
}
.leftswiper{
  margin-top: 50px;
  position: relative;
  width: 40%; /* 设置轮播图宽度 */
  margin-left: 10%;
  /* margin-right: 55%; */
  border-radius: 10px; /* 设置圆角边框，可以根据需要调整数值 */
  overflow: hidden;
}
.leftswiper {
  width: 60%; /* 设置轮播图宽度 */
  border-radius: 10px; /* 设置圆角边框，可以根据需要调整数值 */
  overflow: hidden;
}

.right-container {
  width: 40%; /* 设置分类宽度 */
}
.el-button.button-spacing + .el-button.button-spacing {
  margin-left: 60px; /* 按钮之间的间距 */
}
</style>
