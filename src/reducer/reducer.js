/**
 * reducer.js
 * - combining reducer(root reducer)
 */

import { combineReducers } from "redux";
import { __infoReducer, __vacaCntReducer } from "./infoReducer";
import { __nowMonth, __nowYear, __holidayList, __selectedDate, __vacationList } from "./calendarReducer";

export default combineReducers({ 
    info : __infoReducer,
    vacaCnt : __vacaCntReducer,
    nowMonth : __nowMonth,
    vacationList : __vacationList,
    nowYear : __nowYear,
    holidayList : __holidayList,
    selectedDate : __selectedDate
});

