import api from '@/api/index';

let process = import.meta.env;

class FormateApi{
    constructor(apiInfo) {
        let basicApi = api[apiInfo.name];
        console.log(import.meta.env);
        this.url = genUri(apiInfo);
        this.method = api[apiInfo.name].method;
        this.header = getHeader(apiInfo);
        this.queries = getRequestParams(apiInfo, 'queries');
        this.data = getRequestParams(apiInfo, 'data');

        this.responseType = basicApi.responseType || 'json'; // 如二进制blob流

        if(Object.keys(this.queries).length){
            this.url = getUrlCpmplete(this.url, this.queries);
        }
    }
    getApi(){
        debugger;
        let {url, header, data, method, responseType} = this;
        return {
            url,
            header,
            method,
            data,
            responseType
        }
    }
}

// header设置
function getHeader(){
    let headers = {
        // "Content-Type": 'text/html; charset=UTF-8',
    };
    headers['Content-Type'] = 'application/json';
    return {
        ...headers
    }
}

// user/:id, {id: 1}  =>>   user/1
function genUri(apiInfo) {
    let params = apiInfo.params || {};
    let basicUrl = api[apiInfo.name].uri ;

    let keys = Object.keys(params);
    if(keys.length && basicUrl) {
        keys.forEach(rkey => {
            basicUrl = basicUrl.replace(`:${rkey}`, encodeURIComponent(params[rkey]));
        });
    }
    return basicUrl ? process.VITE_APP_API + basicUrl : '';
    // return basicUrl;
}

function getUrlCpmplete(url, queries) {
    url += '?';
    for (const key in queries) {
        url += `${key}=${queries[key]}&`;
    }
    return url[url.length-1] == '&' ? url.slice(0, -1) : url;
}

function getRequestParams(apiInfo, key) {

    let relateQueries = api[apiInfo.name][key] || {};
    let formData = apiInfo[key]; // 接口定义中的queries

    let obj = {};
    for (const fk in formData) {
        if(relateQueries.hasOwnProperty(fk)){
            obj[fk] = formData[fk];
        }
    }
    return obj;
}

function genPackage(apiInfo) {
    
}

export default FormateApi;