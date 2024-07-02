import Storage from '@/lib/storage';
import { routeStatic } from '@/router/routes-static.js';

const ss = new Storage('sessionStorage');
const Cookies = new Storage('cookie');

/**
 * 重新遍历菜单组装数据
 */
function refreshMenu(menus, routesMap, rootId = 0) {
    let currentMenus = [];
    if(menus.length) {
        menus.forEach(item => {
            let menuItem = {
                title: item.custom_name || item.name, // 菜单项名称
                key: item.id, // 菜单项唯一值, 用路由名 命名
                id: item.id,
                parentId: rootId, // 父id
                link: item.link, // 外链
                link_type: item.link_type, // 1 应用  2 链接
                moduleKey: item.moduleKey,
                custom_name: item.custom_name || ''
            }
            if (item.moduleKey) {
                menuItem.route = { path: routesMap[item.moduleKey] } || {};
            }
            if (item.moduleKey === 'home') { // 首页
                menuItem.route = { path: '/idx/home' } || {};
            }
            menuItem.path = menuItem.route && menuItem.route.path || menuItem.link;
           
            if(item.sub_navs && item.sub_navs.length) {
                menuItem.sub_navs = refreshMenu(item.sub_navs, routesMap, item.id);
            }
            currentMenus.push(menuItem); 
        })
    }
    return currentMenus;
}

const state = {
    initialized: false, // true 初始化完成
    initUserInfo: false, // 是否查询了用户
    menuList: [], // 导航菜单
    realMenuList: [], // 拼接好的路由
    currentMenu: {}, // 当前路径对应菜单
    activeMenu: {}, // 高亮菜单
    currentTabs: [], // 当前路径对应的 tabs
    crumbData: [], // 面包屑
    isAllowJoin: true, // 是否允许参与听评课或者案例
    isHaveIdmx: false, // 是否有管理中心的权限
    isHaveStrain: false // 是否有继教权限 
};


const getters = {
    // 用户菜单（即该用户角色权限的菜单）
    userMenus: state => {
        return state.realMenuList || [];
    }
};

const actions = {
    init({commit, dispatch, rootState}, dataInfo) {
        return new Promise((resolve, reject) => {
            dispatch('getCurrentUser').then(() => {
            }).catch((err) => {
                reject(new Error(err))
            })
        })
    },
     // 获取当前登录用户信息
    getCurrentUser({commit, dispatch, rootState}) {
       
        let accessToken = Cookies.getItem('X-DT-accessToken') || '';
    
        if(!accessToken) {
              return;
        }
      
        return new Promise((resolve, reject) => {
            if (rootState.currentUser.userId) {
                return resolve(rootState.currentUser)
            }
            dispatch('getIdmxPermissions');
            G_transmit('getCenterUserInfo', {
            })
                .then((res) => {
                   let data = res.data || {};
                   commit('meta', {
                        currentUser: {
                            ...data
                        }
                    }, {
                        root: true
                    })
                    commit('setState', {
                        key: 'initUserInfo',
                        value: true
                    });
                    resolve(data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    // 获取用户导航菜单
    getUserPermissions({state, commit, dispatch}) {
        return Promise.all([dispatch('getNavList'), dispatch('getModuleList')]).then((resArr) => {
             if(resArr?.length > 1) {
                commit('setState', {
                    key: 'initialized',
                    value: true
                });
                commit('setState', { // 原始导航数据
                    key: 'menuList',
                    value: resArr[0]
                })
                let realMenuList = refreshMenu(resArr[0], resArr[1], 0);
                commit('setState', { // 最终的导航数据
                    key: 'realMenuList',
                    value: realMenuList
                })
             }
        }).catch(err => {
            console.log(err);
        })
    },
    getNavList({state, commit, dispatch}) { // 获取导航顺序及名称
        return new Promise((resolve, reject) => {
            G_transmit('getNavContent', {
                name: 'getNavContent',
                queries: {
                    componentTypes: 'navigation',
                    client: 'pc'
                }
            }).then((res) => {
                let navData = res?.data?.navigation || {};
                let list = navData.data ? JSON.parse(navData.data) : [];
                commit('setState', { // 导航模板
                    key: 'navTemplateId',
                    value: navData.navTemplateId || ''
                })
                resolve(list)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    // 获取应用列表
    getModuleList({state, commit, dispatch}) {
        return new Promise((resolve, reject) => {
            G_transmit('getModuleUrl', {
            }).then((res) => {
                resolve(res.data || {})
            }).catch((err) => {
                reject(err)
            })
        })
    },
    // 获取用户管理中心的菜单
    getIdmxPermissions({state, commit, dispatch}) {
        return new Promise((resolve, reject) => {
            G_transmit('getUserMenu', {
                queries: {
                    sysList: 'siteAdmin,education'
                }
            }).then((res) => {
                let mapArr = {};
                res.data?.length && res.data.map(item => {
                    mapArr[item.sys] = item.hasPermission;
                })
                commit('setState', {
                    key: 'isHaveIdmx',
                    value: mapArr.siteAdmin
                });
                commit('setState', {
                    key: 'isHaveStrain',
                    value: mapArr.education
                });
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    // 刷新菜单 & 权限
    reload() {
        window.location.reload();
    },
    reloadMenu({dispatch, rootState}) {
        dispatch('getUserPermissions');
    },
    // 获取用户导航菜单
    getUnreadMessage({state, commit, dispatch}) {
        return new Promise((resolve, reject) => {
            G_transmit('getUnreadNums', {
                queries: {
                    systemCodes: '1000,2000,3000,4000,5000,6000,7000,9000'
                }
            }).then((res) => {
                let data = res.data || { like: 0, message: 0 };
                commit('meta', {
                    unreadMessage: data
                }, {
                    root: true
                })
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    }
};

const mutations = {
    setState: (state, data) => {
        state[data.key] = data.value;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
