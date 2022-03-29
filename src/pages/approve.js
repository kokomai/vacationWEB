/**
 * approve.js
 * - page for approve vacation
 */

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import REQ from "../common/request";

const Approve = () => {
    const user = useSelector((state)=>(state.info));
    const [requestList, setRequestList] = useState([]);
    const [seq, setSeq] = useState("");
    const [requesterId, setRequesterId] = useState("");
    const [rejectRequester, setRejectRequester] = useState("");
    const [rejectDate, setRejectDate] = useState("");
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [refresh, setRefresh] = useState(false);


    useEffect(() => {
        REQ.post({
            url: "/vacation/getApproveList",
            params: {
                id: user.id,
                auth: user.auth
            },
            success: function(res) {
                setRequestList(res.data);
            }
        })
    }, [user, showRejectModal, refresh]);

    useEffect(()=> {
    }, [requestList]);

    const reject = () => {
        if(window.confirm("정말 휴가를 반려하시겠습니까?")) {
            REQ.post({
                url: '/vacation/rejectVacation',
                params: {
                    vacaSeq : seq,
                    reason : rejectReason
                },
                success: function(res) {
                    if(res.data === 0) {
                        alert("휴가 반려에 실패했습니다.");
                    } else {
                        alert("휴가 반려 성공!");
                        close();
                    }
                }
            })
        }
    }

    const approve = () => {
        if(window.confirm("정말 휴가를 승인하시겠습니까?")) {
            REQ.post({
                url: '/vacation/approveVacation',
                params: {
                    vacaSeq : seq,
                    id: user.id,
                    requesterId : requesterId
                },
                success: function(res) {
                    console.log(res);
                    if(res.data === 0) {
                        alert("휴가 승인에 실패했습니다.");
                    } else {
                        alert("휴가 승인 성공!");
                        setRefresh(!refresh);
                    }
                }
            })
        }
    }

    const close = () => {
        setRejectDate("");
        setRejectReason("");
        setRejectRequester("");
        setSeq("");
        setShowRejectModal(false);
    }

    return (
        <div className="content">
            <h3>요청된 휴가 목록</h3>
            {
                requestList && requestList.length > 0 
                ? requestList.map((item) => (
                    <div className="card m-3" key={item.VACA_SEQ}>
                    <div className="card-block mt-3 ml-3 mr-1">
                        <h4>{item.REQUESTER}</h4>
                        <small>{'신청번호 : ' + item.VACA_SEQ }</small>
                        <hr></hr>
                        <h6 className="card-subtitle text-muted mb-1"
                        >{
                            item.VACA_DATES.split('/').map((item) => (
                                <div key={item}>
                                    {item}
                                </div>
                            ))
                        }</h6>
                        <hr></hr>
                        <small>
                            남은 휴가 일수 : {item.EXTRA_COUNT}<br></br>
                            요청 휴가 일수 : {item.USE_CNT} <br></br>
                            승인 후 휴가 일수 : {item.AFTER_CNT}
                        </small>
                        <hr></hr>
                        <p className="card-text">사유 : {item.REASON}</p>
                        <hr></hr>
                        <p className="card-text">
                            인수인계 : {item.VACA_INSU} <br></br> 
                            인수자 : {item.VACA_INSU_UPMU}
                        </p>
                        <div className="modal-footer"> 
                            <button type="button" className="btn btn-danger" onClick={(e)=> {
                                setSeq(item.VACA_SEQ);
                                setRejectRequester(item.REQUESTER);
                                setRejectDate(item.VACA_DATES);
                                setShowRejectModal(true);
                            }} >반려</button>
                            <button type="button" className="btn btn-primary" onClick={(e)=> {
                                console.log(item);
                                setSeq(item.VACA_SEQ);
                                setRequesterId(item.REQUESTER_ID);
                                approve();
                            }}>승인</button>
                        </div>
                    </div>
                </div>
                ))
                :<><span>요청된 휴가가 없습니다..</span></> 
            }
            <div className={"modal fade " + (showRejectModal ? "show" : "")} style={{display : showRejectModal ? "block" : "none"}}>
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">반려 사유 입력</h5>
                            <a href="#!" type="button" className="btn-close" onClick={close} aria-label="Close">Χ</a>
                        </div>
                        <div className="modal-body">
                        <div>
                            <small>신청자 : { rejectRequester }</small><br/>
                            <small>휴가 날짜 : { rejectDate }</small><br/>
                        </div>
                        <hr></hr>
                        <div>
                            <textarea style={{
                                width: "100%",
                                height: "80%",
                                resize: "none"
                            }}
                            value={rejectReason}
                            onChange={(e)=> {setRejectReason(e.target.value)}}
                            ></textarea>
                        </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={close}>닫기</button>
                            <button type="button" className="btn btn-danger" onClick={reject}>휴가 반려</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Approve;

