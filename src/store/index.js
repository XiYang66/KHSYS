import { createPinia } from 'pinia';//状态储存仓库
import piniaPersist from 'pinia-plugin-persist' //数据持久化

const pinia = createPinia()
pinia.use(piniaPersist)

export default pinia;
