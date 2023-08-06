import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../util/AuthContext';
import CustomSnackBar from '../layout/CustomSnackBar';
import '../../resource/scss/login/Login.scss';
import { BASE_URL } from '../../config/host-config';
const Login = () => {
  const redirection = useNavigate(null);

  const { onLogin, isLoggedIn } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  const [inputId, setInputId] = useState('');
  const [password, setPassword] = useState('');

  const USER = '/api';
  const REQUEST_URL = 'http://' + BASE_URL + USER + '/login';
  const GUEST_URL = 'http://' + BASE_URL + USER + '/guest';
  const JOIN_URL = 'http://' + BASE_URL + USER + '/join';

  const fetchLogin = async () => {
    // const $userId = document.getElementById('userId').value;
    // const $password = document.getElementById('password').value;
    // console.log('userId: ', $userId);
    // console.log('userPw: ', $password);
    console.log(REQUEST_URL);
    console.log('userId: ', inputId);
    console.log('password: ', password);
    const res = await fetch(REQUEST_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        userId: inputId,
        userPw: password,
      }),
    });

    if (res.status === 400) {
      const text = await res.text();
      alert(text);
      return;
    }

    const { userId } = await res.json();

    onLogin(userId);
    console.log('userId : ' + userId);
    sessionStorage.setItem('id', userId);

    redirection('/main');
  };

  const loginHandler = (e) => {
    e.preventDefault();
    fetchLogin();
  };

  const guestLogin = async () => {
    // const uuid = crypto.randomUUID();
    // const num = uuid.replace(/[^0-9]/g, '').substring(0, 4);
    const num = Math.floor(Math.random() * 8999) + 1000;
    const guestId = 'Guest_' + num;
    console.log(guestId);

    sessionStorage.setItem('id', guestId);
    sessionStorage.setItem('role', 'guest');

    // const guest = $guestId + token;
    // alert(guest);
    // onLogin(guest);

    redirection('/main');
  };

  const [sign, setSign] = useState(false);

  const signToggle = () => {
    setSign(!sign);
  };

  const fetchJoinPost = async () => {
    const $userId = document.getElementById('userId');
    const $password = document.getElementById('password');

    const res = await fetch(JOIN_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        userId: $userId.value,
        userPw: $password.value,
      }),
    });
    if (res.status === 200) {
      alert('회원가입에 성공했습니다!');
      // redirection('/login');
      setSign(!sign);
    } else {
      alert('서버와의 통신이 원할하지 않습니다.');
    }
  };

  const inputIdHandler = (e) => {
    console.log(e.target.value);
    setInputId(e.target.value);
  };

  const inputPwHandler = (e) => {
    console.log(e.target.value);
    setPassword(e.target.value);
  };

  const joinButtonClickHandler = (e) => {
    e.preventDefault();
    console.log(JOIN_URL);
    fetchJoinPost();
  };

  return (
    <>
      {!isLoggedIn && (
        <div className={`${sign && 'signinForm'} container `}>
          <div className="form signup">
            <h2>가입하기</h2>
            <div className="inputBox">
              <input type="text" required="required" id="userId" />
              <i></i>
              <span>별명</span>
            </div>
            {/* <div className="inputBox">
              <input type="text" required="required" />
              <i></i>
              <span>email address</span>
            </div> */}
            <div className="inputBox">
              <input type="password" required="required" id="password" />
              <i></i>
              <span>비밀번호 입력</span>
            </div>
            <div className="inputBox">
              <input type="password" required="required" />
              <i></i>
              <span>비밀번호 확인</span>
            </div>
            <div className="inputBox">
              <div className="registBtn Btn" onClick={joinButtonClickHandler}>
                등록
              </div>
            </div>
            <p>
              이미 회원이신가요 ?{' '}
              <a href="#" className="login" onClick={signToggle}>
                들어가기
              </a>
            </p>
          </div>

          <div className="form signin">
            <h2>안녕하세요</h2>
            <div className="inputBox">
              <input
                type="text"
                required="required"
                onChange={inputIdHandler}
              />
              <i></i>
              <span>별명</span>
            </div>
            <div className="inputBox">
              <input
                type="password"
                required="required"
                onChange={inputPwHandler}
              />
              <i></i>
              <span>비밀번호</span>
            </div>
            <div class="btn-group">
              <div className="inputBox">
                <div className="memberBtn Btn" onClick={loginHandler}>
                  회원접속
                </div>
              </div>
              <div className="inputBox guest">
                <div className="guestBtn Btn" onClick={guestLogin}>
                  손님입니다
                </div>
              </div>
            </div>
            <p>
              회원이 아니신가요 ?{' '}
              <a href="#" className="create" onClick={signToggle}>
                가입하러 가기
              </a>
            </p>
          </div>
        </div>
      )}
      <CustomSnackBar open={open} />
    </>
  );
};
export default Login;
