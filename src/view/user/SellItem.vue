<template>
  <div class="p-4 flex justify-center items-center w-full">
    <div class="mx-auto w-full max-w-3xl">
      <div class="flex justify-center items-center">
        <p class="font-bold text-blue-800 latest-release">发布商品</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        @submit.prevent="handleSubmit"
      >
      <el-form-item label="商品图片" prop="images">
    <el-upload
    v-model:file-list="fileList"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="9"
            :on-change="handleImageChange"
            :on-remove="handleImageRemove"
            accept="image/*"
    >
      <template #default>
        <el-icon><Plus/></el-icon>
        <div class="text-gray-500 text-sm">上传图片</div>
      </template>
      <template #file="{ file }">
        <img :src="file.url" class="h-40 w-40 object-cover" />
      </template>
    </el-upload>
    <div class="text-gray-500 text-xs mt-2">
      最多上传9张图片，建议尺寸800x800px，大小不超过2MB
    </div>
        </el-form-item>

        <!-- 商品名称 -->
        <el-form-item label="商品名称" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入商品名称（2-30个字符）"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
      <!-- 商品分类 -->
        <el-form-item label="商品分类" prop="category">
    <el-select
      v-model="form.category"
      placeholder="请选择商品分类"
      style="width: 100%"
    >
    <!-- 分类 -->
    <!-- <el-option
              v-for="category in categories"
              :key="category"
              :label="category"
              :value="category"
            /> -->
      <el-option
        v-for="category in filteredCategories"
        :key="category.value"
        :label="category.label"
        :value="category.value"
      />
    </el-select>
  </el-form-item>


        <!-- 商品品牌 -->
        <el-form-item label="商品品牌">
          <el-input
            v-model="form.brand"
            placeholder="请输入商品品牌（选填）"
          />
        </el-form-item>

        <!-- 商品价格 -->
        <el-form-item label="商品价格" prop="price">
          <el-input-number
            v-model="form.price"
            :min="0"
            :precision="2"
            :step="0.01"
            style="width: 100%"
          />
        </el-form-item>

        <!-- 商品库存 -->
        <el-form-item label="商品库存" prop="stock">
          <el-input-number
            v-model="form.stock"
            :min="1"
            :precision="0"
            :step="1"
            style="width: 100%"
            placeholder="请输入商品库存数量"
          />
        </el-form-item>

        <!-- 商品详情 -->
        <el-form-item label="商品详情" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="6"
            placeholder="请详细描述商品的成色、使用年限、配件等信息"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <button type="submit"
          :loading ="loading"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">发布商品</button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted,computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter} from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus} from '@element-plus/icons-vue'
import showClazz from '@/api/classify'; // 确保路径正确
// import { uploadIm } from '@/api/fileControl';
const formRef = ref(null)
const fileList = ref([])
const store = useStore()
const router = useRouter()
const loading = ref(false)
// const uploadUrl = 'http://localhost:7071/work/file/uploadImage';
// 商品分类列表
const categories = ref([]);
// const uploadHeaders = ref({});
// const token = '';
// 表单数据
const form = reactive({
  title: '',
  category:null,
  brand: '',
  price: 0,
  stock: 1,
  description: '',
  images: []
})
// 过滤器：确保返回的值不为undefined,以及value为整型
const filteredCategories = computed(() => {
  return categories.value
    .filter(category => category.categoryName !== undefined && category.categoryId !== undefined)
    .map(category => ({
      label: category.categoryName,
      value: Number(category.categoryId) // 确保 value 是数字类型
    }));
});

onMounted(async () => {
  try {
    const data = await showClazz('1');
    if (data.status === 'success' && data.data && data.data.list) {
      categories.value = data.data.list;
    } else {
      ElMessage.error(data.info);
    }
  } catch (error) {
    ElMessage.error('获取分类信息失败');
    console.error(error);
  }
});


// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    {
      type: 'number',
      min: 0.01,
      message: '价格必须大于0',
      trigger: 'blur'
    }
  ],
  stock: [
    { required: true, message: '请输入商品库存', trigger: 'blur' },
    { type: 'number', min: 1, message: '库存必须大于0', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入商品详情', trigger: 'blur' },
    { min: 10, max: 1000, message: '长度在 10 到 1000 个字符', trigger: 'blur' }
  ],
  images: [
    {
      required: true,
      message: '请上传至少一张商品图片',
      trigger: 'change',
      validator: (rule, value, callback) => {
        if (fileList.value.length === 0) {
          callback(new Error('请上传至少一张商品图片'))
        } else {
          callback()
        }
      }
    }
  ]
}



// 处理图片上传
const handleImageChange = (uploadFile) => {
  // 检查文件大小
  if (uploadFile.size > 2 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过2MB')
    return false
  }

  // 检查文件类型
  if (!['image/jpeg', 'image/png', 'image/gif'].includes(uploadFile.raw.type)) {
    ElMessage.warning('只能上传JPG/PNG/GIF格式的图片')
    return false
  }

  // 将图片转换为base64
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64 = e.target.result
    uploadFile.url = base64 // 设置预览URL
    form.images.push(base64) // 保存base64数据
  }
  reader.readAsDataURL(uploadFile.raw)
}

// 处理图片移除
const handleImageRemove = (uploadFile) => {
  const index = form.images.indexOf(uploadFile.url)
  if (index > -1) {
    form.images.splice(index, 1)
  }
}


// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await store.dispatch('addProduct', {
          title: form.title,
          category: form.category,
          brand: form.brand || null,
          price: form.price,
          stock: form.stock,
          description: form.description,
          images: form.images
        })

        ElMessage.success('商品发布成功')
        router.push('/user/products')
      } catch(error){
        ElMessage.error('发布失败，请重试')
        console.error(error);
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

