
/**
 * infoReducer.js
 * - 세션 정보 관련 reducer
 */

const infoReducer = (state = {}, action) => {
    switch(action.type) {
        case "ADD_INFO" :
            return {
                ...state,
                info: action.info
            }
        case "DEL_INFO" :
            return {
                ...state, 
                info: action.info
            }
        default :
            return state
    }
}

export default infoReducer;