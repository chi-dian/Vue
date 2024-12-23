<template>
  <div class="user-sales">
    <div class="filter-bar">
      <el-radio-group v-model="filterStatus">
        <el-radio-button label="">全部订单</el-radio-button>
        <el-radio-button label="paid">待发货</el-radio-button>
        <el-radio-button label="shipping">运输中</el-radio-button>
        <el-radio-button label="completed">已完成</el-radio-button>
      </el-radio-group>
    </div>

    <el-table :data="filteredSales" style="width: 100%">
      <el-table-column label="下单时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>

      <el-table-column label="商品信息">
        <template #default="{ row }">
          <div class="product-info">
            <el-image
              :src="getOrderImage(row)"
              fit="cover"
              class="product-image"
            />
            <div class="product-detail">
              <div class="product-title">{{ getOrderTitle(row) }}</div>
              <div class="product-meta">
                <span class="product-price">¥{{ getOrderAmount(row) }}</span>
                <span v-if="isMultipleItems(row)" class="product-count">
                  共 {{ getItemCount(row) }} 件商品
                </span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="买家信息" width="200">
        <template #default="{ row }">
          <div class="buyer-info">
            <div>{{ getBuyer(row.buyerId).username }}</div>
            <div>{{ row.receiver }}</div>
            <div>{{ row.phone }}</div>
            <div class="address">{{ row.address }}</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getOrderStatusType(row.status)">
            {{ getOrderStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <div class="action-buttons">
            <!-- 已支付待发货状态 -->
            <el-button
              v-if="row.status === 'paid'"
              type="primary"
              size="small"
              @click="handleShip(row)"
            >
              发货
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage } from 'element-plus'

const store = useStore()
const filterStatus = ref('')

// 获取销售订单并根据状态筛选
const filteredSales = computed(() => {
  const sales = store.getters.getCurrentUserSales
  if (!filterStatus.value) return sales
  return sales.filter(sale => sale.status === filterStatus.value)
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

  if (order.items?.[0]?.productSnapshot?.images?.[0]) {
    return order.items[0].productSnapshot.images[0]
  }

  if (order.productId) {
    const product = store.state.products.find(p => p.id === order.productId)
    return product?.images?.[0] || ''
  }

  return ''
}

// 获取订单标题
const getOrderTitle = (order) => {
  if (!order) return '未知商品'

  if (order.items?.[0]?.productSnapshot?.title) {
    return order.items[0].productSnapshot.title
  }

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

  if (order.totalAmount) {
    return order.totalAmount
  }

  if (order.price && order.quantity) {
    return order.price * order.quantity
  }

  return 0
}

// 获取买家信息
const getBuyer = (buyerId) => {
  return store.state.users.find(u => u.id === buyerId) || {}
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

// 获取订单状态文本
const getOrderStatusText = (status) => {
  const texts = {
    'unpaid': '未支付',
    'paid': '待发货',
    'shipping': '运输中',
    'completed': '已完成'
  }
  return texts[status] || status
}

// 发货处理
const handleShip = async (order) => {
  try {
    await ElMessageBox.confirm('确认发货？发货后买家可以查看物流状态', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await store.dispatch('updateOrderStatus', {
      orderId: order.id,
      status: 'shipping'
    })
    ElMessage.success('订单已发货')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败，请重试')
    }
  }
}
</script>

<style scoped>
.filter-bar {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
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

.buyer-info {
  font-size: 14px;
  line-height: 1.5;
}

.address {
  color: #606266;
  font-size: 12px;
  margin-top: 4px;
}
</style>
