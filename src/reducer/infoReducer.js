
/**
 * infoReducer.js
 * - 사용자 정보 관련 reducer
 */

const __infoReducer = (state = {}, action) => {
    switch(action.type) {
        case "ADD_INFO" :
            return action.info
        case "DEL_INFO" :
            return {}
        default :
            return state
    }
}

const __vacaCntReducer = (state = {}, action) => {
    switch(action.type) {
        case "SET_VACA_CNT" :
            return action.obj
        default :
            return state
    }
}



export { __infoReducer, __vacaCntReducer };