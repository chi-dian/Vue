<template>
  <div class="user-orders">
    <div class="filter-bar">
      <el-radio-group v-model="filterStatus">
        <el-radio-button label="">全部订单</el-radio-button>
        <el-radio-button label="unpaid">未支付</el-radio-button>
        <el-radio-button label="paid">待发货</el-radio-button>
        <el-radio-button label="shipping">运输中</el-radio-button>
        <el-radio-button label="completed">已完成</el-radio-button>
      </el-radio-group>
    </div>

    <div class="order-cards">
      <el-card
        v-for="order in filteredOrders"
        :key="order.id"
        class="order-card"
      >
        <!-- 订单头部信息 -->
        <div class="order-header">
          <div class="order-time">
            <span class="label">下单时间：</span>
            {{ formatDate(order.createTime) }}
          </div>

        </div>

        <!-- 商品信息 -->
        <div class="order-content">
          <div class="order-info-grid">
            <!-- 商品信息 -->
            <div class="product-info">
              <el-image
                :src="getOrderImage(order)"
                fit="cover"
                class="product-image"
              />
              <div class="product-detail">
                <div class="product-title">{{ getOrderTitle(order) }}</div>
                <div class="product-meta">
                  <span class="product-price">¥{{ getOrderAmount(order) }}</span>
                  <span v-if="isMultipleItems(order)" class="product-count">
                    共 {{ getItemCount(order) }} 件商品
                  </span>
                </div>
              </div>
            </div>

            <!-- 订单金额 -->
            <div class="order-amount">
              <div class="label">订单金额</div>
              <div class="amount">¥{{ getOrderAmount(order) }}</div>
            </div>

            <!-- 卖家信息 -->
            <div class="seller-info">
              <div class="label">卖家</div>
              <div class="seller-name">{{ getSeller(order.sellerId).username }}</div>
            </div>

            <!-- 订单状态 -->
            <div class="status-info">
              <div class="label">订单状态</div>
              <el-tag :type="getOrderStatusType(order.status)">
                {{ getOrderStatusText(order.status) }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 订单操作 -->
        <div class="order-actions">
          <!-- 未支付状态 -->
          <el-button
            v-if="order.status === 'unpaid'"
            type="primary"
            size="small"
            @click="handleRepay(order)"
          >
            重新支付
          </el-button>

          <!-- 运输中状态 -->
          <el-button
            v-if="order.status === 'shipping'"
            type="primary"
            size="small"
            @click="handleConfirmOrder(order)"
          >
            确认收货
          </el-button>

          <!-- 删除按钮（除了运输中状态都可以删除） -->
          <el-button
            v-if="order.status !== 'shipping'"
            type="danger"
            size="small"
            @click="handleDeleteOrder(order)"
          >
            删除订单
          </el-button>

          <!-- 评价按钮 -->
          <el-button
            v-if="order.status === 'completed' && !hasReviewed(order)"
            type="primary"
            size="small"
            plain
            @click="handleReview(order)"
          >
            评价
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 评价弹窗 -->
    <el-dialog
      v-model="reviewDialogVisible"
      title="商品评价"
      width="50%"
    >
      <el-form
        ref="reviewFormRef"
        :model="reviewForm"
        :rules="reviewRules"
        label-width="80px"
      >
        <el-form-item label="评分" prop="rating">
          <el-rate
            v-model="reviewForm.rating"
            show-score
            :max="5"
          />
        </el-form-item>
        <el-form-item label="评价内容" prop="content">
          <el-input
            v-model="reviewForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入您的评价内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reviewDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitReview">
            提交评价
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const store = useStore()
const filterStatus = ref('')
const router = useRouter()

const reviewDialogVisible = ref(false)
const reviewFormRef = ref(null)
const reviewForm = ref({
  orderId: null,
  productId: null,
  rating: 5,
  content: ''
})

const reviewRules = {
  rating: [
    { required: true, message: '请选择评分', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入评价内容', trigger: 'blur' },
    { min: 5, max: 200, message: '评价内容长度在 5 到 200 个字符', trigger: 'blur' }
  ]
}

// 获取订单并根据状态筛选
const filteredOrders = computed(() => {
  const orders = store.getters.getCurrentUserOrders
  if (!filterStatus.value) return orders
  return orders.filter(order => order.status === filterStatus.value)
})

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知时间'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取订单图片
const getOrderImage = (order) => {
  if (!order) return ''

  // 新订单格式
  if (order.items?.[0]?.productSnapshot?.images?.[0]) {
    return order.items[0].productSnapshot.images[0]
  }

  // 旧订单格式
  if (order.productId) {
    const product = store.state.products.find(p => p.id === order.productId)
    return product?.images?.[0] || ''
  }

  return ''
}

// 获取订单标题
const getOrderTitle = (order) => {
  if (!order) return '未知商品'

  // 新订单格式
  if (order.items?.[0]?.productSnapshot?.title) {
    return order.items[0].productSnapshot.title
  }

  // 旧订单格式
  if (order.productId) {
    const product = store.state.products.find(p => p.id === order.productId)
    return product?.title || '未知商品'
  }

  return '未知商品'
}

// 检查是否多件商品
const isMultipleItems = (order) => {
  return order?.items?.length > 1
}

// 获取商品数量
const getItemCount = (order) => {
  if (order?.items?.length > 0) {
    return order.items.length
  }
  return order?.quantity || 0
}

// 获取订单金额
const getOrderAmount = (order) => {
  if (!order) return 0

  // 新订单格式
  if (order.totalAmount) {
    return order.totalAmount
  }

  // 旧订单格式
  if (order.price && order.quantity) {
    return order.price * order.quantity
  }

  return 0
}

// 获取卖家信息
const getSeller = (sellerId) => {
  return store.state.users.find(u => u.id === sellerId) || {}
}

// 获取订单状态文本
const getOrderStatusText = (status) => {
  const texts = {
    'unpaid': '未支付',
    'paid': '已支付',
    'shipping': '运输中',
    'completed': '已完成'
  }
  return texts[status] || status
}

// 获取订单状态样式
const getOrderStatusType = (status) => {
  const types = {
    'unpaid': 'danger',
    'paid': 'warning',
    'shipping': 'primary',
    'completed': 'success'
  }
  return types[status] || 'info'
}

// 重新支付
const handleRepay = async (order) => {
  try {
    await ElMessageBox.confirm(
      '支付订单将加入购物车重新下单，是否继续？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const result = await store.dispatch('repayOrder', order.id)
    if (result.success) {
      ElMessage.success(result.message)
      if (result.redirect) {
        router.push(result.redirect)
      }
    } else {
      ElMessage.error(result.message || '操作失败，请重试')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败，请重试')
    }
  }
}

// 确认收货
const handleConfirmOrder = async (order) => {
  try {
    await ElMessageBox.confirm('确认已收到商品？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await store.dispatch('updateOrderStatus', {
      orderId: order.id,
      status: 'completed'
    })
    ElMessage.success('订单已完成')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败，请重试')
    }
  }
}

// 删除订单
const handleDeleteOrder = async (order) => {
  try {
    await ElMessageBox.confirm('确认要删除该订单吗？此操作不可恢复', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await store.dispatch('deleteOrder', order.id)
    ElMessage.success('订单已删除')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败，请重试')
    }
  }
}

// 检查是否已评价
const hasReviewed = (order) => {
  return store.state.reviews.some(r =>
    r.orderId === order.id &&
    r.buyerId === store.state.currentUser.id
  )
}

// 处理评价
const handleReview = (order) => {
  reviewForm.value = {
    orderId: order.id,
    productId: order.items[0].productId,
    rating: 5,
    content: ''
  }
  reviewDialogVisible.value = true
}

// 提交评价
const submitReview = async () => {
  if (!reviewFormRef.value) return

  await reviewFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await store.dispatch('addReview', {
          ...reviewForm.value,
          buyerId: store.state.currentUser.id,
          createTime: new Date().toISOString()
        })
        ElMessage.success('评价成功')
        reviewDialogVisible.value = false
      } catch{
        ElMessage.error('评价失败，请重试')
      }
    }
  })
}
</script>

<style scoped>
.filter-bar {
  margin-bottom: 20px;
}

.order-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  transition: all 0.3s;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 15px;
}

.order-time {
  color: #606266;
  font-size: 14px;
}

.order-content {
  margin: 15px 0;
}

.order-info-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 20px;
  align-items: center;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 20px;
  border-right: 1px solid #ebeef5;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
}

.product-detail {
  flex: 1;
}

.product-title {
  margin-bottom: 4px;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-price {
  color: #f56c6c;
  font-weight: bold;
}

.product-count {
  color: #909399;
  font-size: 12px;
}

.order-amount,
.seller-info,
.status-info {
  text-align: center;
  padding: 0 10px;
}

.order-amount .amount {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
  margin-top: 5px;
}

.seller-name {
  margin-top: 5px;
  color: #333;
}

.label {
  color: #909399;
  font-size: 12px;
  margin-bottom: 5px;
}

.order-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .order-info-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .product-info {
    border-right: none;
    padding-right: 0;
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 15px;
  }

  .order-amount,
  .seller-info,
  .status-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }

  .label {
    margin-bottom: 0;
  }
}
</style>
