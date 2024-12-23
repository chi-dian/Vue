<template>
  <div class="user-profile">
    <el-card>
      <template v-slot:header>
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
          <img :src="userInfo.avatar" alt="avatar" class="avatar">
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
          <el-input v-model="form.avatar" autocomplete="off"></el-input>
          <input type="file" @change="handleAvatarChange" />
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio-group v-model="form.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日" :label-width="formLabelWidth">
          <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="个人简介" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.personIntroduction" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="通知信息" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.noticeInfo" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
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
import { ref } from 'vue';
import { obUserInfo, logOut, updateUser } from '@/api/user';
import { uploadIm } from '@/api/fileControl'; // 确保路径正确

const formLabelWidth = '120px';
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

const fetchUserInfo = async () => {
  try {
    const response = await obUserInfo();
    if (response.status === 'success' && response.code === 200) {
      userInfo.value = response.data;
      form.value = { ...form.value, ...response.data };
    } else {
      throw new Error(response.info);
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
};

const handleAvatarChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const result = await uploadIm(file);
      if (result && result.url) {
        form.value.avatar = result.url; // 更新头像URL
        userInfo.value.avatar = result.url; // 立即显示新头像
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    }
  }
};

const handleUpdateUserInfo = async () => {
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
  } catch (error) {
    console.error('Failed to update user info:', error);
  }
};

const handleLogOut = async () => {
  try {
    await logOut();
    // Handle logout success, e.g., navigate to login page
  } catch (error) {
    console.error('Failed to log out:', error);
  }
};

fetchUserInfo();
</script>

<style scoped>
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
