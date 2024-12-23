<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>用户管理</span>
      </div>
    </template>
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="id" label="用户ID" width="180"></el-table-column>
      <el-table-column prop="nickName" label="昵称"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'danger'">{{ row.status === 'active' ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button-group>
            <el-button size="small" @click="changeUserStatus(row.id, row.status === 'active' ? 'inactive' : 'active')">
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';
import { loadUserInfo, changeStatus } from '@/api/user'; // 确保路径正确

const userList = ref([]);

const fetchUsers = async () => {
  try {
    const response = await loadUserInfo(1, 10, 'name', 'asc');
    userList.value = response.data;
  } catch (error) {
    console.error('Failed to load users:', error);
  }
};

const changeUserStatus = async (userId, newStatus) => {
  try {
    await changeStatus(userId, newStatus);
    fetchUsers(); // 重新加载用户列表以更新状态
  } catch (error) {
    console.error('Failed to change user status:', error);
  }
};


</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
