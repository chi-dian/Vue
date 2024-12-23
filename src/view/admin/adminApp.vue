<template>
  <el-container>
    <el-aside width="200px">
      <el-menu default-active="/users" unique-opened>
        <el-submenu index="/manage">
          <template #title>
            <i class="el-icon-menu"></i>
            <span>管理</span>
          </template>
          <el-menu-item index="/users">
            <router-link to="/admin/users">用户管理</router-link>
          </el-menu-item>
          <el-menu-item index="/products">
            <router-link to="/admin/products">商品管理</router-link>
          </el-menu-item>
          <el-menu-item index="/brands">
            <router-link to="/admin/brands">品牌管理</router-link>
          </el-menu-item>
          <el-menu-item index="/category">
            <router-link to="/admin/category">分类管理</router-link>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header></el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'AdminLayout',
};
</script>

<style>
/* 样式 */
</style>
