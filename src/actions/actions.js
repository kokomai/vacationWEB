/**
 * actions.js 
 * - actions을 정의하는 함수 모음
 */

// 로그인 정보 셋팅
export const ___addInfo = (info) => {
    return {
        type: "ADD_INFO"
        , info
    }
}

// 로그인 정보 지우기
export const ___delInfo = (info) => {
    return {
        type: "DEL_INFO"
    }
}

// 현재 월 정보 셋팅
export const ___setMonth = (month) => {
    return {
        type: "SET_MONTH"
        , month
    }
}

// 현재 연도 정보 셋팅
export const ___setYear = (year) => {
    return {
        type: "SET_YEAR"
        , year
    }
}

// 휴일 리스트 셋팅
export const ___setHolidayList = (list) => {
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
export const ___setSelectedDate = (list) => {
    return {
        type: "SET_SELECTED_DATE"
        , list
    }
}

// 사용자의 남은 휴가, 전체 휴가 등 가져옴
// param : {
//     vacaTotCnt: String 전체 휴가
//     vacaUsedCnt: String 쓴 휴가
//     vacaExtraCnt: String 남은 휴가
// }
export const ___setVacaCnt = (obj) => {
    return {
        type: "SET_VACA_CNT"
        , obj
    }
}

// 휴가 리스트 셋팅
export const ___setVacationList = (list) => {
    return {
        type: "SET_VACATION_LIST"
        , list
    }
}