/**
 * reducer.js
 * - combining reducer(root reducer)
 */

import { combineReducers } from "redux";
import infoReducer from "./infoReducer";
import { nowMonth, nowYear, holidayList } from "./calendarReducer";

export default combineReducers({ 
    info: infoReducer, 
    nowMonth: nowMonth,
    nowYear: nowYear,
    holidayList: holidayList
});

