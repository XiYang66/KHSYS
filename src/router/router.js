import { createRouter,createWebHistory,createWebHashHistory } from 'vue-router';
const routes = [
    // {
    //     path: '/',
    //     name: 'cesium球',
    //     component:import('@/views/cesiumBall/index.vue')
    // },
    {
        path: '/',
        name: '任务信息管理系统研制',
        component:import('@/views/taskMessage/index.vue')
    },
    {
        path: '/taskDrill',
        name: '任务训练资源管理系统研制',
        component:import('@/views/taskDrill/index.vue')
    }
];

const router = createRouter({
    // history: createWebHistory(),
    history:createWebHashHistory(),
    routes
});

export default router;

