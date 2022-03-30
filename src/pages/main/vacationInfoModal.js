/**
 * VacationInfoModal.js
 * - The modal for vacation information
 */
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'moment/locale/ko';
import REQ from '../../common/request';
import { useSelector } from 'react-redux';


const VacationInfoModal = ({ params,  showInfoModal, setShowInfoModal, isChanged, setIsChanged }) => {
    const user = useSelector(state => (state.info));
    const close = () => {
        setIsChanged(!isChanged);
        setShowInfoModal(false);
    }

    const cancelVaca = () => {
        if(window.confirm("정말로 휴가를 취소하시겠습니까?")) {
            REQ.post({
                url: '/vacation/cancelVacation',
                params: {
                    vacaSeq: params.vacaSeq,
                    id: user.id
                },
                success: function(res) {
                    if(res.data === 0) {
                        alert("휴가 취소중 오류가 발생했습니다.");
                        return;
                    } else {
                        close();
                        alert("휴가 취소 완료!");
                    }
                }
            })
        }
    }

    return(
        <div className={"modal fade " + (showInfoModal ? "show" : "")} style={{display : showInfoModal ? "block" : "none"}}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">휴가 정보</h5>
                        <a href="#!" type="button" className="btn-close" onClick={close} aria-label="Close">Χ</a>
                    </div>
                    <div className="modal-body">
                        <small style={{display : params.isBefore ? "block" : "none", color: "red"}}>
                            ※ 현재 날짜 이전 승인된 휴가는 취소가 불가능합니다.    
                        </small>
                        <small>휴가일 : { params.date }</small><br/>
                        <small>승인 상태 : { params.state }</small><br/>
                        <small>이메일 발송 : { params.email }</small><br/>
                        <div className="selects mt-4">
                            <h5>1차 결재자</h5>
                            <input disabled value={params.apprv1 || ''}></input>
                            {
                                params.apprv2 
                                ? <>
                                    <h5>2차 결재자</h5>
                                    <input disabled value={params.apprv2 || ''}></input>
                                </>
                                : <></>
                            }
                        </div>
                        <br></br>
                        {
                            params.state && (params.state.includes("반려") || params.state.includes("부결"))
                            ?
                                <div style={{backgroundColor: "#ff00002b"}}>
                                    <h5>반려 사유</h5>
                                    <textarea style={{
                                        width: "100%",
                                        height: "80%",
                                        resize: "none"
                                    }}
                                    value={params.rejectReason || ''}
                                    disabled
                                    ></textarea>
                                </div>
                            :
                                <div>
                                    <div>
                                        <h5>휴가 사유</h5>
                                        <textarea style={{
                                            width: "100%",
                                            height: "80%",
                                            resize: "none"
                                        }}
                                        value={params.reason || ''}
                                        disabled
                                        ></textarea>
                                    </div>
                                    <div className="row">
                                        <div className='col-6'>
                                            <h5>인수인계 내용</h5>
                                            <textarea style={{
                                                width: "100%",
                                                height: "80%",
                                                resize: "none"
                                            }}
                                            value={params.handoverText || ''}
                                            disabled
                                            ></textarea>
                                        </div>
                                        <div className='col-6 mt-4'>
                                            <h5>인계 대상자</h5>
                                            <input style={{
                                                width: "100%",
                                                height: "30%"
                                            }}
                                            value={params.handoverPerson || ''}
                                            disabled
                                            ></input>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={close}>닫기</button>
                        {
                            !params.isBefore 
                            ? <button type="button" className="btn btn-primary" onClick={cancelVaca} disabled={params.isBefore}>휴가 취소</button>
                            : <></>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VacationInfoModal;
