import axios from '../utils/axios';


// 模拟接口调用
export function getTargetTreeData(data) {
    return axios({
        url: '/countryArea/getAreaTree',
        method: 'POST',
        data: data
    });
}
export function getEngChnFieldGroup(params) {
    return axios({
        url: '/eng-chn-field/getEngChnFieldGroup',
        method: 'GET',
        params: params
    });
}