<template>
  <div class="user-info">
    <h1>用户信息</h1>
    <div v-if="userInfo">
      <p><strong>ID:</strong> {{ userInfo.userId }}</p>
      <p><strong>用户名:</strong> {{ userInfo.nickName }}</p>
      <p><strong>性别:</strong> {{ userInfo.sex }}</p>
      <p><strong>头像:</strong> <img :src="userInfo.avatar" alt="用户头像" /></p>
      <p><strong>生日:</strong> {{ userInfo.birthday }}</p>
      <p><strong>个人介绍:</strong> {{ userInfo.personIntroduction }}</p>
      <p><strong>通知信息:</strong> {{ userInfo.noticeInfo }}</p>
    </div>
    <div v-else>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script>
import { obUserInfo } from '@/api/user'; // 假设你的API函数在api/user.js文件中

export default {
  name: 'UserInfo',
  data() {
    return {
      userInfo: null,
    };
  },
  created() {
    this.fetchUserInfo();
  },
  methods: {
    async fetchUserInfo() {
      try {
        const data = await obUserInfo();
        this.userInfo = data;
      } catch (error) {
        console.error('获取用户信息失败:', error);
        // 这里可以处理错误，比如设置一个错误消息的状态
      }
    },
  },
};
</script>

<style scoped>
.user-info {
  /* 样式根据需要进行调整 */
  margin: 20px;
}

.user-info img {
  max-width: 100px;
  border-radius: 50%;
}
</style>