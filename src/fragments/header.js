/**
 * header.js
 * - header layout
 */

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ___addInfo, ___setSelectedDate } from "../actions/actions";


const Header = () => {
    const nav = useNavigate();
    const user = useSelector(state => (state.info));
    const dispatch = useDispatch();

    return (
        <div>
            <header>
                <h1>Foresys 휴가 관리</h1>
        {
            user.auth
            ? 
                <div className="d-flex" style={{height: "30%"}}>
                    <div className="p-2">
                        <nav>
                            <a href="#!" onClick={()=> {
                                nav("/")
                            }}>휴가신청</a>
                        </nav>
                    </div>
                    {
                        user.auth && user.auth !== "C04" 
                        ? <div className="p-2">
                            <nav>
                                <a href="#!" onClick={()=> {
                                    nav("/approve")
                                }}>휴가승인</a>
                            </nav>
                        </div>
                        : <></>
                    }
                    
                            <div className="ml-auto p-2">
                                <nav className="">
                                    <button className="btn-secondary btn-sm" 
                                    onClick={()=> {
                                        dispatch(___addInfo({}));
                                        dispatch(___setSelectedDate([]));
                                        nav("/")
                                    }}>로그아웃</button>
                                </nav>
                            </div>
                        
                </div>
            : <></>
        }
        </header>
        </div>
    );
}

export default Header;

