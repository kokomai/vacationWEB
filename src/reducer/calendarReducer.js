
/**
 * calendarReducer.js
 * - 캘린더 관련 reducer
 */
import moment from "moment"

const __nowMonth = (state = moment().format("MM"), action) => {
    switch(action.type) {
        case "SET_MONTH" :
            return action.month
        default :
            return state
    }
}

const __nowYear = (state = moment().format("YYYY"), action) => {
    switch(action.type) {
        case "SET_YEAR" :
            return action.year
        default :
            return state
    }
}

const __holidayList = (state = [], action) => {
    switch(action.type) {
        case "SET_HOLIDAY_LIST" :
            return action.list
        default :
            return state
    }
}

const __selectedDate = (state = [], action) => {
    switch(action.type) {
        case "SET_SELECTED_DATE" :
            return action.list
        default :
            return state
    }
}

const __vacationList = (state = [], action) => {
    switch(action.type) {
        case "SET_VACATION_LIST" :
            return action.list
        default :
            return state
    }
}

export { __nowMonth, __nowYear, __holidayList, __selectedDate, __vacationList };