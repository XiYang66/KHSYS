import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
const routes = [
    {
        path: '/',
        name: '任务信息管理',
        component: ()=>import('@/views/taskMessage/index.vue'),
        meta: { position: "left", index: 1 }
    },
    {
        path: '/taskDrill',
        name: '任务训练资源管理',
        component: ()=>import('@/views/taskDrill/index.vue'),
        meta: { position: "left", index: 2 }
    },
    {
        path: '/taskDrill',
        name: '任务试题库管理',
        component: ()=>import('@/views/taskDrill/index.vue'),
        meta: { position: "left", index: 3 }
    },
    {
        path: '/taskDrill',
        name: '实验室门户网站',
        component: ()=>import('@/views/taskDrill/index.vue'),
        meta: { position: "left", index: 4 }
    },
    {
        path: '/taskDrill',
        name: '指显系统研制',
        component: ()=>import('@/views/taskDrill/index.vue'),
        meta: { position: "left", index: 5 }
    },

    {
        path: '/taskDrill',
        name: '岗位资格认证',
        component: ()=>import('@/views/taskDrill/index.vue'),
        meta: { position: "right", index: 6 }
    },
    {
        path: '/taskDrill',
        name: '虚拟网支撑环境',
        component: ()=>import('@/views/taskDrill/index.vue'),
        meta: { position: "right", index: 7 }
    },
    {
        path: '/taskDrill',
        name: '在线对抗训练',
        component: ()=>import('@/views/taskDrill/index.vue'),
        meta: { position: "right", index: 8 }
    },
    {
        path: '/taskDrill',
        name: '虚拟网系统',
        component: ()=>import('@/views/taskDrill/index.vue'),
        meta: { position: "right", index: 9 }
    },
    // {
    //     path: '/popup',
    //     name: 'popup',
    //     component: ()=>import('@/views/popup/index.vue'),
    //     meta: { position: "right", index: 10 }
    // }
];

const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes
});

export default router;

