<template>
  <div class="user-profile">
    <div class="bg-white rounded-lg p-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold">个人信息</h3>
        <div>
          <button
            type="button"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            @click="handleEdit"
            v-if="!isEditing"
          >
            编辑资料
          </button>
          <div v-else>
            <button @click="cancelEdit" class="mr-2">取消</button>
            <button type="primary" @click="saveProfile" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              保存
            </button>
          </div>
        </div>
      </div>
<!-- 现在的用户和后端保存的用户信息 -->

      <div class="profile-content">
        <!-- 上半部分：头像和基本信息 -->
      <div class="profile-details">
        <div class="avatar-section">
          <el-upload
            v-if="isEditing"
            class="avatar-uploader"
             action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="handleAvatarUpload"
          >
          <!-- 编辑：表单头像  未编辑：当前用户头像 -->
            <img v-if="form.avatar" :src="form.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
            <img v-else :src="currentUser.avatar || defaultAvatar" class="avatar" />
          </div>

          <div class="basic-info flex-grow">
            <template v-if="isEditing">
              <el-form  ref="formRef" :model="form"  :rules="rules" label-width="0"   >
                <!-- ？？？ -->
                <el-form-item prop="username">
                  <el-input v-model="form.username" placeholder="用户昵称" />
                </el-form-item>
                <!-- 值来源数据库，用户字段未定义-->
                <el-form-item prop="personIntroduction">
                  <el-input v-model="form.personIntroduction" type="textarea" :rows="3" placeholder="介绍一下自己吧" />
                </el-form-item>
              </el-form>
            </template>
            <template v-else>
              <!-- 未编辑状态，获取值从数据库111 -->
              <h2 class="username text-xl font-semibold mb-5">用户昵称：{{ currentUser.username }}</h2>
              <p class="personIntroduction text-gray-500 mb-4">个人简介：{{ currentUser.personIntroduction || '这个人很懒，什么都没写~' }}</p>
            </template>
          </div>
        </div>
      </div>
        <!-- 下半部分：详细信息 -->
        <div class="p-4">
          <template v-if="isEditing">
            <el-form  ref="formRef" :model="form" :rules="rules" label-width="100px">
              <el-form-item label="用户ID:" prop="userId">
                <el-input v-model="form.id" />
              </el-form-item>
              <el-form-item label="邮箱：" prop="email">
                <el-input v-model="form.email" />
              </el-form-item>
              <el-form-item label="出生日期" prop="birthday">
                <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期" :disabled-date="disabledDate"/>
              </el-form-item>
          </el-form>
          </template>

          <template v-else>
            <div class="info-list space-y-4">
              <div class="info-item flex items-center justify-between">
                <span class="label text-right text-gray-500 pr-4">用户ID:</span>
                <span class="value">{{ currentUser.id || '未设置' }}</span>
              </div>

              <div class="info-item flex items-center justify-between">
                <span class="label text-right text-gray-500 pr-4">邮箱：</span>
                <span class="value">{{currentUser.email }}</span>
              </div>

              <div class="info-item flex items-center justify-between">
                <span class="label text-right text-gray-500 pr-4">出生日期：</span>
                <span class="value">{{ formatDate(currentUser.birthday) || '未设置' }}</span>
              </div>
            </div>
          </template>
<!-- 现在编辑的是表单  未编辑的是currentUser -->
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref,computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
// import { obUserInfo,updateUser } from '@/api/user'
import { ElMessage } from 'element-plus'
// import {uploadFile,readRes } from '@/api/fileControl';
import {useStore} from 'vuex'
const store = useStore()
const formRef = ref(null);
const isEditing = ref(false)
const defaultAvatar = 'src/assets/img/bg.jpg'
// const base64Image= ref('')
// const userData=ref({});
// 静态用户数据
const currentUser = computed(()=> store.state.currentUser)
// const currentUser = ref({})
// 表单数据
const form = ref({
  username: '',
  id: '',
  email: '',
  birthday: '',
  personIntroduction: '',
  avatar: ''
})
//表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  personIntroduction: [
    { max: 200, message: '个人简介不能超过200个字符', trigger: 'blur' }
  ]
}
const disabledDate = (time) => {
  return time.getTime() > Date.now()
}
// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}
// const fetchAvater = async()=>{
//   try {
//     const response = await readRes(userData.value.avatar);
//     if (response && response.data) {
//       const base64Data = response.data.replace(/^data:img\/(png|jpeg|jpg);base64,/, '');
//       base64Image.value = `data:image/png;base64,${base64Data}`;
//     } else {
//       console.error('Failed to fetch image: Response data is null or undefined');
//       ElMessage.error('Failed to fetch image');
//       base64Image.value = 'default-avatar.png'; // 假设你有一个默认的头像图片
//     }
//   } catch (error) {
//     console.error('Failed to fetch image:', error);
//     ElMessage.error('Failed to fetch image');
//     base64Image.value = 'default-avatar.png'; // 同样，设置一个默认的图片 URL
//   }
// }

// const fetchUserInfo = async () => {
//   try {
//     const response = await obUserInfo()
//     if (response.status === 'error') {
//       // 处理错误情况
//       if (response.code === 901) {
//         ElMessage.error('用户登录状态异常，请重新登录')
//         // 可能需要重定向到登录页面
//         // router.push('/login')
//       } else {
//         ElMessage.error(response.info)
//       }
//     } else {
//       // 将获取用户数据返回到userData中储存
//       userData.value= response.data//UserData的值等于数据库的值


//       currentUser.value = userData.value
//       form.value = { ...currentUser.value } // 转换性别文本
//       // base64Image.value=userData.avatar;
//     }
//   } catch (error) {
//     console.error('Failed to fetch user data:', error);
//   }
// };



// onMounted(async () => {
//   fetchUserInfo();
// })
// 开始编辑
const handleEdit = () => {
  form.value = {
    username: currentUser.value.username,
    id: currentUser.value.id || '',
    email:currentUser.value.email,
    birthday: currentUser.value.birthday ? new Date(currentUser.value.birthday) : '',
    personIntroduction: currentUser.value.personIntroduction || '',
    avatar: currentUser.value.avatar || ''
  }
  isEditing.value = true
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
  form.value = {}
}

// 保存资料
// const saveProfile = async () => {
//   try {
//     if (form.value.birthday instanceof Date) {
//       // 将日期对象转换为ISO 8601格式的字符串
//       form.value.birthday = form.value.birthday.toISOString().split('T')[0];}
//       const response = await updateUser(
//       form.value.nickName,
//       form.value.avatar,
//       form.value.email,
//       form.value.birthday,
//      '',
//       form.value.personIntroduction,
//       form.value.noticeInfo
//     )
//     // const base64Data = response.value.avatar.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
//     // avatarimg.value =  `data:image/png;base64,${base64Data}`;
//     if (response.status === 'success') {
//       ElMessage.success('个人资料更新成功')
//       // 更新currentUser数据
//       fetchUserInfo();
//       currentUser.value = { ...form.value }
//     } else {
//       ElMessage.error(response.info || '更新失败，请重试')
//     }
//   } catch{
//     ElMessage.error('更新失败，请重试')
//   }
// }

const saveProfile = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await store.dispatch('updateUserProfile', {
          ...form.value,
          id: currentUser.value.id
        })
        isEditing.value = false
        ElMessage.success('个人资料更新成功')
      } catch {
        ElMessage.error('更新失败，请重试')
      }
    }
  })
}

// 头像上传前的验证
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('头像必须是图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}

// 处理头像上传
const handleAvatarUpload = async (options) => {
  try {
    const file = options.file
    // 这里应该是调用后端API上传图片
    // 这里我们使用 FileReader 在前端预览
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      form.value.avatar = e.target.result
    }
  } catch{
    ElMessage.error('头像上传失败，请重试')
  }
}



// 性别显示文本

// 格式化日期

</script>
<style>
.profile-details {
  padding: 20px;
  border-top: 1px solid #ebeef5;
  display: flex;
  align-items: center; /* 垂直居中 */

}
.avatar-section {
  margin-right: 20px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.avatar-uploader {
  width: 120px;
  height: 120px;
  border: 2px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

</style>
