/**
 * 통신 axios 관련 함수
 * @author : 김현우
 * All copyright reserved by foresys
 */
import axios from "axios";

const REQ = {
	// loading 함수 정의
	loading : function(boo) {
		console.log("loading ::: " + boo);
	},
    // refresh token 가져오기(sessionStorage)
    getRToken : function() {
        return sessionStorage.getItem("rToken");
    },
    // refresh token 셋팅(sessionStorage)
    setRToken : function(tokn) {
        sessionStorage.setItem("rToken", tokn);
    },
    // refresh token 삭제(sessionStorage)
    delRToken : function() {
        sessionStorage.removeItem("rToken");
    },
    // access token 가져오기(sessionStorage)
    getAToken : function() {
        return sessionStorage.getItem("aToken");
    },
    // access token 셋팅(sessionStorage)
    setAToken : function(tokn) {
        sessionStorage.setItem("aToken", tokn);
    },
    // access token 삭제(sessionStorage)
    delAToken : function() {
        sessionStorage.removeItem("aToken");
    },
    // token 헤더값 설정
    tokenHeader : function(xhr) {
        let rToken = REQ.getRToken();
        let aToken = REQ.getAToken();
		
		return {
			"Content-type": "application/json",
			"X-AUTH-RTOKEN": rToken,
			"X-AUTH-ATOKEN": aToken
		}
    },
    // get axios
	/*
		options : {
			url : 요청 url
			params : 전달할 파라미터 ({})
			success : 성공시 호출할 콜백 함수
			error : 에러시 호출할 콜백 함수
			noLoading : true
				-> true 설정시, loading 없이 호출
			keepLoading : true 
				-> 여러번 비동기로 호출 시 앞서 호출한 axios가 loading을 가리지 않게 하기 
		}
	*/
    get : function(options) {
		let url = "";
		let params = {};
		let successF = function(res) {
			console.log(res);
		};
		let errorF = function(res) {
			console.error(res);
		};
		let isLoading = true;
		let isHideLoading = true;
		
		if(typeof options === "object") {
			if(options.url) {
				url = options.url
			}
			if(options.params) {
				params = options.params
			}
			if(options.success) {
				successF = options.success
			}
			if(options.error) {
				errorF = options.error
			}
			if(options.noLoading) {
				isLoading = !options.noLoading
			}
			if(options.keepLoading) {
				isHideLoading = !options.keepLoading
			}
		}
		
		if(isLoading) {
			REQ.loading();
		}
		
        try {
            return new Promise((resolve, reject) => {
				let config = {
					headers : REQ.tokenHeader()
				}

				axios.get(url, params, config)
				.then(function(res, stat, req) {
					REQ.setAToken(req.getResponseHeader('X-AUTH-ATOKEN'));
					successF(res, stat, req);
					resolve(res, stat, req);

					if(isHideLoading) {
						REQ.loading(false);	
					}
				})
				.catch(function(e) {
					if(e.response.status === 401) {
						window.location.href = "/401";
					}

					errorF(e);
					reject(e);

					if(isHideLoading) {
						REQ.loading(false);	
					}
				}); 
            });
        } catch(e) {
            console.error(e);
        }
    },
    // post axios
	/*
		options : {
			url : 요청 url
			params : 전달할 파라미터 ({})
			success : 성공시 호출할 콜백 함수
			error : 에러시 호출할 콜백 함수
			noLoading : true
				-> true 설정시, loading 없이 호출
			keepLoading : true 
				-> 여러번 비동기로 호출 시 앞서 호출한 axios가 loading을 가리지 않게 하기
		}
	*/
    post : function(options) {
		let url = "";
		let params = {};
		let successF = function(res) {
			console.log(res);
		};
		let errorF = function(res) {
			console.error(res);
		};
		let isLoading = true;
		let isHideLoading = true;
		
		if(typeof options === "object") {
			if(options.url) {
				url = options.url
			}
			if(options.params) {
				params = options.params
			}
			if(options.success) {
				successF = options.success
			}
			if(options.error) {
				errorF = options.error
			}
			if(options.noLoading) {
				isLoading = !options.noLoading
			}
			if(options.keepLoading) {
				isHideLoading = !options.keepLoading
			}
		}
		
		if(isLoading) {
			REQ.loading();
		}
        try {
            return new Promise((resolve, reject) => {
                let config = {
					headers : REQ.tokenHeader()
				}

				axios.post(url, params, config)
				.then(function(res) {
					
					REQ.setAToken(res.headers["x-auth-atoken"]);
					successF(res);
					resolve(res);

					if(isHideLoading) {
						REQ.loading(false);	
					}
				})
				.catch(function(e) {
					if(e.response.status === 401) {
						window.location.href = "/401";
					}

					errorF(e);
					reject(e);

					if(isHideLoading) {
						REQ.loading(false);	
					}
				}); 
            });
        } catch(e) {
            console.error(e);
        }
    },
}

export default REQ;