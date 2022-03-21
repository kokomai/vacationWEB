/**
 * login.js
 * - Login page
 */
import { useState } from 'react';
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ___addInfo } from '../actions/actions'
import REQ from '../common/request';

const Login = () => {
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    const nav = useNavigate();
    const dispatch = useDispatch();
    
    const login = () => {

        REQ.post({
            url : "/login/loginCheck",
            params : {
                id : id,
                password : pw
            },
            success: function(res) {
                REQ.setAToken(res.headers["x-auth-atoken"]);
                REQ.setRToken(res.headers["x-auth-rtoken"]);
                dispatch(___addInfo(
                    {   
                        id: res.data.id, 
                        name: res.data.name,
                        department : res.data.department,
                        auth : res.data.auth
                    }));
                nav("/");
            },
            error: function(res) {
                if(res.response.status === 403) {
                    alert("회원 정보가 없거나 비밀번호가 틀립니다.");
                };
            }
        });
    }

    return (
        <div className="content mt-5">
            <div>
                <h3>로그인</h3>
                <div className="row m-3">
                    <div className='col-'>
                        ID:<br></br><input type="text" onInput={(e) => {
                            setId(e.target.value);
                        }} onKeyDown={(e) => {
                            if(e.code === "Enter") {
                                login();
                            }
                        }}></input><br></br>
                        PW:<br></br><input type="password" onInput={(e) => {
                            setPw(e.target.value);   
                        }} onKeyDown={(e) => {
                            if(e.code === "Enter") {
                                login();
                            }
                        }}></input>
                    </div>
                    <div className='col- mt-3 ml-2'>
                        <Button variant="primary" 
                        style={{
                            width: "100%",
                            height: "100%"
                        }}
                        onClick={()=>{
                            login();
                        }}>로그인</Button>
                    </div>
                    
                    
                </div>
            </div>
        </div>
    )
}

export default Login;
