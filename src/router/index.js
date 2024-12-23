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
import FeedBack from '@/view/user/FeedBack.vue';
import SellItem from '@/view/user/SellItem.vue';
import CheckOut from '@/view/user/CheckOut.vue';
import ProductCategory from '@/view/user/ProductCategory.vue';
import UserCenter from '@/view/user/userCenter.vue';
import UserProducts from '../components/UserProducts.vue';
import UserOrders from '../components/UserOrders.vue';
import UserSales from '../components/UserSales.vue';
import UserProfile from '../components/UserProfile.vue';
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
    path: '/feedback',
    name:'feedback',
    component: FeedBack
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
    path: '/product/:id',
    name: 'ProductDetails',
    component:ProductDetails
  },
  {
    path:'/cart',
    component:UserCart
  },
  {
    path:'/sell',
    component:SellItem
  },
  {
    path:'/checkout',
    component:CheckOut
  },
  {
    path:'/category',
    component:ProductCategory
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
  {
    path: '/user',
    component: UserCenter,
    redirect: '/user/profile',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'products',
        name: 'UserProducts',
        component:UserProducts
      },
      {
        path: 'orders',
        name: 'UserOrders',
        component: UserOrders
      },
      {
        path: 'sales',
        name: 'UserSales',
        component:UserSales
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component:UserProfile
      }
    ]
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 使用 import.meta.env
  routes,
});

export default router;
