/**
 * actions.js 
 * - actions을 정의하는 함수 모음
 */

// 로그인 정보 셋팅
export const addInfo = (info) => {
    return {
        type: "ADD_INFO"
        , info
    }
}

// 로그인 정보 지우기
export const delInfo = (info) => {
    return {
        type: "DEL_INFO"
    }
}

// 현재 월 정보 셋팅
export const setMonth = (month) => {
    return {
        type: "SET_MONTH"
        , month
    }
}

// 현재 연도 정보 셋팅
export const setYear = (year) => {
    return {
        type: "SET_YEAR"
        , year
    }
}

// 휴일 리스트 셋팅
export const setHolidayList = (list) => {
    return {
        type: "SET_HOLIDAY_LIST"
        , list
    }
}

// 사용자가 선택한 날짜 셋팅
// param : {
//     stdt: String
//     eddt: String
// }
export const setSelectedDate = (list) => {
    return {
        type: "SET_SELECTED_DATE"
        , list
    }
}