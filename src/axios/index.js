import axios from 'axios';
import FormateApi from './formateApi.js';
let stayTime = 3000 //设置zarmUI库Toast（轻提示）组件的停留时间

/**
 * 设置超时时间和跨域是否允许携带凭证
 */
axios.defaults.timeout = 10000; //10秒
axios.defaults.withCredentials = true;

/**
 * 设置post请求头
 * application/json;charset=UTF-8   JSON格式
 * application/x-www-form-urlencoded;charset=UTF-8  Form表单格式
 */
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';

var CancelToken = axios.CancelToken;
let sources = []  // 定义数组用于存储每个ajax请求的取消函数及对应标识

/**
 * 请求防抖当一个url地址被请求多次就会取消前一次请求
 */
let removeSource = (config) => {
    for (let source in sources) {
        // 当多次请求相同时，取消之前的请求
        if (sources[source].umet === config.url + '&' + config.method) {
            sources[source].cancel("取消请求")
            sources.splice(source, 1)
        }
    }
}

/**
 * 请求拦截器
 */
axios.interceptors.request.use(config => {
    removeSource(config)
    config.cancelToken = new CancelToken((c) => {
        // 将取消函数存起来
        sources.push({ umet: config.url + '&' + config.method, cancel: c })
    })
    return config;
}, error => {
    return Promise.reject(error)
}
)

// 响应拦截器
axios.interceptors.response.use(config => {
    if (config.data.statusCode >= 3000) {
        Toast.show({ content: config.data.msg, stayTime })
    }
    removeSource(config.config)

    return config.data;
}, error => {
    debugger;
    if (!error.response) return
    switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。                
        case 401:
            if (window.location.hostname === "localhost") {
                axios.post("/api/v1/login?client_name=form", {
                    "userName": "lixiaoyao4_vendor",
                    "password": 123456
                })
            } else {
                window.location = error.response.headers.locationurl;
            }
            break;

        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面                
        case 403:
            Toast.show({ content: "登录过期，请重新登录", stayTime })
            // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面 
            if (window.location.hostname === "localhost") {
                axios.post("/api/v1/login?client_name=form", {
                    "userName": "lixiaoyao4_vendor",
                    "password": 123456
                })
            } else {
                window.location = error.response.headers.locationurl;
            }
            break;

        // 404请求不存在
        case 404:
            Toast.show({ content: "访问资源不存在", stayTime })
            break;
        // 其他错误，直接抛出错误提示
        default:
            Toast.show({ content: error.response.data.message, stayTime })
    }
    return Promise.reject(error.response)
}
)

function requestApi(apiInfo){
    // let {name, payload, useCache} = apiInfo;
    let api = new FormateApi(apiInfo);
    let content = api.getApi();

    let transformRequest = [data => {
        // return isMultipart(content.headers) ? '' : qs.stringify(data);
        return JSON.stringify(data || {});
    }]
    return axios(content.url, {
        method: content.method,
        data: content.data,
        transformRequest,
        headers: content.headers,
        responseType: content.responseType
    }).then(res => {
        // res.map = content.map;
        res.responseType = content.responseType;
        return res;
    });
};

// 对外暴露
export default requestApi;