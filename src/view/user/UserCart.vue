<template>
  <div class="cart-page">
    <!-- 移除 el-card 组件 -->
    <div class="cart-header">
      <h2>购物车</h2>
      <el-button
        type="text"
        @click="$router.push('/')"
      >
        继续购物
      </el-button>
    </div>

    <div v-if="cartItems.length > 0" class="cart-content">
      <el-table
        :data="cartItems"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />

        <el-table-column label="商品信息" min-width="400">
          <template #default="{ row }">
            <div class="product-info">
              <el-image
                :src="row.product.images[0]"
                fit="cover"
                class="product-image"
              />
              <div class="product-detail">
                <h3>{{ row.product.title }}</h3>
                <p class="seller">卖家：{{ getSeller(row.product.sellerId).username }}</p>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="单价" width="120">
          <template #default="{ row }">
            <span class="price">¥{{ row.product.price }}</span>
          </template>
        </el-table-column>

        <el-table-column label="数量" width="150">
          <template #default="{ row }">
            <el-input-number
              v-model="row.quantity"
              :min="1"
              :max="row.product.stock"
              size="small"
              @change="(val) => handleQuantityChange(row.productId, val)"
            />
          </template>
        </el-table-column>

        <el-table-column label="小计" width="120">
          <template #default="{ row }">
            <span class="subtotal">
              ¥{{ (row.product.price * row.quantity).toFixed(2) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button
              type="text"
              @click="handleRemove(row.productId)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="cart-footer">
        <div class="selection-info">
          <el-checkbox
            v-model="selectAll"
            @change="handleSelectAllChange"
          >
            全选
          </el-checkbox>
          <span class="selected-count" v-if="selectedItems.length > 0">
            已选择 {{ selectedItems.length }} 件商品
          </span>
        </div>

        <div class="checkout-info">
          <div class="cart-total">
            总计：
            <span class="total-price">
              ¥{{ cartTotal }}
            </span>
          </div>
          <el-button
            type="primary"
            :disabled="selectedItems.length === 0"
            :loading="checkoutLoading"
            @click="handleCheckout"
          >
            结算 ({{ selectedItems.length }})
          </el-button>
        </div>
      </div>
    </div>

    <el-empty
      v-else
      description="购物车是空的"
      :image-size="200"
    >
      <el-button type="primary" @click="$router.push('/')">
        去购物
      </el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const store = useStore()
const router = useRouter()
const checkoutLoading = ref(false)

// 选中的商品
const selectedItems = ref([])
const selectAll = computed({
  get: () => selectedItems.value.length === cartItems.value.length && cartItems.value.length > 0,
  set: (val) => handleSelectAllChange(val)
})

// 获取当前用户ID
const userId = computed(() => store.state.currentUser?.id)

// 修改购物车数据获取方式
const cartItems = computed(() => store.getters.cartItems(userId.value))
const cartTotal = computed(() => store.getters.cartTotal(userId.value))

// 处理商品选择变化
const handleSelectionChange = (selection) => {
  selectedItems.value = selection
}

// 处理全选
const handleSelectAllChange = (val) => {
  if (val) {
    selectedItems.value = [...cartItems.value]
  } else {
    selectedItems.value = []
  }
}

// 修改结算处理函数
const handleCheckout = () => {
  if (!cartItems.value.length) {
    ElMessage.warning('购物车是空的')
    return
  }

  router.push({
    path: '/checkout',
    query: { from: 'cart' }
  })
}

// 获取卖家信息
const getSeller = (sellerId) => {
  return store.state.users.find(u => u.id === sellerId) || {}
}

// 修改更新数量方法
const handleQuantityChange = (productId, quantity) => {
  store.commit('UPDATE_CART_QUANTITY', {
    userId: userId.value,
    productId,
    quantity
  })
}

// 修改移除商品方法
const handleRemove = async (productId) => {
  try {
    await ElMessageBox.confirm('确定要从购物车中移除此商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    store.commit('REMOVE_FROM_CART', {
      userId: userId.value,
      productId
    })
    ElMessage.success('商品已移除')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败，请重试')
    }
  }
}
</script>

<style scoped>
.cart-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-header h2 {
  margin: 0;
  font-weight: normal;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
}

.product-detail h3 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #333;
}

.seller {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.price {
  color: #666;
}

.subtotal {
  color: #f56c6c;
  font-weight: bold;
}

.cart-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
}

.cart-total {
  font-size: 14px;
  color: #666;
}

.total-price {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
}

.selection-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.selected-count {
  color: #606266;
  font-size: 14px;
}

.checkout-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

:deep(.el-checkbox__label) {
  font-size: 14px;
}
</style>
