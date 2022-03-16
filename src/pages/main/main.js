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
import RequestModal from './requestModal';
import Toolbar from './calendarToolbar';
import VacationInfoModal from './vacationInfoModal';
import { useEffect, useState } from 'react';
import { ___setSelectedDate, ___setVacaCnt, ___setVacationList } from '../../actions/actions';
import REQ from '../../common/request';

const DateHeader = ({date, label}) => {
    const day =date.getDay();
    let color = "black";
    const holidayList = useSelector(state => (state.holidayList));
    const nowDate = moment(date).format("YYYYMMDD");
    if(day === 0) {
        color ="red"
    } else if(day === 6) {
        color ="blue"
    }
    
    if(holidayList) {
        for(let item of holidayList) {
            if(item.HOLIDAY_DATE.toString() === nowDate) {
                color = "red";
            }
        } 
    }
    
    return(
        <>
            <a href="#!" id={nowDate + "d"}style={{color: color, fontSize: "xx-small"}}>{label}</a>
        </>
    )
}

const DateCellWrapper = ({children, value, onClick, dateBgColor, onVacationClick, events}) => {
    let isVacation = false;
    let seq = "";
    value = moment(value).format("YYYYMMDD");

    for(let item of events) {
        if(item.id === value) {
            isVacation = true;
            seq = item.seq
            break;
        }
    }

    return (
        isVacation 
        ? <div 
            className={children.props.className}
            onClick={onVacationClick}
            date={value}
            seq={seq}
            style={{zIndex : 5, backgroundColor : dateBgColor(children.props.className, value)}}
            >
        </div>
        : <div 
            className={children.props.className}
            onClick={onClick}
            id={value}
            style={{zIndex : 5, backgroundColor : dateBgColor(children.props.className, value)}}
            >
        </div>
    )
}

function EventWrapper(event) {
    let bgColor = "rgba(255, 0, 0, 0.16)";
    let title = "";
    let stateColor = "#efb40e";

    switch(event.div) {
        case "01" :
            title =  "전일" 
            break;
        case "02" :
            title =  "오전"
            break;
        case "03" :
            title =  "오후"
            break;
        default :
            title = "휴가"
            break;
    }

    if(event.state === "승인" || event.state === "3차 승인") {
        stateColor = "rgb(0 157 63)";
    }

    if(event.div === "02") {
        bgColor = "rgba(228, 255, 0, 0.16)";
    } else if(event.div === "03") {
        bgColor = "rgba(16, 255, 0, 0.16)";
    }
    
    return (
        <div id={event.id + "e"} 
            onClick={event.onVacationClick} 
            seq={event.seq} 
            date={event.id}
            style={{
                backgroundColor: bgColor,
                borderRadius: '7px',
                textAlign: "center" 
            }}>
            <p seq={event.seq} 
            date={event.id}
            style={{
                fontSize : 'xx-small', 
                color: "#545454",
                margin:"6px",
                fontWeight: "bold",
            }}>{title ? title : ''}
                <small 
                date={event.id}
                seq={event.seq}
                style={{
                        color: stateColor,
                        width: "5%",
                        marginBottom: "7px",
                        marginTop: "5px",
                        marginLeft: "10px",
                    }}
                >⬤</small>  
            </p>
            
        </div>
    )
}

const Main = () => {
    const user = useSelector(state => (state.info));
    const selectedDate = useSelector(state=> (state.selectedDate));
    const vacaCnt = useSelector(state => (state.vacaCnt));
    const nowMonth = useSelector(state => (state.nowMonth));
    const nowYear = useSelector(state => (state.nowYear));
    const vacationList = useSelector(state => (state.vacationList));
    const localizer = momentLocalizer(moment);
    const dispatch = useDispatch();
    const formats = {
        monthHeaderFormat: "YYYY년 MM월"
    }
    const [vacaCntShow, setVcaCntShow] = useState({...vacaCnt});
    const [useCount, setUseCount] = useState(0);
    const [vacaDiv, setVacaDiv] = useState("01");
    const [showModal, setShowModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoModalParams, setInfoModalParams] = useState({
        apprv1: "",
        apprv2: "",
        date: "",
        email: "",
        state: "",
        isBefore: false
    });

    let list = [...selectedDate];

    
    useEffect(() => {
        REQ.post({
            url : "/vacation/getVacationRemains",
            params : {
                id : user.id
            },
            success: function(res) {
                let obj = {...user};
                // 이번년도 전체 휴가
                obj['totCnt'] = res.data.VACA_TOT_CNT;
                // 이번년도 쓴 휴가
                obj['usedCnt'] = res.data.VACA_USED_CNT;
                // 이번년도 남은 휴가
                obj['extraCnt'] = res.data.VACA_EXTRA_CNT;
                dispatch(___setVacaCnt(obj));
            }
        });
    }, [user, dispatch])

    useEffect(() => {
        let innerUseCount = 0;
        for(let i in selectedDate) {
            
            if(selectedDate[i].VACA_DIV === "01") {
                innerUseCount++;
            } else {
                innerUseCount += 0.5;
            }
        }
        let obj = {...vacaCnt};
        // 이번년도 쓴 휴가
        obj.usedCnt = obj.usedCnt + innerUseCount;
        // 이번년도 남은 휴가
        obj.extraCnt = obj.extraCnt - innerUseCount;
        setVcaCntShow(obj);
        setUseCount(innerUseCount);
    }, [selectedDate, vacaCnt, setVcaCntShow])
    
    useEffect(() => {
        REQ.post({
            url: '/vacation/getVacationList',
            params: {
                yearmonth : nowYear + nowMonth,
                id: user.id
            },
            success: function(res) {
                let obj = {};
                let list = [];
                
                for(let item of res.data) {
                    obj = {
                        id : item.VACA_DATE,
                        allDay: true,
                        start : moment(item.VACA_DATE, "YYYYMMDD"),
                        end : moment(item.VACA_DATE, "YYYYMMDD"),
                        div: item.VACA_DIV,
                        state: item.VACA_STATE,
                        seq: item.VACA_SEQ
                    }

                    list.push(obj);
                }

                dispatch(___setVacationList(list));
            }
        })
    },[nowMonth, nowYear, dispatch, user.id]);

    useEffect(() => {
        // console.log(vacationList);
    }, [vacationList])

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
            dispatch(___setSelectedDate(list));
        } else {
            let duplIdx = -1;
            for(let i = 0; i < list.length; i++) {
                if(list[i].VACA_DATE === val) {
                    duplIdx = i;
                    break;
                }
            }

            if(duplIdx < 0) {
                if(vacaCntShow.extraCnt <= 0) {
                    alert("남은 휴가가 없습니다!");
                    return;
                }
                list.push(obj);
            } else {
                list.splice(duplIdx, 1);
            }
            dispatch(___setSelectedDate(list));
        }
    }

    const dateBgColor = (className, id) => {
        let color = "";

        if(className.includes("rbc-today")) {
            color = "#0066ff29"
        }

        if(className.includes("rbc-off-range-bg")) {
            color = "#403f3f29"
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

    const onVacationClick = async (e) => {
        await REQ.post({
            url: "/vacation/getVacationInfo",
            params: {
                id: user.id,
                seq: e.target.getAttribute("seq"),
                date: e.target.getAttribute("date")
            },
            success: function(res) {
                console.log(res);
                let obj = {};
                if(res.data.APPRV1) {
                    obj["apprv1"] = res.data.APPRV1
                    obj["apprv2"] = res.data.APPRV2
                } else if(res.data.APPRV2){
                    obj["apprv1"] = res.data.APPRV2
                    obj["apprv2"] = res.data.APPRV3
                } else {
                    obj["apprv1"] = res.data.APPRV3
                }
                obj["date"] = res.data.VACA_DATE + "(" + res.data.VACA_DIV + ")";
                obj["email"] = res.data.VACA_EMAIL_SEND_STATE;
                obj["state"] = res.data.VACA_STATE;

                if(moment().format("YYYYMMDD") > res.data.VACA_DATE 
                && (res.data.VACA_STATE === "승인" || res.data.VACA_STATE === "3차 승인")) {
                    obj["isBefore"] = true;
                } else {
                    obj["isBefore"] = false;
                }

                setInfoModalParams(obj);
                setShowInfoModal(true);
            }
        });
    }

    return (
        <>  
            <div className='row'>
                <div className='col-7'>
                    <h5 style={{color: "#b95cff"}}>{ user.name + "님"}</h5>
                    <span>전체 휴가일 : { vacaCntShow.totCnt }</span><br/>
                    <span>사용 휴가일 : { vacaCntShow.usedCnt + "(+" + useCount + ")" }</span><br/>
                    <span>남은 휴가일 : { vacaCntShow.extraCnt + "(-" + useCount + ")" }</span><br/>
                </div>
                <div className="col-5 d-flex justify-content-end">
                    <Button size="lg" variant="primary" onClick={requestVaca}>휴가신청</Button>
                </div>
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
                    events={vacationList ? vacationList : []}
                    localizer={localizer}
                    culture={"ko"}
                    defaultDate={new Date()}
                    defaultView="month"
                    startAccessor="start"
                    endAccessor="end"
                    views={{ month: true}}
                    formats={formats}
                    components={{
                        eventWrapper : (e) => {
                            let {event} = e;
                            return <EventWrapper
                                {...event}
                                onVacationClick={onVacationClick}
                            />
                        },
                        toolbar: Toolbar, 
                        dateCellWrapper: (data) => {
                            return <DateCellWrapper 
                                {...data}
                                events={vacationList ? vacationList : []}
                                vacaDiv={vacaDiv} 
                                onClick={onDateClick}
                                onVacationClick={onVacationClick}
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
            <RequestModal useCount={useCount} showModal={showModal} setShowModal={setShowModal} vacaCntShow={vacaCntShow}></RequestModal>
            <VacationInfoModal params={infoModalParams} showInfoModal={showInfoModal} setShowInfoModal={setShowInfoModal}></VacationInfoModal>
        </>
    )
}

export default Main;
