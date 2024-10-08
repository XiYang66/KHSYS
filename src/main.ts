import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router.js';
import directive from './directive';
import './assets/css/style.css';
import './assets/css/element.scss';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import ElementPlus from 'element-plus';
import pinia from "@/store";
import animated from 'animate.css' 
const app=createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(animated)
app.use(router);
app.use(pinia);
app.use(ElementPlus, {
  locale: zhCn,
});
directive(app);
app.mount('#app');
