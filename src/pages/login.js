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

    const authTest = () => {
        REQ.post({
            url: "/holidayApi/getHoliday",
            params: {
                month: "03",
                year: "2022"
            },
            success: function(res) {
                console.log(res);
            }
        });
    }
    return (
        <div className="content container">
            <div>
                <h3>로그인</h3>
                <div className="justify-content-center">
                    ID:<input type="text" className="row" onInput={(e) => {
                        setId(e.target.value);
                    }} onKeyDown={(e) => {
                        if(e.code === "Enter") {
                            login();
                        }
                    }}></input>
                    PW:<input type="password" className="row" onInput={(e) => {
                        setPw(e.target.value);   
                    }} onKeyDown={(e) => {
                        if(e.code === "Enter") {
                            login();
                        }
                    }}></input>
                    
                    <Button variant="primary" className="row" onClick={()=>{
                        login();
                    }}>로그인</Button>
                    <div>
                        <Button variant="danger" className="row" onClick={()=>{
                            authTest();
                        }}>권한 테스트</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
