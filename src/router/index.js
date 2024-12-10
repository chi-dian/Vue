// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import adClazzify from '@/view/admin/adClazzify.vue'; // 确保路径正确
import adLogin from '@/view/admin/adLogin.vue'
import userLogin  from '@/view/user/userLogin.vue';
import userInfo from '@/view/user/userInfo.vue';
// import userProfile from '@/view/user/userProfile.vue';

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
  },{
    path:'/userInfo',
    name:'userInfo',
    component:userInfo,
   },
  //  {
  //   path:'/userProfile',
  //   name:'userProfile',
  //   component:userProfile,
  // },
  // ...其他路由
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 使用 import.meta.env
  routes,
});

export default router;
