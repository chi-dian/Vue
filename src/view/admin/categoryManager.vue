<template>
  <div>
    <el-button type="primary" @click="openAddCategoryDialog">添加分类</el-button>

    <el-table :data="categories" style="width: 100%">
      <el-table-column prop="categoryId" label="分类ID"></el-table-column>
      <el-table-column prop="categoryName" label="分类名称"></el-table-column>
      <el-table-column prop="icon" label="图标"></el-table-column>
      <el-table-column prop="background" label="背景图"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="deleteCategory(row.categoryId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加分类" v-model:visible="addCategoryDialogVisible">
      <el-form :model="newCategory" ref="categoryForm" :rules="rules">
        <el-form-item label="父分类ID" prop="pCategoryId">
          <el-input v-model="newCategory.pCategoryId"></el-input>
        </el-form-item>
        <el-form-item label="分类代码" prop="categoryCode">
          <el-input v-model="newCategory.categoryCode"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="newCategory.categoryName"></el-input>
        </el-form-item>
        <el-form-item label="分类图标" prop="icon">
          <el-input v-model="newCategory.icon"></el-input>
        </el-form-item>
        <el-form-item label="分类背景图" prop="background">
          <el-input v-model="newCategory.background"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addCategoryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ElDialog, ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput } from 'element-plus';
import { addClazz, delClazz, showClazz } from '@/api/classify'; // 确保路径正确

export default {
  name: 'CategoryManager',
  components: {
    ElDialog,
    ElTable,
    ElTableColumn,
    ElButton,
    ElForm,
    ElFormItem,
    ElInput
  },
  setup() {
    const categories = ref([]);
    const addCategoryDialogVisible = ref(false);
    const newCategory = ref({
      pCategoryId: '',
      categoryCode: '',
      categoryName: '',
      categoryId: '',
      icon: '',
      background: '',
      adminToken: 'yourAdminToken' // 替换为你的管理员令牌
    });
    const categoryForm = ref(null);

    const rules = {
      pCategoryId: [
        { required: true, message: '请输入父分类ID', trigger: 'blur' }
      ],
      categoryCode: [
        { required: true, message: '请输入分类代码', trigger: 'blur' }
      ],
      categoryName: [
        { required: true, message: '请输入分类名称', trigger: 'blur' }
      ]
    };

    const fetchCategories = async () => {
      try {
        const result = await showClazz('1'); // 假设我们从第一页开始加载
        categories.value = result;
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    const openAddCategoryDialog = () => {
      addCategoryDialogVisible.value = true;
    };

    const submitForm = () => {
      categoryForm.value.validate((valid) => {
        if (valid) {
          addCategory();
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    };

    const addCategory = async () => {
      try {
        await addClazz(
          newCategory.value.pCategoryId,
          newCategory.value.categoryCode,
          newCategory.value.categoryName,
          newCategory.value.categoryId,
          newCategory.value.icon,
          newCategory.value.background,
          newCategory.value.adminToken
        );
        fetchCategories(); // 重新加载分类列表
        addCategoryDialogVisible.value = false;
      } catch (error) {
        console.error('Failed to add category:', error);
      }
    };

    const deleteCategory = async (categoryId) => {
      try {
        await delClazz(categoryId, newCategory.value.adminToken);
        fetchCategories(); // 重新加载分类列表
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    };

    fetchCategories;

    return {
      categories,
      addCategoryDialogVisible,
      newCategory,
      categoryForm,
      rules,
      openAddCategoryDialog,
      submitForm,
      addCategory,
      deleteCategory
    };
  }
};
</script>

<style>
/* 添加一些样式 */
</style>
