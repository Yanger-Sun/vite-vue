const user = {
    getUserInfo: {
        uri: '/get/userinfo/:need',
        method: 'get',
        queries: {
            userId: true
        },
        data: {
            uuid: true
        }
    }
}

export default {
    ...user
};