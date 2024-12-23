<template>
  <div class="product-details-container">
    <!-- 商品图片 -->
     <!-- 商品图片和信息容器 -->
    <div class="product-details">
    <div class="product-images">
      <el-carousel :interval="4000" type="card" height="500px">
        <el-carousel-item v-for="(image, index) in product?.images" :key="index">
          <el-image :src="image" fit="cover" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 产品信息 -->
    <div class="product-info">
      <h1 class="product-name">{{ product?.title }}</h1>
      <p class="product-description">详情描述：{{ product?.description }}</p>
      <!-- <p class="product-category">{{ product?.category }}</p> -->
      <p class="product-price">￥{{ product?.price.toFixed(2)}}</p>
      <p class="product-stock">库存{{ product?.stock }}</p>
      <p class="seller">
        卖家: {{ getSeller(product?.sellerId)?.username }}
      </p>
      <!-- 购物数量选择 -->
      <el-input-number v-model="quantity" :min="1" :max="product?.stock" :disabled="!canBuy" size="large" class="product-quantity"/>
      <el-button type="primary" size="large" :disabled="!canBuy" @click="handleBuy" round> {{ getBuyButtonText }} </el-button>
      <!-- 加入购物车 -->
      <el-button :disabled="!canBuy" size="large" @click="handleAddToCart" type="warning" round>加入购物车</el-button>
    </div>
  </div>
</div>
  <!-- 评价统计 -->
      <div class="review-summary" v-if="productReview.reviewCount > 0">
        <div class="rating-average">
          <span class="rating-number">{{ productReview.averageRating }}</span>
          <el-rate
            :model-value="averageRating"
            disabled
            show-score
            text-color="#ff9900"
          />
        </div>
        <div class="review-count">
          共 {{ productReview.reviewCount }} 条评价
        </div>
      </div>

       <!-- 评价列表 -->
      <div class="reviews-section">
        <h2>&nbsp;&nbsp;商品评价</h2>
        <div v-if="productReview.reviews.length > 0" class="reviews-list">
          <div v-for="review in productReview.reviews" :key="review.id" class="review-item">
            <div class="review-header">
              <span class="reviewer">{{ getBuyer(review.buyerId)?.username }}</span>
              <el-rate
                :model-value="review.rating"
                disabled
                show-score
                text-color="#ff9900"
              />
              <span class="review-time">{{ formatDate(review.createTime) }}</span>
            </div>
            <div class="review-content">{{ review.content }}</div>
          </div>
        </div>
        <el-empty v-else description="暂无评价" />
      </div>

</template>

<script setup>
import { ref, computed, watch, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';

const store = useStore();
const router = useRouter();
const route = useRoute();
const quantity = ref(1);

// 定义响应式数据
const product = ref(null);

// 获取商品信息
onBeforeMount(() => {
  const productId = parseInt(route.params.id);
  const foundProduct = store.state.products.find(p => p.id === productId);

  if (!foundProduct) {
    router.push('/');
  } else {
    product.value = foundProduct;
  }
});

// 判断是否可以购买
const canBuy = computed(() => {
  return product.value && product.value.status === 'available' && product.value.stock > 0 && product.value.sellerId !== store.state.currentUser?.id;
});

// 获取购买按钮文本
const getBuyButtonText = computed(() => {
  if (!product.value) return '立即购买';
  if (product.value.sellerId === store.state.currentUser?.id) return '不能购买自己的商品';
  if (product.value.status === 'sold_out' || product.value.stock <= 0) return '已售罄';
  return '立即购买';
});

watch(() => product.value, (newProduct) => {
  if (newProduct && newProduct.stock > 0) {
    quantity.value = 1;
  }
}, { immediate: true });
// 获取商品评价统计
const productReview = computed(() => {
  return store.getters.getProductReview(product.value?.id)
})

// 计算平均评分
const averageRating = computed(() => {
  return Number(productReview.value.averageRating)
})
// 获取卖家信息
const getSeller = (sellerId) => {
  return store.state.users.find(u => u.id === sellerId) || {};
};
// 获取买家信息
const getBuyer = (buyerId) => {
  return store.state.users.find(u => u.id === buyerId)
}
// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
// 立即购买
const handleBuy = () => {
  if (!store.state.currentUser || !product.value || !canBuy.value) {
    return;
  }

  router.push({
    path: '/checkout',
    query: {
      productId: product.value.id,
      quantity: quantity.value
    }
  });
};

// 加入购物车
const handleAddToCart = () => {
  if (!store.state.currentUser || !product.value || !canBuy.value) {
    return;
  }

  store.commit('ADD_TO_CART', {
    userId: store.state.currentUser.id,
    productId: product.value.id,
    quantity: quantity.value
  });
  ElMessage.success('已加入购物车');
};

</script>

<style scoped>
.product-details-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* 防止子元素溢出 */
}

.product-details {
  display: flex;
  width: 100%;
}

.product-images,
.product-info {
  flex: 1; /* 使两个容器各占一半空间 */
  padding: 20px; /* 添加一些内边距 */
}

.product-images {
  max-width: 50%; /* 可以设置一个最大宽度，以确保在大屏幕上图片不会太大 */
}

.product-info {
  max-width: 50%; /* 可以设置一个最大宽度，以确保在大屏幕上信息区域不会太大 */
  padding-left: 40px; /* 为信息区域添加左边距，使其与图片区域分隔 */
}

.el-carousel {
  height: 500px; /* 设置轮播图的高度 */
}

.el-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px; /* 为图片添加圆角 */
}
.product-name {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 24px;
}
.product-description {
  font-size: large;
  margin-bottom: 24px;
}
.product-price {
  color: rgb(247, 97, 43);
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 24px;
}
.product-price {
  color: rgb(247, 97, 43);
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 24px;
}

.product-stock {
  color: green;
  margin-bottom: 24px;
}
.product-quantity {
  display: block;
  margin-bottom: 24px;
}
.seller{
  color: #ff8800;
  margin-bottom: 24px;
}
.add-to-cart-button {
  padding: 10px;
  background-color: #ff8800;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1.25rem;
}

.add-to-cart-button:hover {
  background-color: #fb5a49;
}
.reviews-section {
  margin-top: 40px;
  border-top: 1px solid #ebeef5;
  padding-top: 20px;
}

.reviews-section h2 {
  margin-bottom: 20px;
  font-size: 20px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-item {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
}

.reviewer {
  font-weight: bold;
}

.review-time {
  color: #909399;
  font-size: 12px;
}

.review-content {
  color: #606266;
  line-height: 1.6;
}

:deep(.el-carousel__item) {
  border-radius: 4px;
  overflow: hidden;
}

:deep(.el-carousel__item .el-image) {
  width: 100%;
  height: 100%;
}

.review-summary {
  margin: 20px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.rating-average {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-number {
  font-size: 32px;
  color: #ff9900;
  font-weight: bold;
}

.review-count {
  color: #606266;
  font-size: 14px;
}
</style>
