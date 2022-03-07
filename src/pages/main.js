/**
 * main.js
 * - The main and first page
 */
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, momentLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment';
import 'moment/locale/ko';
import { useEffect, useState } from 'react';
import { setMonth, setYear, setHolidayList } from '../actions/actions';
import REQ from '../common/request';

const Toolbar = (props) => {
    const {date} = props;
    const dispatch = useDispatch();

    const navigate = (action) => {
        let now = moment(props.date);

        if(action === "PREV") {
            let newDate = now.add(-1, 'M');
            dispatch(setMonth(newDate.format("MM")));
            dispatch(setYear(newDate.format("YYYY")));
        } else if(action === "NEXT") {
            let newDate = now.add(1, 'M');
            dispatch(setMonth(newDate.format("MM")));
            dispatch(setYear(newDate.format("YYYY")));
        } else if(action === "TODAY"){
            let newDate = moment();
            dispatch(setMonth(newDate.format("MM")));
            dispatch(setYear(newDate.format("YYYY")));
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

const dateHeaderContainer = (props) => {
    return (
        <DateHeader props={{...props, temp: "temp"}}></DateHeader>
    )
}

const DateHeader = ({props}) => {
    const {date} = props;
    const {label} = props;
    const day =date.getDay();
    let color = "black";
    
    if(day === 0) {
        color ="red"
    } else if(day === 6) {
        color ="blue"
    }
    
    return(
        <div>
            <a style={{color: color}}>{label}</a>
        </div>
    )
}

const Main = () => {
    const info = useSelector(state => (state.info));
    const localizer = momentLocalizer(moment);
    const nowMonth = useSelector(state => (state.nowMonth));
    const nowYear = useSelector(state => (state.nowYear));
    const holidayList = useSelector(state => (state.holidayList));
    const dispatch = useDispatch();
    const formats = {
        monthHeaderFormat: "YYYY년 MM월"
    }
    useEffect(()=> {
        /* 
            TODO : 정부 API 호출하는 것인데 이는 만료가 2024년 3월 3일이므로
            데이터 받아와서 넣어주는 것을 변경해줘야 함
        */
       // TODO : 다음 버튼을 누르면 누르기 전 데이터로 조회해옴....수정필요
        REQ.post({
            url: "/holidayApi/getHoliday",
            params: {
                month: nowMonth,
                year: nowYear
            },
            success: function(res) {
                dispatch(setHolidayList(res.data.response.body.items));
                console.log(holidayList);
            }
        });
    }, [nowMonth]);


    return (
        <>
            <div align="right">
                <Button variant="primary" onClick={()=>{}}>휴가신청</Button>
            </div>
            <div style={{height : "500px"}}>
                <Calendar
                    localizer={localizer}
                    culture={"ko"}
                    defaultDate={new Date()}
                    defaultView="month"
                    events={[]}
                    startAccessor="start"
                    endAccessor="end"
                    views={{ month: true}}
                    formats={formats}
                    components={{
                        toolbar: Toolbar,
                        month: {
                            dateHeader : dateHeaderContainer
                        }
                    }}
                >
                </Calendar>
            </div>
        </>
    )
}

export default Main;
