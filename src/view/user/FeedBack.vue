<template>
  <div class="container mx-auto mt-8">
    <div class="card-container">
      <div class="card">
        <h2 class="text-2xl mb-4">问题反馈</h2>
        <el-form @submit.prevent="submitFeedback">
          <el-form-item label="问题类型">
            <el-select v-model="feedbackType">
              <el-option label="Bug报告" value="bug"></el-option>
              <el-option label="功能建议" value="feature"></el-option>
              <el-option label="其他问题" value="other"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="反馈内容">
            <el-input type="textarea" v-model="feedbackText"></el-input>
          </el-form-item>

          <el-form-item label="联系方式">
            <el-input v-model="contact" placeholder="请输入邮箱或手机号"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" native-type="submit">提交反馈</el-button>
          </el-form-item>
        </el-form>

        <el-button @click="contactSupport" class="mt-4">联系客服</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { showModel,showMessage } from '@/utils/util';
import { useRouter } from 'vue-router'
const router = useRouter()

const feedbackType = ref('bug');
const feedbackText = ref('');
const contact = ref('');

const submitFeedback = () => {
  console.log('提交反馈:', {
    type: feedbackType.value,
    text: feedbackText.value,
    contact: contact.value,
  });
  feedbackType.value = 'bug';
  feedbackText.value = '';
  contact.value = '';
  showMessage("提交反馈成功！谢谢您的支持")
 router.push('/index');
};

const contactSupport = () => {
  showModel('请拨打客服电话:xxxxxxxx');
};
</script>

<style scoped>
.card-container {
  width: 80%;
  margin: 0 auto;
}

.card {
  background: white;
  padding: 20px;
  border: 1px solid #ffffff; /* 可以调整为其他颜色 */
  box-shadow: none; /* 去除阴影效果 */
}
</style>
