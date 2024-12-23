<template>
  <div class="user-products">
    <el-table
      :data="myProducts"
      style="width: 100%"
      class="products-table"
    >
      <el-table-column label="商品图片" width="120">
        <template #default="{ row }">
          <el-image
            :src="row.images[0]"
            :preview-src-list="row.images"
            fit="cover"
            class="product-image"
            preview-teleported
          />
        </template>
      </el-table-column>

      <el-table-column prop="title" label="商品名称" min-width="200" />

      <el-table-column prop="price" label="单价" width="100">
        <template #default="{ row }">
          ¥{{ row.price }}
        </template>
      </el-table-column>

      <el-table-column prop="stock" label="库存" width="80" />

      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button
            v-if="row.status !== 'sold_out'"
            type="primary"
            size="small"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="row.status === 'available'"
            type="warning"
            size="small"
            @click="handleProductStatus(row, 'off_shelf')"
          >
            下架
          </el-button>
          <el-button
            v-if="row.status === 'off_shelf'"
            type="success"
            size="small"
            @click="handleProductStatus(row, 'available')"
          >
            上架
          </el-button>
          <el-button
            v-if="row.status !== 'shipping'"
            type="danger"
            size="small"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
          <el-tag
            v-if="row.status === 'sold_out'"
            type="info"
            size="small"
            effect="plain"
          >
            已售罄不可编辑
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑商品"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="商品价格" prop="price">
          <el-input-number
            v-model="editForm.price"
            :min="0.01"
            :precision="2"
            :step="0.01"
          />
        </el-form-item>
        <el-form-item label="库存数量" prop="stock">
          <el-input-number
            v-model="editForm.stock"
            :min="0"
            :precision="0"
            :step="1"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEdit">
            确认
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

const store = useStore()
const dialogVisible = ref(false)
const editFormRef = ref(null)
const editForm = ref({
  id: null,
  price: 0,
  stock: 0
})

// 表单验证规则
const rules = {
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '价格必须大于0', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存不能小于0', trigger: 'blur' }
  ]
}

// 获取我的商品列表
const myProducts = computed(() => store.getters.getCurrentUserProducts)

// 获取商品状态文本
const getStatusText = (status) => {
  const texts = {
    'available': '在售',
    'off_shelf': '已下架',
    'sold_out': '已售罄'
  }
  return texts[status] || status
}

// 获取状态标签样式
const getStatusType = (status) => {
  const types = {
    'available': 'success',
    'off_shelf': 'info',
    'sold_out': 'warning'
  }
  return types[status] || 'info'
}

// 处理编辑
const handleEdit = (product) => {
  editForm.value = {
    id: product.id,
    price: product.price,
    stock: product.stock
  }
  dialogVisible.value = true
}

// 提交编辑
const submitEdit = async () => {
  if (!editFormRef.value) return

  await editFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await store.dispatch('updateProduct', {
          id: editForm.value.id,
          price: editForm.value.price,
          stock: editForm.value.stock
        })
        ElMessage.success('更新成功')
        dialogVisible.value = false
      } catch {
        ElMessage.error('更新失败')
      }
    }
  })
}

// 处理商品状态
const handleProductStatus = async (product, status) => {
  try {
    const action = status === 'off_shelf' ? '下架' : '上架'
    await ElMessageBox.confirm(`确认${action}此商品？`, '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await store.dispatch('updateProductStatus', {
      productId: product.id,
      status: status
    })
    ElMessage.success(`商品已${action}`)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败，请重试')
    }
  }
}

// 处理删除
const handleDelete = async (product) => {
  try {
    await ElMessageBox.confirm('确认删除此商品？此操作不可恢复', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await store.dispatch('deleteProduct', product.id)
    ElMessage.success('商品已删除')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败，请重试')
    }
  }
}
</script>

<style scoped>
.user-products {
  height: 100%;
  overflow: auto;
}

.products-table {
  height: 100%;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
}

.el-button {
  margin-left: 8px;
}

.el-button:first-child {
  margin-left: 0;
}

:deep(.el-tag.el-tag--plain) {
  border-style: dashed;
  margin-left: 8px;
}
</style>
