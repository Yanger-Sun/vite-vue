import types from '@/store/mutations/mutation-types';
import {transport} from '@/dao';
import Storage from '@/lib/storage';
import { queryToJson } from '@/lib/tools';
// import ResonpseHandler, { commitGlobalMessage, MESSAGE_DEFAULT, fmtPortalMessage } from '../../dao/response-handler';
import { parseBrand, fmtBrandPageKey } from '@/lib/parse-brand';
const Cookies = new Storage('cookie');
const ls = new Storage('localStorage');

/*
 * 清除系统下所有的cookie
 */
const clearCookie = function () {
    Cookies.removeItem();
};

const logoutAction = function (url) {
    let accessToken = queryToJson().accessToken || Cookies.getItem('X-DT-accessToken') || ''; // TOKEN;
    if(!accessToken){ // 如果清空了
        clearCookie();
        window.location.href = url;
        return;
    }
    G_transmit('logout', {
        message: false,
    }).finally(() => {
        clearCookie();
        window.location.href = url;
    });
};

/**
 * 检测portalName是否存在
 */
const checkPortalName = function (payload) {
    if (!payload.name) {
        throw new Error('proxyAction needs portal name!');
    }
};

const actions = {
    loading({ commit }, value) {
        commit(types.LOADING, value !== undefined ? value : true);
    },

    /**
	 * 判断token是否存在，如果不存在就退出
	 * @param {*} param0 
	 * @param {*} payload 
	 */
    checkIsLogout({commit, dispatch, state}, payload) {
        let accessToken = queryToJson().accessToken || Cookies.getItem('X-DT-accessToken') || ''; // TOKEN;
        if(!accessToken){ // 如果清空了
            dispatch('logout', payload)
        }
	},

    /**
     * 退出 + 跳转到登录页
     */
    logout({ commit, dispatch, state }, payload) {
        if (window.location.pathname === '/idx/login') {
            return;
        }
        let loginUrl = '/idx/login?authUrl=' + encodeURIComponent(window.location.href);
        // clearCookie();
        // window.location.href = loginUrl + encodeURIComponent(window.location.href);
        // debugger
        logoutAction(loginUrl)
    },

    /**
     * 退出 + 跳转到首页
     */
    logoutHome({ commit, dispatch, state }, payload) {
        // clearCookie();
        // window.location.href = '/idx/home';
        let loginUrl = '/idx/home';
        logoutAction(loginUrl);
    },

    /**
     * 设置state数据
     * @param {Object}  payload {
     * 	 state属性Key: value
     * }
     */
    meta({ commit, dispatch, state }, payload) {
        commit(types.META, payload);
    },

    /**
     * 消息提示，所有的toast提示都走message，不要单独调用组件的message
     * @param {Object} payload {
     *	 msg: toast的文本内容,
     *   type: 'success' || 'loading' || 'none'   默认为 'none'
     * 	 duration: 3000 默认为3秒
     * }
     */
    message({ commit, dispatch, state }, payload) {
        G_dispatchEvent('toast', payload);
        // commit(types.MESSAGE, payload);
    },

    /**
     * 埋点代理, 所有的埋点采用action的方式，放弃分散引用模式
     * @param {Object} payload {
     *	 name: string name(必须), 事件名
     * 	 data: object 需要追踪的数据
     * }
     */
    proxyTrack({ commit, dispatch, state }, payload) {
        // RecordData.track(payload.name, payload.data);
    },

    /**
     * 接口代理，没有特殊情况的接口都通过此方法进行代码，可覆盖大部分操作
     *
     * @param {Object} info => {
     *    name: action name(必须), 即 porter/portals.js 里的配置名称
     *    txtSuccess: 成功消息。true/字符串 显示；false/不传 不显示；
     *    txtError: 失败消息。true/字符串/不传 显示；false 不显示；
     *    queries: 请求参数 (url 问号后面的参数)
     *    data: form data 数据
     *    params: 替换portals 里的 uri 里的参数的内容
     *    uri: 替换portals里定义的 uri
     *    headers: 与 portals里定义的 headers 合并
     * }
     */
    // proxyAction({ commit, dispatch, state }, payload) {
    //     checkPortalName(payload);
    //     // 只有状态码为200的时候才会走resolve, 其他都走reject
    //     return new Promise((resolve, reject) => {
    //         transport(payload.name, payload).then((res) => {
	// 			let { status } = res;
    //             let { code } = status;
	// 			let handler = ResonpseHandler[code];
	// 			if (handler) {
	// 				handler(commit, dispatch, state, res, payload);
	// 			}
                
	// 			// 状态码为 200 时走resolve, 其他情况都走reject
	// 			if(code == 200) {
    //                 resolve(res);
	// 			} else {
    //                 commitGlobalMessage(commit, res, payload);
	// 				reject(res);
	// 			}
	// 		})
	// 		.catch((err) => {
    //             let status = err?.response?.data?.status || { code: -1, desc: fmtPortalMessage(err)};
    //             commitGlobalMessage(commit, { status }, payload);
	// 			reject(status);
	// 		});
    //     });
    // },
    /**
     * 更新state中的品牌相关信息 
    */
	updateBrand({commit, dispatch, state}, data) {
        let { ver, publishBrand } = data || {};
        ls.setItem('brandVer', ver);
        ls.setItem('publishBrand', publishBrand);
        let moduleList = publishBrand.brandModules || publishBrand.brandModulesV2;
        let pageMap = fmtBrandPageKey(moduleList) || {};
        ls.setItem('pagePermission', pageMap);
        commit(types.META, {
            brand: {
                ver,
                publishBrand
            },
            brandFactory: parseBrand(publishBrand, state.currentUser),
            pagePermission: pageMap
        });
       
    },
    /**
     * 设置站点基本信息
    */
    setSiteInfo({commit, dispatch, state}, data) {
        let { publishBrand } = data || {};
        let { brandConfig } = publishBrand || {};

        // 设置title
        document.title = brandConfig.siteName;

        // 设置favicon
        /** @type {HTMLLinkElement} link */
        let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = brandConfig.favicon;
        document.getElementsByTagName('head')[0].appendChild(link);

        // 设置网站描述
        if (brandConfig.brandDescription) {
            let head = document.getElementsByTagName('head');
            if(document.querySelector('meta[name="description"]')) {
                document.querySelector('meta[name="description"]').setAttribute('content', brandConfig.brandDescription)
            } else {
                let metaDescription = document.createElement('meta');
                metaDescription.setAttribute('name', 'description')
                metaDescription.setAttribute('content', brandConfig.brandDescription)
                head[0].appendChild(metaDescription)
            }
        }
    },
    setBreadCrumb({ commit, dispatch, state }, list) { // 设置的面包屑
        commit(types.META, {
            breadCrumbList: list
        });
    },
    addCounter({commit, dispatch, state}){
        commit('meta', {
            count: state.count ++ 
        })
    }
};

export default actions;
