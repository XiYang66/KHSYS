import axios from 'axios';
import { ElMessage } from 'element-plus';
import emitter from '@/utils/mitter.js';
const service = axios.create({
    baseURL: '/api',
    timeout: 50000
});

// request 拦截器
service.interceptors.request.use(
    config => {
        // 在这里可以设置请求头、请求参数等return config
        config.headers.Authorization = 'Bearer ' + localStorage.getItem('authorization');

        if (config.url === '/routePlanning/file/upload') {
            config.headers['Content-Type'] = 'multipart/form-data';
        }

        return config;
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
);

// response 拦截器
service.interceptors.response.use(
    response => {
        // 在这里处理返回数据
        const { data } = response;

        if (response.config.url ===
            '/routePlanning/planning/export' || response.config.url === '/routePlanning/satellite/satellite') {
            return data;
        }
        if (data.code === 200) {
            return data;
        } else if (data.code === 10002) {
            emitter.emit('login-change');
            return data;
        }
        ElMessage({
            type: 'error',
            message: data.message
        });
        return data;

    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
);

export default service;