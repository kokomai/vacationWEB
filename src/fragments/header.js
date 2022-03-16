/**
 * header.js
 * - header layout
 */

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const Header = () => {
    const nav = useNavigate();
    const user = useSelector(state => (state.info));


    return (
        <div>
            <header>
                <h1>Foresys 휴가 관리</h1>
                <div className="row ml-2 mr-2">
                    <div className="col-">
                        <nav>
                            <a href="#!" onClick={()=> {
                                nav("/")
                            }}>메인</a>
                        </nav>
                    </div>
                    
                    {
                        user.auth !== "C04" 
                        ? <div className="col-">
                            <nav>
                                <a href="#!" onClick={()=> {
                                    nav("/approve")
                                }}>휴가승인</a>
                            </nav>
                        </div>
                        : <></>
                    }
                </div>
            </header>
        </div>
    );
}

export default Header;

