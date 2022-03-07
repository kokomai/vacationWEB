/**
 * header.js
 * - header layout
 */

import { useNavigate } from "react-router-dom";


const Header = () => {
    const nav = useNavigate();
    return (
        <div>
            <header>
                <h1>Foresys 휴가 관리</h1>
                <nav>
                    <a onClick={()=> {
                        nav("/")
                    }}>메인</a>
                    <a onClick={()=> {
                        nav("/myPage")
                    }}>내정보</a>
                    
                </nav>
            </header>
        </div>
    );
}

export default Header;

