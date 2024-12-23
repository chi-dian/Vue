

<template>
  <div class="Indexbody">
  <div>
    <!-- 轮播图 -->
    <SwiperModule></SwiperModule>
    <ImgTest></ImgTest>
  </div>
  <div class="leftswiper">
  </div>
<div class="px-4 pt-2 flex justify-center items-center w-full">
  <div class="mx-auto w-full max-w-7xl">
    <div class="flex justify-center items-center">
      <p class="font-bold text-blue-800 text-2xl">最新发布</p>
    </div>

    <div class="mt-4">
      <!-- 商品图片 -->
      <div class="grid grid-cols-4 gap-6">
        <div v-for="product in paginatedProducts" :key="product.id" class="group relative cursor-pointer" @click="goToDetail(product.id)">
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

      <!-- 空状态 -->
      <div v-if="filteredProducts.length === 0" class="mt-4 text-center">
        <div class="text-gray-500">暂无商品</div>
      </div>
    </div>
  </div>
</div>

<!-- 分页组件 -->
<div class="flex justify-center items-center" style="margin-top: 30px;" v-show="paginationShow">
    <el-row>
      <el-col :span="24">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="totalProducts">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</div>

  <!-- 分页组件 -->
</template>
<style>
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
<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import SwiperModule from '@/components/SwiperModule.vue';

const router = useRouter();
const store = useStore();
const currentUser = computed(() => store.state.currentUser);

// 定义 filteredProducts 计算属性
const filteredProducts = computed(() => {
  let products = store.getters.availableProducts;
  return [...products].sort((a, b) => {
    return new Date(b.createTime || 0) - new Date(a.createTime || 0);
  });
});

// 定义分页相关的响应式引用和计算属性
const currentPage = ref(1);
const pageSize = ref(12);
const totalProducts = computed(() => filteredProducts.value.length);
const paginationShow = ref(true);

// 计算当前页面的商品列表
const paginatedProducts = computed(() => {
  return filteredProducts.value.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
});

// 分页改变处理函数
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
};

// 获取卖家信息
const getSeller = (sellerId) => {
  return store.state.users.find(u => u.id === sellerId) || {};
};

// 判断是否是当前用户的商品
const isCurrentUserProduct = (product) => {
  return currentUser.value && product.sellerId === currentUser.value.id;
};

// 获取购买按钮文本
const getBuyButtonText = (product) => {
  if (isCurrentUserProduct(product)) {
    return '不可购买';
  }
  if (product.status === 'sold_out') {
    return '已售罄';
  }
  return '立即购买';
};

// 处理购买
const handleBuy = async (product) => {
  if (!currentUser.value) {
    ElMessage.warning("请先登录");
    router.push('/login');
    return;
  }

  if (isCurrentUserProduct(product)) {
    ElMessage.warning("不能购买自己的商品");
    return;
  }

  // 检查商品状态和库存
  if (product.status !== 'available') {
    ElMessage.error("商品已下架");
    return;
  }

  if (product.stock <= 0) {
    ElMessage.error('商品库存不足');
    return;
  }

  // 直接跳转到结算页面
  router.push({
    path: '/checkout',
    query: {
      from: 'direct',
      productId: product.id,
      quantity: 1
    }
  });
};

// 修改添加到购物车的方法
const handleAddToCart = (product) => {
  if (!currentUser.value) {
    router.push('/login');
    return;
  }

  if (product.status !== 'available' || product.stock <= 0) {
    ElMessage.warning('商品已售罄');
    return;
  }

  store.commit('ADD_TO_CART', {
    userId: currentUser.value.id,
    productId: product.id,
    quantity: 1
  });
  ElMessage.success('已加入购物车');
};

const goToDetail = (productId) => {
  router.push(`/product/${productId}`);
};
</script>


