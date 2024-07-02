import requestApi from '@/axios/index';

const actions = {
    addCounter({commit, dispatch, state}){
        commit('meta', {
            count: state.count ++ 
        })
    },
    request({commit, dispatch, state}, payload){
        return new Promise((resolve, reject) => {
            requestApi(payload).then(res => {
               /*  let data = res.data;
                if (res.code || res.code === 200) { */
                    /* let msg = payload.message;
                    if (msg !== false) {
                        msg = msg === true ? '' : msg;
                        commit(types.MESSAGE, msg || res.message || myMessage.success)
                    }
                    if(payload.name === 'activitUserAuths' && PageKeys.includes(payload.queries.authKey)) {
                        let temp = data.data;
                        if(temp && temp.authMap && temp.authMap[payload.queries.authKey] && temp.authMap[payload.queries.authKey] != 1 || !temp.authMap || !temp.authMap[payload.queries.authKey]) {
                            commit('meta', {
                                initialized: false,
                                pageMessage: { 
                                    code: 403,
                                    message: '无权限访问此页面'
                                }
                            });        
                        }
                    } */
                    resolve(res);
                // }
            }).catch(error=>{
                reject();
            })
        })
    }
};

export default actions;
