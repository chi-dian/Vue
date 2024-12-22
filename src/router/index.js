// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import adClazzify from '@/view/admin/adClazzify.vue'; // 确保路径正确
import adLogin from '@/view/admin/adLogin.vue'
import userLogin  from '@/view/user/userLogin.vue';
import userInfo from '@/view/user/userInfo.vue';
import UserRegister from '@/view/user/userRegister.vue';
import LoginForm from '@/view/user/LoginForm.vue';
import IndexForm from '@/view/user/IndexForm.vue';
import ProductDetails from '@/components/ProductDetails.vue';
import UserCart from '@/view/user/UserCart.vue';
import adminApp from '@/view/admin/adminApp.vue';
import userManagement from '@/view/admin/userManagement.vue';
import productManagemnet from '@/view/admin/productManagemnet.vue';
import brandManagement from '@/view/admin/brandManagement.vue';
import categoryManager from '@/view/admin/categoryManager.vue';
// 定义路由
const routes = [
  {
    path:'/',
    redirect:'/index'
  },
  {
    path:'/index',
    component:IndexForm
  },
  {
    path: '/test',
    component: adClazzify,
    hidden: true
  },
  {
    path:'/adLogin',
    name:'adLogin',
    component:adLogin
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
  {
    path:'/Register',
    component:UserRegister
  },
  {
    path:'/login',
    component:LoginForm
  },
  {
    path: '/detail/:productId',
    name: 'detail',
    component:ProductDetails
  },
  {
    path:'/cart',
    component:UserCart
  },
  {
    path:'/admin',
    name:'admin',
    component:adminApp,
    children:[
      {
        path:'',
        component:userManagement
      },
      {
        path: 'users',
        component: userManagement
      },
      {
        path: 'products',
        component: productManagemnet
      },
      {
        path: 'brands',
        component: brandManagement
      },
      {
        path: 'category',
        name: 'category',
        component:categoryManager
      }
    ]
  },


  // ...其他路由
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 使用 import.meta.env
  routes,
});

export default router;
