// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import adClazzify from '@/view/admin/adClazzify.vue'; // 确保路径正确
import adLogin from '@/view/admin/adLogin.vue'
import userLogin  from '@/view/user/userLogin.vue';

// 定义路由
const routes = [
  {
    path: '/test',
    component: adClazzify,
    hidden: true,
  },
  {
    path:'/adLogin',
    name:'adLogin',
    component:adLogin,
  },
  {
    path:'/userLogin',
    name:'userLogin',
    component:userLogin
  },
  // ...其他路由
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 使用 import.meta.env
  routes,
});

export default router;
