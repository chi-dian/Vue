import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './tailwind.css'
import './assets/main.css'
import 'animate.css'
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css';
import store from './stores/store';
// // 数据持久化
const app = createApp(App);
for (const [key,component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key,component)
}
app.use(router);
app.use(ElementPlus);
app.use(store)
app.mount('#app');
