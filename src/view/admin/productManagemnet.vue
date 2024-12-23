<template>
  <div>
    <el-button type="primary" @click="openRecommendDialog">推荐商品</el-button>

    <el-table :data="products" style="width: 100%">
      <el-table-column prop="productId" label="商品ID"></el-table-column>
      <el-table-column prop="productName" label="商品名称"></el-table-column>
      <el-table-column prop="productCover" label="商品封面图"></el-table-column>
      <el-table-column label="推荐状态">
        <template #default="{ row }">
          <el-tag v-if="row.recommended" type="success">已推荐</el-tag>
          <el-tag v-else type="info">未推荐</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="toggleRecommend(row)">
            {{ row.recommended ? '取消推荐' : '推荐' }}
          </el-button>
          <el-button type="text" size="small" @click="auditProduct(row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="推荐商品" v-model:visible="recommendDialogVisible">
      <el-form :model="recommendForm">
        <el-form-item label="商品ID">
          <el-input v-model="recommendForm.productId"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="recommendDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="recommendProduct">确定推荐</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import {
  ElButton,
  ElTable,
  ElTableColumn,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElTag
} from 'element-plus';
import {
  getList,
  auditGoods,
  // 假设您有推荐和取消推荐的API函数，如果没有，您需要实现它们
   recommendGoods,
   unrecommendGoods
} from '@/api/goodsControl'; // 确保路径正确

export default {
  components: {
    ElButton,
    ElTable,
    ElTableColumn,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElTag
  },
  setup() {
    const products = ref([]);
    const recommendDialogVisible = ref(false);
    const recommendForm = ref({
      productId: ''
    });

    const fetchProducts = async () => {
      try {
        const result = await getList('1'); // 假设我们从第一页开始加载
        products.value = result;
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };

    const openRecommendDialog = () => {
      recommendDialogVisible.value = true;
    };

    const recommendProduct = async () => {
      try {
        // 假设您有推荐商品的API函数
         await recommendGoods(recommendForm.value.productId);
        recommendDialogVisible.value = false;
      } catch (error) {
        console.error('Failed to recommend product:', error);
      }
    };

    const toggleRecommend = async (product) => {
      // 假设您有取消推荐商品的API函数
      if (product.recommended) {
        await unrecommendGoods(product.productId);
      } else {
        await recommendGoods(product.productId);
      }
      fetchProducts(); // 重新加载商品列表
    };

    const auditProduct = async (product) => {
      try {
        await auditGoods(product.productId, 'approved'); // 假设审核状态为approved
        fetchProducts(); // 重新加载商品列表
      } catch (error) {
        console.error('Failed to audit product:', error);
      }
    };

    fetchProducts;

    return {
      products,
      recommendDialogVisible,
      recommendForm,
      fetchProducts,
      openRecommendDialog,
      recommendProduct,
      toggleRecommend,
      auditProduct
    };
  }
};
</script>

<style>
/* 添加一些样式 */
</style>
