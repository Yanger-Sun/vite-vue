import { CHANGE_ANSWER_LIMITS } from '../mutation-types';

const state = {
    answerLimits: {}, // 问答权限 { key: true|false }
    answerRole: '' // 问答角色 super_admin-超级管理员 admin-管理员 member-成员 visitor-游客
};

const mutations = {
    [CHANGE_ANSWER_LIMITS](state, param) {
        Object.assign(state, param);
    }
};

const getters = {
    isAdmin: state => {
        return ['admin', 'super_admin'].includes(state.answerRole);
    }
};

const actions = {
    // 获取用户在线问答权限
    getUserAnswerLimits({ commit }, taskId) {
        G_transmit('roleElements', {
            queries: {
                id: taskId || ''
            }
        }).then(({ data }) => {
            const answerLimits = (data.elements || []).reduce((result, item) => {
                result[item.key] = item.value !== 0; // 0-不可见 1-可见可操作 2-可见不可操作(2-是预留，未实现)
                return result;
            }, {});
            commit(CHANGE_ANSWER_LIMITS, {
                answerLimits,
                answerRole: data.roleKey
            });
        }).catch((err) => {
            console.error(err);
        });
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};