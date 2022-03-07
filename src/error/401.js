/**
 * 401.js
 * - 401 unathurized error page
 */

import { useNavigate } from "react-router-dom";


 const Error401 = () => {
    const nav = useNavigate();
    return (
        <div className="content">
            <h3>401 unauthorized</h3>
            <button onClick={()=> {
                nav('/login');
            }}>로그인 페이지로</button>
        </div>
    )
}

export default Error401;

