import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './tailwind.css'
import './assets/main.css'
import 'animate.css'
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-persistedstate-plugin';
// // 数据持久化
const pinia = createPinia();
const persist = createPersistedState();
pinia.use(persist);

const app = createApp(App);
for (const [key,component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key,component)
}
app.use(router);
app.use(ElementPlus);
app.use(pinia);
app.mount('#app');
export default pinia;
