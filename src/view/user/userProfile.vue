<!-- <template>
  <el-container>
    <el-header>
      <el-button type="primary" @click="logout">退出登录</el-button>
    </el-header>
    <el-main>
      <el-form ref="form" :model="user" label-width="100px">
        <el-form-item label="用户ID">
          <el-input v-model="user.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="user.nickName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="user.sex" placeholder="请选择性别">
            <el-option label="男" value="male"></el-option>
            <el-option label="女" value="female"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户头像">
          <el-upload
            class="avatar-uploader"
            action="/work/admin/file/uploadImage"
            :headers="{'token': user.token}"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="user.avatar" :src="user.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户简介">
          <el-input
            type="textarea"
            v-model="user.personIntroduction">
          </el-input>
        </el-form-item>
        <el-form-item label="通知信息">
          <el-input
            type="textarea"
            v-model="user.noticeInfo">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateUserInfo">更新信息</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import { ref } from 'vue';
import { obUserInfo, updateUser, quitLogin } from '@/api/user.js';
import { uploadIm } from '@/api/fileControl.js';

export default {
  setup() {
    const user = ref({
      id: '',
      nickName: '',
      sex: '',
      avatar: '',
      personIntroduction: '',
      noticeInfo: '',
      token: '' // 假设用户登录后会获取到token
    });

    const fetchUserInfo = async () => {
      try {
        const response = await obUserInfo();
        user.value = response.data;
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    const updateUserInfo = async () => {
      try {
        const response = await updateUser(
          user.value.nickName,
          user.value.avatar,
          user.value.sex,
          '',
          '',
          user.value.personIntroduction,
          user.value.noticeInfo
        );
        console.log('User info updated:', response.data);
      } catch (error) {
        console.error('Failed to update user info:', error);
      }
    };

    const logout = async () => {
      try {
        await quitLogin();
        console.log('Logged out successfully');
        // 重定向到登录页面或清空用户信息
      } catch (error) {
        console.error('Failed to logout:', error);
      }
    };

    const handleAvatarSuccess = (response) => {
      user.value.avatar = response.data.url;
    };

    const beforeAvatarUpload = (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return uploadIm(file, user.value.token).then((response) => {
        console.log('Avatar uploaded:', response.data);
      }).catch((error) => {
        console.error('Failed to upload avatar:', error);
      });
    };

    fetchUserInfo();

    return {
      user,
      updateUserInfo,
      logout,
      handleAvatarSuccess,
      beforeAvatarUpload
    };
  }
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  min-width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style> -->
