<template>
  <div>
    <!-- 添加和修改品牌表单 -->
    <el-form ref="brandForm" :model="brandForm" label-width="120px">
      <el-form-item label="品牌ID">
        <el-input v-model="brandForm.brandId"></el-input>
      </el-form-item>
      <el-form-item label="品牌名称">
        <el-input v-model="brandForm.brandName"></el-input>
      </el-form-item>
      <el-form-item label="品牌描述">
        <el-input v-model="brandForm.brandDesc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveBrand">保存品牌</el-button>
      </el-form-item>
    </el-form>

    <!-- 品牌列表 -->
    <el-table :data="brandList" style="width: 100%">
      <el-table-column prop="brandId" label="品牌ID"></el-table-column>
      <el-table-column prop="brandName" label="品牌名称"></el-table-column>
      <el-table-column prop="brandDesc" label="品牌描述"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="deleteBrand(row.brandId)">删除</el-button>
          <el-button type="text" size="small" @click="editBrand(row)">编辑</el-button>
          <el-button type="text" size="small" @click="getBrandInfo(row.brandId)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 查看品牌详情对话框 -->
    <el-dialog title="品牌详情" v-model:visible="dialogVisible">
      <pre>{{ selectedBrandInfo }}</pre>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElTable, ElTableColumn, ElDialog } from 'element-plus';
import { addBrand, delBrand, getBrandList, getBrandInfoById } from '@/api/brandControl'; // 确保路径正确

export default {
  name: 'BrandManagement',
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElTable,
    ElTableColumn,
    ElDialog
  },
  setup() {
    const brandForm = reactive({
      brandId: '',
      brandName: '',
      brandDesc: ''
    });
    const brandList = ref([]);
    const dialogVisible = ref(false);
    const selectedBrandInfo = ref('');
    const adminToken = ref('yourAdminToken'); // 替换为你的管理员令牌

    const saveBrand = async () => {
      try {
        await addBrand(brandForm.brandId, brandForm.brandDesc, brandForm.brandName, adminToken.value);
        await getBrandList(); // 重新加载品牌列表
      } catch (error) {
        console.error('Failed to save brand:', error);
      }
    };

    const deleteBrand = async (brandId) => {
      try {
        await delBrand(brandId, adminToken.value);
        await getBrandList(); // 重新加载品牌列表

      } catch (error) {
        console.error('Failed to delete brand:', error);
      }
    };

    const editBrand = (brand) => {
      brandForm.brandId = brand.brandId;
      brandForm.brandName = brand.brandName;
      brandForm.brandDesc = brand.brandDesc;
      // 可以在这里打开一个模态框或者激活表单以便编辑
    };

    const getBrandInfo = async (brandId) => {
      try {
        const brandInfo = await getBrandInfoById(brandId);
        selectedBrandInfo.value = JSON.stringify(brandInfo, null, 2);
        dialogVisible.value = true;
      } catch (error) {
        console.error('Failed to get brand info:', error);
      }
    };

    // const fetchBrandList = async () => {
    //   try {
    //     const result = await getBrandList();
    //     brandList.value = result;
    //   } catch (error) {
    //     console.error('Failed to load brand list:', error);
    //   }
    // };

    // fetchBrandList(); // 初始化时获取品牌列表



    return {
      brandForm,
      brandList,
      dialogVisible,
      selectedBrandInfo,
      saveBrand,
      deleteBrand,
      editBrand,
      getBrandInfo
    };
  }
};
</script>

<style>
/* 添加一些样式 */
</style>
