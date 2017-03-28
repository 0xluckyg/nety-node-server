import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    token: (state = '', action) => {
        switch(action.type) {
            case 'setToken':
                state = action.payload;
                return state;
            default:
                return state;
        }
    }
})

export default rootReducer
