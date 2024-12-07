<template>
  <div class="common-layout">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>
          <!-- 添加分类表单 -->
          <el-form ref="addCategoryForm" :model="addCategoryForm" label-width="120px">
            <el-form-item label="父类别ID">
              <el-input v-model="addCategoryForm.pCategoryId"></el-input>
            </el-form-item>
            <el-form-item label="类别代码">
              <el-input v-model="addCategoryForm.categoryCode"></el-input>
            </el-form-item>
            <el-form-item label="类别名称">
              <el-input v-model="addCategoryForm.categoryName"></el-input>
            </el-form-item>
            <el-form-item label="类别ID">
              <el-input v-model="addCategoryForm.categoryId"></el-input>
            </el-form-item>
            <el-form-item label="类别图标">
              <el-input v-model="addCategoryForm.icon"></el-input>
            </el-form-item>
            <el-form-item label="类别背景图">
              <el-input v-model="addCategoryForm.background"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addCategory">添加分类</el-button>
            </el-form-item>
          </el-form>

          <!-- 分类列表 -->
          <el-table :data="categories" style="width: 100%">
            <el-table-column prop="categoryId" label="类别ID" width="180"></el-table-column>
            <el-table-column prop="categoryName" label="类别名称"></el-table-column>
            <el-table-column prop="pCategoryId" label="父类别ID"></el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button type="text" size="small" @click="delCategory(row.categoryId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页和加载 -->
          <el-pagination
            @current-change="handlePageChange"
            :current-page="pageNo"
            :page-size="10"
            layout="total, prev, pager, next"
            :total="totalCategories">
          </el-pagination>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>

import { reactive, ref } from 'vue';
import { ElTable, ElTableColumn, ElForm, ElFormItem, ElInput, ElButton, ElPagination } from 'element-plus';
import { addClazz, delClazz, showClazz } from '@/api/classify'; // 确保路径正确

// 分类数据
const categories = ref([]);
const totalCategories = ref(0);
const pageNo = ref(1);
const addCategoryForm = reactive({
  pCategoryId: '',
  categoryCode: '',
  categoryName: '',
  categoryId: '',
  icon: '',
  background: ''
});

// 添加分类
const addCategory = () => {
  addClazz(
    addCategoryForm.pCategoryId,
    addCategoryForm.categoryCode,
    addCategoryForm.categoryName,
    addCategoryForm.categoryId,
    addCategoryForm.icon,
    addCategoryForm.background,
    'yourAdminToken' // 替换为你的管理员令牌
  )
  .then(() => {
    // 重置表单
    Object.assign(addCategoryForm, {
      pCategoryId: '',
      categoryCode: '',
      categoryName: '',
      categoryId: '',
      icon: '',
      background: ''
    });
    // 重新加载分类
    fetchCategories();
  })
  .catch(error => {
    console.error('添加分类失败:', error);
  });
};

// 删除分类
const delCategory = (categoryId) => {
  delClazz(categoryId, 'yourAdminToken') // 替换为你的管理员令牌
  .then(() => {
    // 重新加载分类
    fetchCategories();
  })
  .catch(error => {
    console.error('删除分类失败:', error);
  });
};

// 加载分类
const fetchCategories = () => {
  showClazz(pageNo.value, 'yourAdminToken') // 替换为你的管理员令牌
  .then(data => {
    categories.value = data.categories; // 假设响应数据中有categories字段
    totalCategories.value = data.total; // 假设响应数据中有total字段
  })
  .catch(error => {
    console.error('加载分类失败:', error);
  });
};

// 页码改变时重新加载分类
const handlePageChange = (newPageNo) => {
  pageNo.value = newPageNo;
  fetchCategories();
};

// 初始化加载分类
fetchCategories();
</script>
<!--
<style scoped>
.common-layout {
  /* 样式根据需要添加 */
}
</style> -->
