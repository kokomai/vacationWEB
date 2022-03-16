/**
 * VacationInfoModal.js
 * - The modal for vacation information
 */
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'moment/locale/ko';


const VacationInfoModal = ({ params,  showInfoModal, setShowInfoModal }) => {
    const close = () => {
        setShowInfoModal(false);
    }

    const cancelVaca = () => {
        close();        
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
                            <input disabled value={params.apprv1}></input>
                            {
                                params.apprv2 
                                ? <>
                                    <h5>2차 결재자</h5>
                                    <input disabled value={params.apprv2}></input>
                                </>
                                : <></>
                            }
                        </div>
                        
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
