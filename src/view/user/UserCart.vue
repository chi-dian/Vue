<template>
  <div class="cart-container">
    <!-- 头栏 -->
    <div class="car">
      <div class="head_row">
        <div class="item-check"><input type="checkbox" v-model="isAllChecked" @change="toggleAllCheck" /></div>
        <div class="item-image">商品图片</div>
        <div class="item-name">商品名称</div>
        <div class="item-price">单价</div>
        <div class="item-quantity">数量</div>
        <div class="item-subtotal">小计</div>
        <div class="item-action">操作</div>
      </div>
    </div>
    <!-- 商品 -->
    <div class="cart-items">
      <div class="cart-item" v-for="item in cartItems" :key="item.productId">
        <div class="item-check">
          <input type="checkbox" v-model="item.isCheck" @change="calculateTotal" />
        </div>
        <div class="item-image" @click="goProductDetailPage(item.productId)">
          <img :src="item.image" :alt="item.productName" />
        </div>
        <div class="item-name">{{ item.productName }}</div>
        <div class="item-price">{{ `$${item.price.toFixed(2)}` }}</div>
        <div class="item-quantity">
          <el-input-number
            v-model="item.quantity"
            :min="1"
            @change="updateQuantity(item)"
          />
        </div>
        <div class="item-subtotal">{{ `$${(item.price * item.quantity).toFixed(2)}` }}</div>
        <div class="item-action">
          <button @click="removeItem(item.productId)">删除</button>
        </div>
      </div>
    </div>
    <div class="cart-summary">
      <div>选中商品总价: {{ `$${totalPrice.toFixed(2)}` }}</div>
      <button @click="goToCheckout">结算</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElInputNumber } from 'element-plus'

const router = useRouter()
const cartItems = ref([])
const totalPrice = ref(0)
const isAllChecked = ref(false)

onMounted(() => {
  // 从localStorage获取购物车数据
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    cartItems.value = JSON.parse(storedCart).map(item => ({ ...item, isCheck: false }));
  }
})

const calculateTotal = () => {
  totalPrice.value = cartItems.value.reduce((total, item) => {
    return total + (item.isCheck ? item.price * item.quantity : 0);
  }, 0);
}

const updateQuantity = () => {
  // 确保使用 item 参数
  calculateTotal();
  updateLocalStorage();
}

const removeItem = (productId) => {
  cartItems.value = cartItems.value.filter(item => item.productId !== productId);
  calculateTotal();
  updateLocalStorage();
}

const updateLocalStorage = () => {
  localStorage.setItem('cart', JSON.stringify(cartItems.value));
}

const goToCheckout = () => {
  router.push('/checkout');
}

const toggleAllCheck = () => {
  cartItems.value.forEach(item => (item.isCheck = isAllChecked.value));
  calculateTotal();
}

const goProductDetailPage = (productId) => {
  router.push('/detail/' + productId);
}

watch(cartItems, (newVal) => {
  isAllChecked.value = newVal.every(item => item.isCheck);
  calculateTotal();
}, { deep: true });

// 初始计算总价
calculateTotal();
</script>

<style scoped>
.cart-container {
  margin: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.head_row, .cart-item {
  display: grid;
  grid-template-columns: 50px repeat(6, 1fr); /* 平分空间 */
  align-items: center;
  justify-items: center;
  padding: 10px;
  border-bottom: 1px solid #e9e9e9;
}

.item-image img {
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
  border-radius: 8px;
  cursor: pointer; /* 添加鼠标样式表示可点击 */
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f7f7f7;
  border-top: 1px solid #e9e9e9;
}
</style>
