import './App.css';
import './bootstrap.min.css';
import './bootstrap.min.css.map';
import Header from './fragments/header';
import Footer from './fragments/footer';
import Main from './pages/main';
import Detail from './pages/detail';
import Login from './pages/login';
import Error404 from './error/404';
import Error401 from './error/401';
import RequestVacation from './pages/request-vacation';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector, connect } from 'react-redux';
import { useEffect } from 'react';

function App() {
  return (
    <>
        <Header></Header>
        <Routes>
          <Route path="/" element={ <RequireAuth><Main/></RequireAuth> }></Route>
          <Route path="/404" element={ <Error404 />}></Route>
          <Route path="/401" element={ <Error401 />}></Route>
          <Route path="/login" element={ <Login />}></Route>
          <Route path="/request" element={ <RequireAuth></RequireAuth> }></Route>
          <Route path="/detail" element={ <Detail/> }></Route>
          <Route path="*" element={ <Error404 />}></Route>
        </Routes>
        <Footer></Footer>
    </>
  );
}

function RequireAuth({children}) {
  const info = useSelector(state => (state.info));
  let auth = info;
  let location = useLocation();

  if(Object.keys(auth).length === 0) {
    return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
  }

  return children;
}

export default App;
