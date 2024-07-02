import types from './mutation-types';

const mutations = {
    [types.META]: (state, data) => {
        Object.assign(state, data);
    },
    [types.LOADING]: (state, flag) => {
        state[types.LOADING] = flag;
    },

    [types.MESSAGE]: (state, data) => {
        if (!data) {
            return;
        }
        // 包装对象，以使其可以显示重复的 message
        let obj = { duration: 3000 };
        if (typeof data === 'string') {
            obj.message = data;
        } else {
            obj = Object.assign(obj, data);
        }
        state[types.MESSAGE] = obj;
    },
    [types.CURRENT_USER]: (state, data) => {
        state[types.CURRENT_USER] = data;
    }
};

export default mutations;
