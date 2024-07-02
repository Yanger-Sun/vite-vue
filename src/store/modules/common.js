import { SET_STAGE_REF_SUBJECT } from '../mutation-types';
const state = {
    stageRefSubject: [], // 字典：学段学科
    institutionByBrand: {} // 组织信息
};

const getters = {
    stageSubjectObj(state) {
        return (state.stageRefSubject || []).reduce((result, item) => {
            result[item.stage] = item.subjects;
            return result;
        }, {});
    }
};

const mutations = {
    [SET_STAGE_REF_SUBJECT](state, list) {
        state.stageRefSubject = list || [];
    },
    meta: (state, data) => {
        Object.assign(state, data);
    }
};

const actions = {
    // 获取学段学科数据
    getStageRefSubject({ commit, state, dispatch }, payload = {}) {
        return new Promise((resolve, reject) => {
            if (state.stageRefSubject.length) {
                resolve(state.stageRefSubject);
                return;
            }
            G_transmit('listStageRefSubject', {
                queries: {
                    withAllStage: !!payload.withAllStage,
                    withAllSubject: !!payload.withAllSubject,
                    withAllGrade: !!payload.withAllGrade,
                    withMultipleStage: true
                }
            }).then((res) => {
                commit(SET_STAGE_REF_SUBJECT, res.data);
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    getInstitutionByBrand({ commit, state }) {
        return new Promise((resolve, reject) => {
            if (state.institutionByBrand.length) {
                resolve(state.institutionByBrand);
                return;
            }
            G_transmit('getInstitutionByBrand', {
            }).then((res) => {
                const {status, data} = res;
                commit('meta', {
                    institutionByBrand: data
                })
                resolve(data); 
            })
            .catch((err) => {
                reject(err);
            });
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
