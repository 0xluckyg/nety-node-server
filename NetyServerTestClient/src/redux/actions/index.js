export const setToken = (token) => {
    return {
        type: 'setToken',
        payload: token
    }
}

export const setUserId = (id) => {
    return {
        type: 'setUserId',
        payload: id
    }
}
