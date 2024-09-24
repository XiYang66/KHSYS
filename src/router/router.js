import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
const routes = [
    {
        path: '/',
        name: '任务信息',
        component: import('@/views/taskMessage/index.vue'),
        meta: {position: "left",index:1}
    },
    {
        path: '/taskDrill',
        name: '任务训练',
        component: import('@/views/taskDrill/index.vue'),
        meta: {position: "left",index:2}
    },
    {
        path: '/taskDrill',
        name: '任务试题',
        component: import('@/views/taskDrill/index.vue'),
        meta: {position: "left",index:3}
    },
    {
        path: '/taskDrill',
        name: '实验室门户',
        component: import('@/views/taskDrill/index.vue'),
        meta: {position: "left",index:4}
    },
    {
        path: '/taskDrill',
        name: '指显系统',
        component: import('@/views/taskDrill/index.vue'),
        meta: {position: "left",index:5}
    },

    {
        path: '/taskDrill',
        name: '岗位资格',
        component: import('@/views/taskDrill/index.vue'),
        meta: {position: "right",index:6}
    },
    {
        path: '/taskDrill',
        name: '虚拟网支持',
        component: import('@/views/taskDrill/index.vue'),
        meta: {position: "right",index:7}
    },
    {
        path: '/taskDrill',
        name: '在线对抗',
        component: import('@/views/taskDrill/index.vue'),
        meta: {position: "right",index:8}
    },
    {
        path: '/taskDrill',
        name: '虚拟网环境',
        component: import('@/views/taskDrill/index.vue'),
        meta: {position: "right",index:9}
    },
    {
        path: '/taskDrill',
        name: '国产数据库',
        component: import('@/views/taskDrill/index.vue'),
        meta: {position: "right",index:10}
    }
];

const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes
});

export default router;

