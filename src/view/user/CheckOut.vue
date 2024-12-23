<template>
  <div class="checkout-container">
    <div class="checkout-header">
      <h2>订单结算</h2>
      <el-button link @click="goBack">返回</el-button>
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="checkout-form"
    >
      <!-- 收货地址 -->
      <div class="section-title">收货地址</div>
      <div class="address-list">
        <div class="address-cards">
          <div
            v-for="addr in addresses"
            :key="addr.id"
            :class="['address-card', { active: selectedAddress?.id === addr.id }]"
            @click="selectAddress(addr)"
            class="address-card"
          >
            <div class="address-card-content">
              <div class="address-info">
                <span class="receiver">{{ addr.receiver }}</span>
                <span class="phone">{{ addr.phone }}</span>
                <span v-if="addr.isDefault" class="default-tag">默认</span>
              </div>
              <div class="address-detail">
                {{ addr.region.join(' ') }} {{ addr.address }}
              </div>
              <div class="address-actions">
                <el-button
                  link
                  type="primary"
                  @click.stop="editAddress(addr)"
                >
                  编辑
                </el-button>
                <el-button
                  link
                  type="danger"
                  @click.stop="deleteAddress(addr.id)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
          <div class="add-address-card" @click="openAddAddressDialog">
            <el-icon><Plus /></el-icon>
            <span>新增收货地址</span>
          </div>
        </div>
      </div>

        <!-- 新增地址弹窗 -->
        <el-dialog
          v-model="addressDialogVisible"
          :title="addressForm.id ? '编辑地址' : '新增地址'"
          width="500px"
          @close="handleAddressDialogClose"
        >
          <el-form
            ref="addressFormRef"
            :model="addressForm"
            :rules="rules"
            label-width="100px"
          >
            <el-form-item label="收货人" prop="receiver">
              <el-input v-model="addressForm.receiver" placeholder="请输入收货人姓名" />
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="addressForm.phone" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item label="所在地区" prop="region">
              <el-cascader
                v-model="addressForm.region"
                :options="regionOptions"
                placeholder="请选择省/市/区"
                class="region-select"
              />
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input
                v-model="addressForm.address"
                type="textarea"
                :rows="2"
                placeholder="请输入详细地址，如街道名称、门牌号等"
              />
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="addressForm.isDefault">设为默认地址</el-checkbox>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="addressDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveAddress">保存</el-button>
          </template>
        </el-dialog>

        <!-- 订单信息 -->
        <div class="section-title">订单信息</div>
        <div class="order-info">
          <div class="info-item">
            <span class="label">订单编号：</span>
            <span class="value">{{ orderNo }}</span>
          </div>
          <div class="info-item">
            <span class="label">下单时间：</span>
            <span class="value">{{ orderTime }}</span>
          </div>
          <div class="info-item">
            <span class="label">付款截止：</span>
            <span class="value countdown" :data-urgent="countdown <= 10">
              {{ formatCountdown }}
            </span>
          </div>
        </div>

        <!-- 商品列表 -->
        <div class="products-list">
          <div
            v-for="item in checkoutItems"
            :key="item.product.id"
            class="product-item"
          >
            <el-image
              :src="item.product.images[0]"
              fit="cover"
              class="product-image"
            />
            <div class="product-info">
              <h4>{{ item.product.title }}</h4>
              <div class="product-specs">
                <span class="spec-item" v-if="item.product.brand">
                  品牌：{{ item.product.brand }}
                </span>
                <span class="spec-item" v-if="item.product.model">
                  型号：{{ item.product.model }}
                </span>
              </div>
              <div class="product-meta">
                <span class="price">¥{{ item.product.price }}</span>
                <span class="quantity">x{{ item.quantity }}</span>
                <span class="subtotal">小计：¥{{ (item.product.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 支付信息 -->
        <div class="payment-section">
          <div class="total-amount">
            商品总计：<span class="amount">¥{{ totalAmount }}</span>
          </div>
          <div class="payment-methods">
            <div class="method-title">支付方式：</div>
            <el-radio-group v-model="form.paymentMethod">
              <el-radio label="wechat">
                <el-icon><Money /></el-icon>
                微信支付
              </el-radio>
              <el-radio label="alipay">
                <el-icon><Wallet /></el-icon>
                支付宝
              </el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="actions">
          <el-button @click="cancelOrder">取消订单</el-button>
          <el-button
            type="primary"
            :loading="submitting"
            @click="submitOrder"
          >
            立即支付
          </el-button>
        </div>
      </el-form>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {  Money, Wallet, Plus } from '@element-plus/icons-vue'
import { regionOptions } from '@/utils/region-data' // 需要添加省市区数据

const store = useStore()
const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const submitting = ref(false)

// 添加 currentUser
const currentUser = computed(() => store.state.currentUser)

// 表单数据
const form = ref({
  paymentMethod: 'wechat'
})

// 表单验证规则
const rules = {
  paymentMethod: [
    { required: true, message: '请选择支付方式', trigger: 'change' }
  ]
}

// 生成订单编号
const orderNo = computed(() => {
  const date = new Date()
  const timestamp = date.getTime()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `ORDER${timestamp}${random}`
})

const orderTime = computed(() => {
  return new Date().toLocaleString()
})

// 修改倒计时相关
const countdown = ref(120) // 改为120秒
const formatCountdown = computed(() => {
  const minutes = Math.floor(countdown.value / 60)
  const seconds = countdown.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

let timer = null
onMounted(() => {
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
      // 当剩余时间小于等于10秒时，显示警告提示
      if (countdown.value <= 10) {
        ElMessage.warning({
          message: `订单即将超时，剩余${countdown.value}秒`,
          duration: 1000
        })
      }
    } else {
      clearInterval(timer)
      handleOrderTimeout()
    }
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})

// 获取购物车商品
const cartItems = computed(() => {
  // 确保用户已登录
  // if (!currentUser.value) {
  //   router.push('/login')
  //   return []
  // }

  if (route.query.from === 'cart') {
    // 从购物车来的订单，获取当前用户的购物车商品
    return store.getters.cartItems(currentUser.value.id)
  } else if (route.query.productId) {
    // 直接购买的商品
    const product = store.state.products.find(p => p.id === parseInt(route.query.productId))
    if (product) {
      return [{
        product,
        quantity: parseInt(route.query.quantity) || 1
      }]
    }
  }
  return []
})

// 计算订单总金额
const orderTotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.product.price * item.quantity)
  }, 0)
})

// 获取要结算的商品
const checkoutItems = computed(() => {
  // 确保用户已登录
  if (!currentUser.value) return []

  if (route.query.from === 'cart') {
    // 如果是从购物车来的，使用所有购物车商品
    return cartItems.value
  } else if (route.query.productId) {
    // 如果是直接购买，只使用指定商品
    const product = store.state.products.find(p => p.id === parseInt(route.query.productId))
    if (product) {
      return [{
        product,
        quantity: parseInt(route.query.quantity) || 1
      }]
    }
  }
  return []
})

// 计算总金额
const totalAmount = computed(() => {
  return checkoutItems.value.reduce((total, item) => {
    return total + (item.product.price * item.quantity)
  }, 0).toFixed(2)
})

// 修改订单超时处理
const handleOrderTimeout = async () => {
  try {
    await ElMessageBox.alert(
      '订单已超时，请重新下单',
      '订单超时',
      {
        type: 'warning',
        confirmButtonText: '确定',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        callback: () => {
          // 如果是从购物车来的返回购物车
          if (route.query.from === 'cart') {
            router.replace('/cart')
          } else {
            // 如果是直接购买的，返回商品列表
            router.replace({
              path: '/',
              query: {
                category: route.query.category || '',
                search: route.query.search || ''
              }
            })
          }
        }
      }
    )
  } catch  {
    // 防止弹窗被意外关闭，强制跳转
    if (route.query.from === 'cart') {
      router.replace('/cart')
    } else {
      router.replace('/')
    }
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 修改取消订单处理
const cancelOrder = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要取消订单吗？取消后需要重新下单',
      '取消订单',
      {
        confirmButtonText: '确定取消',
        cancelButtonText: '继续支付',
        type: 'warning'
      }
    )
    // 取消订单后的跳转逻辑与超时一致
    if (route.query.from === 'cart') {
      router.replace('/cart')
    } else {
      router.replace({
        path: '/',
        query: {
          category: route.query.category || '',
          search: route.query.search || ''
        }
      })
    }
  } catch {
    // 用选择继续支付，不做处理
  }
}

// 确认地图位置选择

// 提交订单
const submitOrder = async () => {
  // 确保用户已登录
  if (!currentUser.value) {
    router.push('/login')
    return
  }

  // 检查是否选择了收货地址
  if (!selectedAddress.value) {
    ElMessage.warning('请选择收货地址')
    return
  }

  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const orderData = {
          items: checkoutItems.value.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            product: item.product
          })),
          totalAmount: orderTotal.value,
          receiver: selectedAddress.value.receiver,
          phone: selectedAddress.value.phone,
          address: `${selectedAddress.value.region.join(' ')} ${selectedAddress.value.address}`,
          from: route.query.from
        }

        const result = await store.dispatch('createOrder', orderData)
        if (result.success) {
          ElMessage.success('订单创建成功')
          router.push('/user/orders')
        } else {
          ElMessage.error(result.message || '创建订单失败')
        }
      } catch {
        ElMessage.error('创建订单失败，请重试')
      }
    }
  })
}

// 添加路由守卫，确保有商品数据和用户已登录
onMounted(() => {
  if (!currentUser.value) {
    ElMessage.warning('请先登录')
    router.replace('/login')
    return
  }

  if (checkoutItems.value.length === 0) {
    ElMessage.error('无效的订单数据')
    router.replace('/')
  }
})

// 在 script setup 中添加新的响应式数据
const addresses = ref([]) // 用户保存的地址列表
const selectedAddress = ref(null) // 当前选中的地址
const addressDialogVisible = ref(false) // 新增/编辑地址弹窗
const addressForm = ref({ // 地址表单数据
  receiver: '',
  phone: '',
  region: [],
  address: '',
  isDefault: false
})

// 获取用户保存的地址列表
const fetchUserAddresses = async () => {
  try {
    // 这里假设从 store 中获取当前用户的地址列表
    const userAddresses = await store.dispatch('getUserAddresses', currentUser.value.id)
    addresses.value = userAddresses
    // 如果有默认地址，则自动选中
    const defaultAddress = userAddresses.find(addr => addr.isDefault)
    if (defaultAddress) {
      selectedAddress.value = defaultAddress
      // 填充表单数据
      form.value.receiver = defaultAddress.receiver
      form.value.phone = defaultAddress.phone
      form.value.region = defaultAddress.region
      form.value.address = defaultAddress.address
    }
  } catch {
    ElMessage.error('获取地址列表失败')
  }
}

// 保存新地址
const saveAddress = async () => {
  if (!addressFormRef.value) return

  await addressFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const addressData = {
          ...addressForm.value,
          userId: currentUser.value.id
        }

        let result
        if (addressForm.value.id) {
          // 更新已有地址
          result = await store.dispatch('updateUserAddress', addressData)
        } else {
          // 新增地址
          result = await store.dispatch('saveUserAddress', addressData)
        }

        if (result.success) {
          ElMessage.success(addressForm.value.id ? '地址更新成功' : '地址添加成功')
          addressDialogVisible.value = false
          await fetchUserAddresses() // 重新获取地址列表

          // 如果是默认地址，自动选中
          if (addressData.isDefault) {
            selectAddress(addressData)
          }
        } else {
          ElMessage.error(result.message || '操作失败')
        }
      } catch {
        ElMessage.error('操作失败，请重试')
      }
    }
  })
}

// 删除地址
const deleteAddress = async (addressId) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个地址吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const result = await store.dispatch('deleteUserAddress', {
      addressId,
      userId: currentUser.value.id
    })

    if (result.success) {
      ElMessage.success('地址删除成功')
      // 如果删除的是当前选中的地址，清空选择
      if (selectedAddress.value?.id === addressId) {
        selectedAddress.value = null
      }
      await fetchUserAddresses()
    } else {
      ElMessage.error(result.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败，请重试')
    }
  }
}

// 选择地址
const selectAddress = (address) => {
  selectedAddress.value = address
  form.value.receiver = address.receiver
  form.value.phone = address.phone
  form.value.region = address.region
  form.value.address = address.address
}

// 在 onMounted 中调用获取地址列表
onMounted(() => {
  fetchUserAddresses()
})

// 添加编辑地址相关方法
const editAddress = (address) => {
  addressForm.value = {
    ...address,
    region: [...address.region] // 确保是新数组
  }
  addressDialogVisible.value = true
}

// 添加重置地址表单方法
const resetAddressForm = () => {
  addressForm.value = {
    receiver: '',
    phone: '',
    region: [],
    address: '',
    isDefault: false
  }
}

// 修改地址弹窗关闭前的处理
const handleAddressDialogClose = () => {
  resetAddressForm()
  if (addressFormRef.value) {
    addressFormRef.value.clearValidate()
  }
}

// 添加地址表单引用
const addressFormRef = ref(null)

// 修改打开新增地址弹窗的处理
const openAddAddressDialog = () => {
  resetAddressForm()
  addressDialogVisible.value = true
}
</script>

<style scoped>
.checkout-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkout-header h2 {
  margin: 0;
  font-weight: normal;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.address-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.region-select {
  width: 100%;
}

.order-info {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #606266;
  width: 100px;
}

.value {
  color: #333;
  flex: 1;
}

.countdown {
  color: #f56c6c;
  font-weight: bold;
  padding: 2px 8px;
  background-color: #fef0f0;
  border-radius: 4px;
  transition: all 0.3s;
}

/* 当倒计时小于等于10秒时添加闪烁动画 */
.countdown[data-urgent="true"] {
  animation: blink 1s infinite;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.products-list {
  margin: 15px 0;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  margin-right: 15px;
}

.product-info {
  flex: 1;
}

.product-info h4 {
  margin: 0 0 10px;
  font-size: 14px;
  color: #333;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #f56c6c;
  font-weight: bold;
}

.quantity {
  color: #909399;
}

.payment-section {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
  margin: 20px 0;
}

.total-amount {
  text-align: right;
  margin-bottom: 20px;
}

.amount {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
  margin-left: 10px;
}

.payment-methods {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 0;
}

.method-title {
  color: #606266;
  font-size: 14px;
}

:deep(.el-radio) {
  margin-right: 30px;
}

:deep(.el-radio .el-icon) {
  margin-right: 4px;
  font-size: 18px;
  vertical-align: middle;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 30px;
}

.address-list {
  margin-bottom: 20px;
}

.address-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.address-card {
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.address-card.active {
  border: 2px solid var(--el-color-primary);
}

.address-card-content {
  position: relative;
}

.address-info {
  margin-bottom: 8px;
}

.receiver {
  font-weight: bold;
  margin-right: 15px;
}

.phone {
  color: #666;
}

.default-tag {
  background-color: var(--el-color-primary);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 10px;
}

.address-detail {
  color: #666;
  line-height: 1.5;
}

.address-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s;
}

.address-card:hover .address-actions {
  opacity: 1;
}

.add-address-card {
  height: 150px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.add-address-card:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.add-address-card .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

/* 商品列表样式增强 */
.product-specs {
  margin: 5px 0;
  font-size: 12px;
  color: #666;
}

.spec-item {
  margin-right: 15px;
}

.subtotal {
  color: #f56c6c;
  font-weight: bold;
}

.region-select {
  width: 100%;
}
</style>
