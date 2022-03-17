/**
 * requestModal.js
 * - The modal for vacation request used in main.js
 */
import { useDispatch, useSelector } from 'react-redux';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'moment/locale/ko';
import { useEffect, useState } from 'react';
import REQ from '../../common/request';
import { ___setSelectedDate } from '../../actions/actions';
import moment from 'moment';

const RequestModal = ({showModal, setShowModal, vacaCntShow, useCount}) => {
    const dispatch = useDispatch();
    const selectedDate = useSelector(state=> (state.selectedDate));
    const user = useSelector(state => (state.info));
    const [authList, setAuthList] = useState({});
    const [approvers, setApprovers] = useState({});

    let str = "";
    let isBefore = false;

    for(let item of selectedDate) {
        if(moment().format("YYYYMMDD") > item.VACA_DATE) {
            isBefore = true;
        }

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

    useEffect(async ()=> {
        await REQ.post({
            url: "/vacation/getApprovers",
            params: {
                department: user.department,
                auth: user.auth
            },
            success: function(res) {
                setAuthList(res.data);
            }
        })
    }, [user, setAuthList, approvers])

    useEffect(()=> {
        let auth1 = localStorage.getItem("auth1");
        let auth2 = localStorage.getItem("auth2");
        if(auth1) {
            approvers["auth1"] = auth1;
        }
        if(auth2) {
            approvers["auth2"] = auth2;
        }
    }, []);

    const close = () => {
        setShowModal(false);
    }

    const request = () => {
        let confirmText = str + "\n휴가를 신청하겠습니까?";
    
        if(isBefore) {
            confirmText = "※ 현재보다 이전일이 포함되어 있습니다. \n\n" + confirmText;
        }

        if((authList.auth1 && !approvers.auth1) && (authList.auth2 && !approvers.auth2)) {
            alert("결재자를 선택해 주세요.");
            return;
        }

        if(window.confirm(confirmText)) {
            localStorage.setItem("auth1", approvers.auth1);
            if(approvers.auth2) {
                localStorage.setItem("auth2", approvers.auth2);
            }
            dispatch(___setSelectedDate([]));
            alert("휴가 신청 완료!");
            close();
        }
    }

    const selectChange = (e, div) => {
        let obj = {...approvers};
        if(div === "1") {
            obj['auth1'] = e.target.value;
            setApprovers(obj);
        } else {
            obj['auth2'] = e.target.value;
            setApprovers(obj);
        }
    }

    return(
        <div className={"modal fade " + (showModal ? "show" : "")} style={{display : showModal ? "block" : "none"}}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">결재자 지정</h5>
                        <a href="#!" type="button" className="btn-close" onClick={close} aria-label="Close">Χ</a>
                    </div>
                    <div className="modal-body">
                        <div>
                            <small>전체 휴가일 : { vacaCntShow.totCnt }</small><br/>
                            <small>사용 휴가일 : { vacaCntShow.usedCnt + "(+" + useCount + ")" }</small><br/>
                            <small>남은 휴가일 : { vacaCntShow.extraCnt + "(-" + useCount + ")" }</small><br/>
                            <br/>
                            <small>선택날짜</small><br/>
                            <small 
                                style={{
                                    color: "#007bff" 
                                }}
                                dangerouslySetInnerHTML={{__html : str.replace(/\n/gi, "<br/>")}}
                            ></small>
                            
                        </div>
                        <hr></hr>
                        <div className="selects mt-4">
                            <h5>1차 결재자 지정</h5>
                            <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg"
                                onChange={(e)=> { selectChange(e, "1") }}
                                value={approvers.auth1}
                            >
                                <option value="" key="">선택안함</option>
                                {
                                    authList.auth1
                                    ? 
                                    authList.auth1.map((item) => (
                                        <option value={item.ID} key={item.ID}>
                                            {item.NM}
                                        </option>
                                    ))
                                    : <></>
                                }
                            </select>
                            {
                                authList.auth2 
                                ? <>
                                    <h5>2차 결재자 지정</h5>
                                    <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg"
                                        onChange={(e)=> { selectChange(e, "2") }}
                                        value={approvers.auth2}
                                    >
                                        <option value="" key="">선택안함</option>
                                        {
                                            authList.auth2
                                            ? 
                                            authList.auth2.map((item) => (
                                                <option value={item.ID} key={item.ID}>
                                                    {item.NM}
                                                </option>
                                            ))
                                            : <></>
                                        }
                                    </select>
                                </>
                                : <></>
                            }
                            
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


export default RequestModal;
