<template>
  <div class="user-profile">
    <el-card>
      <template #header>
        <div class="clearfix">
          <span>用户信息</span>
          <el-button style="float: right;" type="primary" @click="dialogFormVisible = true">编辑信息</el-button>
        </div>
      </template>
      <el-form label-position="left" label-width="100px">
        <el-form-item label="用户ID">
          {{ userInfo.id }}
        </el-form-item>
        <el-form-item label="昵称">
          {{ userInfo.nickName }}
        </el-form-item>
        <el-form-item label="性别">
          {{ userInfo.sex ? '男' : '女' }}
        </el-form-item>
        <el-form-item label="头像">
          <img :src="imageUrl" alt="用户头像" style="cursor: pointer;">
        </el-form-item>
        <el-form-item label="生日">
          {{ userInfo.birthday }}
        </el-form-item>
        <el-form-item label="个人简介">
          {{ userInfo.personIntroduction }}
        </el-form-item>
        <el-form-item label="通知信息">
          {{ userInfo.noticeInfo }}
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog :model-value="dialogFormVisible" @update:model-value="dialogFormVisible = $event" title="编辑用户信息">
      <el-form :model="form">
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="form.nickName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像" :label-width="formLabelWidth">
          <el-upload
            :auto-upload="false"
            action="/work/admin/file/uploadImage"
            :on-change="handleAvatarChange"
            :http-request="uploadFile"
          >
          <!-- <el-button size="small" type="primary">选择文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="handleUpload">上传到服务器</el-button> -->
            <i v-if="!form.avatar" class="el-icon-plus"></i>
            <img v-if="form.avatar" :src="form.avatar" alt="avatar" class="avatar" />
          </el-upload>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio-group v-model="form.sex">
            <el-radio :value="1">男</el-radio>
            <el-radio :value="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日" :label-width="formLabelWidth">
          <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="个人简介" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            v-model="form.personIntroduction"
            autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="通知信息" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            v-model="form.noticeInfo"
            autocomplete="off">
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateUserInfo">更新</el-button>
        </div>
      </template>
    </el-dialog>
    <el-button type="danger" @click="handleLogOut">退出登录</el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  ElButton,
  ElCard,
  ElDialog,
  ElFormItem,
  ElForm,
  ElUpload,
  ElRadioGroup,
  ElRadio,
  ElDatePicker,
  ElMessage,
  ElInput
} from 'element-plus';
import { obUserInfo, updateUser, logOut } from '@/api/user';
import { userUpLoad, readRes } from '@/api/fileControl';

const formLabelWidth = ref('120px');
const dialogFormVisible = ref(false);
const userInfo = ref({});
const form = ref({
  nickName: '',
  avatar: '',
  sex: 1,
  birthday: '',
  personIntroduction: '',
  noticeInfo: ''
});
const imageUrl = ref('');


const fetchUserInfo = async () => {
  try {
    const response = await obUserInfo();
    if (response.status === 'success' && response.code === 200) {
      userInfo.value = response.data;
      form.value = { ...form.value, ...response.data };
      await fetchAvatar();
    } else {
      throw new Error(response.info);
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    ElMessage.error('Failed to fetch user data');
  }
};

const fetchAvatar = async () => {
  try {
    const response = await readRes(userInfo.value.avatar);
    if (response && response.data) {
      const base64Data = response.data.replace(/^data:img\/(png|jpeg|jpg);base64,/, '');
      imageUrl.value = `data:image/png;base64,${base64Data}`;
    } else {
      console.error('Failed to fetch image: Response data is null or undefined');
      ElMessage.error('Failed to fetch image');
      imageUrl.value = 'default-avatar.png'; // 假设你有一个默认的头像图片
    }
  } catch (error) {
    console.error('Failed to fetch image:', error);
    ElMessage.error('Failed to fetch image');
    imageUrl.value = 'default-avatar.png'; // 同样，设置一个默认的图片 URL
  }
};

const handleAvatarChange = (file) => {
  if (file) {
    userUpLoad(file.raw).then(response => {
      if (response.status === 'success') {
        userInfo.value.avatar = response.data;
        form.value.avatar = response.data;
        console.log(response.data);

        ElMessage.success('头像上传成功');
      } else {
        ElMessage.error('头像上传失败');
      }
    }).catch(error => {
      ElMessage.error('头像上传失败: ' + error);
    });
    console.log(userInfo.value.avatar);

  }
};

const uploadFile = async (file) => {
  try {
  //   const response = await userUpLoad(file);
  //   if (response && response.status === 'success') {
  //     form.value.avatar = response.data; // 更新 form 中的 avatar 值
  //     userInfo.value.avatar = response.data
  //     // imageUrl.value = form.value.avatar; // 更新显示的头像 URL
  //     ElMessage.success('头像上传成功');
  //   } else {
  //     ElMessage.error('头像上传失败');
  //   }

    userUpLoad(file)
      .then(data => {
        form.value.avatar=data;
        userInfo.value.avatar=form.value.avatar;
        console.log('文件上传成功，服务器返回数据：',data);
      })

  } catch (error) {
    ElMessage.error('头像上传失败: ' + error);
  }
};

const handleUpdateUserInfo = async () => {
  console.log(form.value.avatar);

  try {
    await updateUser(
      form.value.nickName,
      form.value.avatar,
      form.value.sex.toString(),
      form.value.birthday,
      '',
      form.value.personIntroduction,
      form.value.noticeInfo
    );
    fetchUserInfo(); // Refresh user info
    dialogFormVisible.value = false;
    ElMessage.success('用户信息更新成功');
  } catch (error) {
    console.error('Failed to update user info:', error);
    ElMessage.error('Failed to update user info: ' + error);
  }
};

const handleLogOut = async () => {
  try {
    await logOut();
    ElMessage.success('您已退出登录');
    // Handle logout success, e.g., navigate to login page
  } catch (error) {
    console.error('Failed to log out:', error);
    ElMessage.error('Failed to log out: ' + error);
  }
};

// Fetch user info when component is mounted
onMounted(fetchUserInfo);
</script>


<style scoped>
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
