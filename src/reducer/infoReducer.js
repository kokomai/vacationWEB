
/**
 * infoReducer.js
 * - 세션 정보 관련 reducer
 */

const infoReducer = (state = {}, action) => {
    switch(action.type) {
        case "ADD_INFO" :
            return action.info
        case "DEL_INFO" :
            return {}
        default :
            return state
    }
}

export default infoReducer;