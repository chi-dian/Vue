

<template>
  <div class="Indexbody">
  <div>
    <!-- 轮播图 -->
    <SwiperModule></SwiperModule>
  </div>
  <div class="leftswiper">
    <!-- 分类+小轮播 -->
<!-- <LeftSwiper></LeftSwiper> -->
<!-- <ListBar></ListBar> -->
  </div>

  <div class="bg-white text-center">
  <div class="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-15 lg:max-w-7xl lg:px-8">
    <p class=" font-bold text-blue-800 latest-release ">最新发布</p>
    <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-50px">
      <!-- 使用v-for动态渲染产品列表 -->
      <div v-for="product in paginatedProducts" :key="product.productId" class="group border-2 rounded-md p-2"
        @click="goProductDetailPage(product.productId)">
        <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
          <!-- 使用产品的图片字段 -->
          <img :src="product.productCover" :alt="product.productName"
            class="h-full w-full object-cover object-center group-hover:opacity-75">
        </div>
        <h3 class="mt-4 text-base text-gray-700 font-mono">{{ product.productName }}</h3>
        <!-- 将价格居中 -->
        <p class="mt-1 text-lg font-medium text-gray-900 text-rose-700 text-center">{{ `$${product.price}` }}</p>
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
</style>
<script setup>
// import LeftSwiper from '@/components/LeftSwiper.vue';
import SwiperModule from '@/components/SwiperModule.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import pg1 from '../../assets/img/LOGO.png'
// import ListBar from '@/components/ListBar.vue';
// import { getList } from '../../api/goodsControl'; // 确保路径正确

// const router = useRouter();
// const products = ref([]);
// const currentPage = ref(1);
// const pageSize = ref(12);
// const totalProducts = ref(0);
// const paginationShow = ref(true);

// // 计算当前页的产品
// const paginatedProducts = computed(() => {
//   const start = (currentPage.value - 1) * pageSize.value;
//   const end = start + pageSize.value;
//   return products.value.slice(start, end);
// });

// // 获取产品列表
// const fetchProducts = async (page) => {
//   try {
//     const response = await getList(page);
//     products.value = response.data;
//     totalProducts.value = response.total; // 假设后端返回了总数据量
//   } catch (error) {
//     console.error('获取产品列表失败:', error);
//   }
// };

// // 在组件挂载时调用API函数
// onMounted(() => {
//   // fetchProducts(currentPage.value);
// });

// // 分页逻辑
// const handleCurrentChange = (newPage) => {
//   currentPage.value = newPage;
//   fetchProducts(newPage);
// };

// // 跳转到产品详情页
// const goProductDetailPage = (productId) => {
//   router.push({ name: 'ProductDetail', params: { id: productId } });
// };

// 静态数据模拟

const router = useRouter();
const products = ref([
  { productId: 1, productCover: pg1, productName: '产品1', price: 100 },
  { productId: 2, productCover: pg1, productName: '产品2', price: 200 },
  { productId: 3, productCover: pg1, productName: '产品3', price: 150 },
  { productId: 1, productCover: pg1, productName: '产品1', price: 100 },
  { productId: 2, productCover: pg1, productName: '产品2', price: 200 },
  { productId: 3, productCover: pg1, productName: '产品3', price: 150 },
  { productId: 1, productCover: pg1, productName: '产品1', price: 100 },
  { productId: 2, productCover: pg1, productName: '产品2', price: 200 },
  { productId: 3, productCover: pg1, productName: '产品3', price: 150 },
  { productId: 1, productCover: pg1, productName: '产品1', price: 100 },
  { productId: 2, productCover: pg1, productName: '产品2', price: 200 },
  { productId: 3, productCover: pg1, productName: '产品3', price: 150 },
  { productId: 1, productCover: pg1, productName: '产品1', price: 100 },
  { productId: 2, productCover: pg1, productName: '产品2', price: 200 },
  { productId: 3, productCover: pg1, productName: '产品3', price: 150 },
  { productId: 1, productCover: pg1, productName: '产品1', price: 100 },
  { productId: 2, productCover: pg1, productName: '产品2', price: 200 },
  { productId: 3, productCover: pg1, productName: '产品3', price: 150 },
  { productId: 1, productCover: pg1, productName: '产品1', price: 100 },
  { productId: 2, productCover: pg1, productName: '产品2', price: 200 },
  { productId: 3, productCover: pg1, productName: '产品3', price: 150 },
  // 添加更多产品数据...
]);
const currentPage = ref(1);
const pageSize = ref(12);
const totalProducts = ref(products.value.length);
const paginationShow = ref(true);

// 计算当前页的产品
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return products.value.slice(start, end);
});

// 分页逻辑
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
};

// 跳转到产品详情页
const goProductDetailPage = (productId) => {
  router.push('/detail/' + productId)
}

// 在组件挂载时调用API函数
onMounted(() => {
  // 使用静态数据，不需要调用API
});
</script>

