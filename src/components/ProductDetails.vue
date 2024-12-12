<template>
  <div class="product-details-container">
    <!-- 产品图片 -->
    <div class="product-productCover">
      <img :src="product.productCover" :alt="product.productName" />
    </div>
    <!-- 产品信息 -->
    <div class="product-info">
      <h1 class="product-name">{{ product.productName }}</h1>
      <p class="product-description">{{ product.description }}</p>
      <p class="product-category">{{ product.category }}</p>
      <p class="product-price">{{ `$${product.price.toFixed(2)}` }}</p>
      <p class="product-stock">{{ `库存: ${product.stock}` }}</p>

      <!-- 购物数量选择 -->
      <el-input-number v-model="quantity" :min="1" :max="product.stock" class="product-quantity"/>

      <!-- 加入购物车 -->
      <el-button @click="goToCart" type="warning" round>加入购物车</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import { ref, onMounted } from 'vue'
// import { getInfo } from '../api/goodsControl'
// import { useRoute } from 'vue-router'
import router from '@/router';

// const route = useRoute()
// const quantity = ref(1)
// const product = ref({
//   productId: 0,
//   productName: "",
//   description: "",
//   category: "",
//   price: 0,
//   stock: 10,
//   productCover: ""
// })

// onMounted(async () => {
//   try {
//     const response = await getInfo(route.params.productId)
//     product.value = response.data.data
//   } catch (error) {
//     console.error('Error fetching product details:', error)
//   }
// })

const quantity = ref(1)
const product = ref({
  productId: 1,
  productName: "示例产品",
  description: "这是一个示例产品描述。",
  category: "示例分类",
  price: 199.99,
  stock: 10,
  productCover: "https://p1.music.126.net/UXlBOs1uHW07kCu6eok2LQ==/109951170245841890.jpg?imageView&quality=89"
})

const goToCart = () => {
  // 从localStorage获取购物车数据，如果不存在则初始化为空数组
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // 创建一个包含商品图、商品名、商品价格和商品ID的对象
  const cartItem = {
    productId: product.value.productId,
    productName: product.value.productName,
    price: product.value.price,
    image: product.value.productCover,
    quantity: quantity.value
  };

  // 查找购物车中是否已存在该商品
  const existingProductIndex = cart.findIndex(item => item.productId === cartItem.productId);

  if (existingProductIndex !== -1) {
    // 如果存在，更新数量
    cart[existingProductIndex].quantity += cartItem.quantity;
  } else {
    // 如果不存在，添加新商品
    cart.push(cartItem);
  }

  // 更新localStorage中的购物车数据
  localStorage.setItem('cart', JSON.stringify(cart));

  // 跳转到购物车页面
  router.push('/cart');
}
</script>

<style scoped>
.product-details-container {
  display: flex;
  justify-content: space-evenly;
  margin: 20px;
  background-color: white;
  height: 555px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-productCover img {
  max-width: 400px;
  max-height: 400px;
  object-fit: contain;
  margin-top: 30px;
  border-radius: 8px;
}

.product-info {
  max-width: 800px;
  margin-right: 100px;
  margin-top: 50px;
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

.product-category {
  color: #666;
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
</style>
