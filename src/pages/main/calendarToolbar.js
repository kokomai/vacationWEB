/**
 *  calendarToolbar.js
 *  - toolbar for month calendar 
 */

import { useDispatch } from "react-redux";
import moment from 'moment';
import { ___setHolidayList, ___setMonth, ___setYear } from "../../actions/actions";
import { useEffect } from "react";
import REQ from '../../common/request';

const Toolbar = (props) => {
    const {date} = props;
    const dispatch = useDispatch();

    useEffect(()=> {
        REQ.post({
            url: "/vacation/getHolidays",
            params: {},
            success: function(res) {
                dispatch(___setHolidayList(res.data));
            }
        });
    }, [dispatch]);

    const navigate = (action) => {
        let now = moment(props.date);
    
        if(action === "PREV") {
            let newDate = now.add(-1, 'M');
            dispatch(___setMonth(newDate.format("MM")));
            dispatch(___setYear(newDate.format("YYYY")));
        } else if(action === "NEXT") {
            let newDate = now.add(1, 'M');
            dispatch(___setMonth(newDate.format("MM")));
            dispatch(___setYear(newDate.format("YYYY")));
        } else if(action === "TODAY"){
            let newDate = moment();
            dispatch(___setMonth(newDate.format("MM")));
            dispatch(___setYear(newDate.format("YYYY")));
        }

        props.onNavigate(action);
    };
    
    return (
    <div className="rbc-toolbar">
        <span className="rbc-btn-group">
            <button type="button" onClick={navigate.bind(null, 'TODAY')}>
                오늘
            </button>
            <button
                type="button"
                onClick={navigate.bind(null, 'PREV')}
            >
                ◁
            </button>
            <span className="rbc-toolbar-label">{`${date.getFullYear()}년 ${date.getMonth() + 1}월`}</span>
            <button
                type="button"
                onClick={navigate.bind(null, 'NEXT')}
            >
                ▷
            </button>
        </span>
    </div>
    )
}

export default Toolbar;