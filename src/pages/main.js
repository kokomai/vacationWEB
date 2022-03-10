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
import { setMonth, setYear, setHolidayList, setSelectedDate } from '../actions/actions';
import REQ from '../common/request';
import { useNavigate } from 'react-router-dom';

const Toolbar = (props) => {
    const {date} = props;
    const dispatch = useDispatch();
    const nowMonth = useSelector(state => (state.nowMonth));
    const nowYear = useSelector(state => (state.nowYear));

    useEffect(()=> {
        REQ.post({
            url: "/holidayApi/getHoliday",
            params: {
                month: nowMonth,
                year: nowYear
            },
            success: function(res) {
                dispatch(setHolidayList(res.data.response.body.items));
            }
        });
    }, [nowMonth]);

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

const DateHeader = ({date, label}) => {
    const day =date.getDay();
    let color = "black";
    let holidayName = ""; 
    const holidayList = useSelector(state => (state.holidayList));
    const nowDate = moment(date).format("YYYYMMDD");
    if(day === 0) {
        color ="red"
    } else if(day === 6) {
        color ="blue"
    }
    
    if(holidayList.item) {
        if(Array.isArray(holidayList.item)) {
            for(let item of holidayList.item) {
                if(item.locdate.toString() === nowDate) {
                    color = "red";
                    holidayName = item.dateName;
                }
            } 
        } else {
            if(holidayList.item.locdate.toString() === nowDate) {
                color = "red";
                holidayName = holidayList.item.dateName;
            }
        }
    }
    
    return(
        <>
            <a id={nowDate + "d"}style={{color: color, fontSize: "xx-small"}}>{label}</a>
            {
                    holidayName !== "" 
                    ? <div><a style={{color: "red", fontSize: "xx-small"}}>{holidayName}</a></div>
                    : <></>
            }
        </>
    )
}

const DateCellWrapper = ({children, value, onClick, dateBgColor}) => {
    value = moment(value).format("YYYYMMDD");

    return (
        <div 
        className={children.props.className}
        onClick={onClick}
        id={value}
        style={{zIndex : 5, backgroundColor : dateBgColor(children.props.className, value)}}
        >
        </div>
    )
}

const RequestModal = ({showModal, setShowModal}) => {
    const dispatch = useDispatch();
    const selectedDate = useSelector(state=> (state.selectedDate));
    const [handOver, setHandOver] = useState("");
    const [backfill, setBackfill] = useState("");

    let str = "";
    for(let item of selectedDate) {
        str += item.VACA_DATE.substr(0, 4) + "년";
        str += item.VACA_DATE.substr(4, 2) + "월";
        str += item.VACA_DATE.substr(6, 2) + "일";
        if(item.VACA_DIV === "01") {
            str += " : 전일\n";
        } else if(item.VACA_DIV === "02"){
            str += " : 오전\n";
        } else {
            str += " : 오후\n";
        }
    }

    // useEffect(()=> {
    //     console.log(handOver);
    // }, [handOver])

    const close = () => {
        setShowModal(false);
    }

    const request = () => {
        str += "1차 결제자 : ";

        str += "\n휴가를 신청하겠습니까?";

        if(window.confirm(str)) {
            alert("휴가 신청 완료!");
            dispatch(setSelectedDate([]));
            close();
        };
    }

    return(
        <div className={"modal fade " + (showModal ? "show" : "")} style={{display : showModal ? "block" : "none"}}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">세부사항 입력</h5>
                        <a type="button" className="btn-close" onClick={close} aria-label="Close">Χ</a>
                    </div>
                    <div className="modal-body">
                        <div>
                            <small>사용 후 잔여일수 : 15일</small><br/>
                            <small>잔여일수 : 14일</small><br/>
                            <small>총 휴가일 수 : 18일</small><br/>
                            <br/>
                            <small>선택날짜</small><br/>
                            <small dangerouslySetInnerHTML={{__html : str.replace("\n", "<br/>")}}></small>
                            
                        </div>
                        <hr></hr>
                        <div className="selects mt-4">
                            <h5>1차 결제자 지정</h5>
                            <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                                <option value="0">Open this select menu</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                            <h5>2차 결제자 지정</h5>
                            <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                                <option value="0">Open this select menu</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                            
                        </div>
                        <div className="desc mt-2">
                            <h5>인수인계</h5>
                            <textarea value={handOver} onInput={(e)=> { setHandOver(e.target.value) }}></textarea>
                            <h5>인수자</h5>
                            <input value={backfill} onInput={(e)=> { setBackfill(e.target.value) }}/>
                        </div>
                        
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={close}>취소</button>
                        <button type="button" className="btn btn-primary" onClick={request}>신청</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Main = () => {
    const user = useSelector(state => (state.info));
    const selectedDate = useSelector(state=> (state.selectedDate));
    const localizer = momentLocalizer(moment);
    const dispatch = useDispatch();
    const formats = {
        monthHeaderFormat: "YYYY년 MM월"
    }
    
    let list = [...selectedDate];

    const [vacaDiv, setVacaDiv] = useState("01");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        REQ.post({
            url : "/vacation/getVacationRemains",
            params : {
                id : user.id
            },
            success: function(res) {
                console.log(res);
                
            }
        });
    }, [user])

    const onDateClick= (e) => {
        let val = e.target.getAttribute("id");
        if(document.getElementById(val + "d").style['color'] === "red"
        || document.getElementById(val + "d").style['color'] === "blue") {
            alert("해당 날짜는 이미 휴일입니다!");
            return;
        }
        
        let obj = {
            VACA_DATE: val,
            VACA_DIV: vacaDiv,
        }

        if(list.length === 0) {
            list.push(obj);
            dispatch(setSelectedDate(list));
        } else {
            let duplIdx = -1;
            for(let i = 0; i < list.length; i++) {
                if(list[i].VACA_DATE === val) {
                    duplIdx = i;
                    break;
                }
            }

            if(duplIdx < 0) {
                list.push(obj);
            } else {
                list.splice(duplIdx, 1);
            }
            dispatch(setSelectedDate(list));
        }
    }

    const dateBgColor = (className, id) => {
        let color = "";
        let wholeDay = "#ff000029";

        if(className.includes("rbc-today")) {
            color = "#0066ff29"
        }

        for(let i = 0; i < list.length; i++) {
            if(list[i].VACA_DATE === id) {
                if(list[i].VACA_DIV === "01") {
                    color = "#ff000029";
                } else if(list[i].VACA_DIV === "02") {
                    color = "#e4ff0029";
                } else {
                    color = "#10ff0029";
                }
                break;
            }
        }

        return color;
    }
    const requestVaca = () => {
        if(list.length === 0) {
            alert("휴가신청일을 달력에서 지정해 주세요.");
            return;
        }
        
        setShowModal(true);
    }

    return (
        <>
            <div align="right">
                <span>남은 휴가일 : {  }</span>
                <Button variant="primary" onClick={requestVaca}>휴가신청</Button>
            </div>
            <div align="right">
                <label style={{backgroundColor: "#ff000029"}} htmlFor="wholeDay">
                    <input id="wholeDay" name="VACA_DIV" type="radio" 
                        value="01"
                        checked={vacaDiv === "01"}
                        onChange={(e)=> { setVacaDiv(e.target.value);}}
                    />
                    전일
                </label>
                <label style={{backgroundColor: "#e4ff0029"}} htmlFor="am">
                    <input id="am" name="VACA_DIV" type="radio" 
                        value="02"
                        checked={vacaDiv === "02"}
                        onChange={(e)=> { setVacaDiv(e.target.value);}}
                    />
                    오전
                </label>
                <label style={{backgroundColor: "#10ff0029"}} htmlFor="pm">
                    <input id="pm" name="VACA_DIV" type="radio"
                        value="03"
                        checked={vacaDiv === "03"}
                        onChange={(e)=> { setVacaDiv(e.target.value);}}
                    />
                    오후
                </label>
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
                        dateCellWrapper: (data) => {
                            return <DateCellWrapper 
                                {...data} 
                                vacaDiv={vacaDiv} 
                                onClick={onDateClick}
                                dateBgColor={dateBgColor}
                            />
                        },
                        month: {
                            dateHeader : DateHeader
                        }
                    }}
                >
                </Calendar>
            </div>
            <RequestModal showModal={showModal} setShowModal={setShowModal}></RequestModal>
        </>
    )
}

export default Main;
