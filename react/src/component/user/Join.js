import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Grid, TextField, Typography, Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../util/AuthContext'
import CustomSnackBar from '../layout/CustomSnackBar'

const Join = () => {

  const redirection = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
      if(isLoggedIn) {
          setOpen(true);
          setTimeout(() => {
            redirection('/');
          }, 3000);
    }
  }, [isLoggedIn, redirection]);

  const BASE = 'http://localhost:8181';
  const USER = '/api';
  const API_BASE_URL = BASE + USER + '/join';

  const [userValue, setUserValue] = useState({
      userId: '',
      password: ''
  });

  const [message, setMessage] = useState({
      userId: '',
      password: '',
      passwordCheck: ''
  });

  const [correct, setCorrect] = useState({
      userId: false,
      password: false,
      passwordCheck: false
  });

  const saveInputState = ({key, inputVal, flag, msg}) => {
    inputVal !== 'pass' && setUserValue({
        ...userValue,
        [key]: inputVal
    });

    setMessage({
        ...message,
        [key]: msg
    });

    setCorrect({
        ...correct,
        [key]: flag
    });
  }

  const userIdHandler = e => {
      const userIdRegex = /^[a-z]+[a-z0-9]{5,10}$/g;
      const inputVal = e.target.value;

      let msg;
      let flag = false;

      if(!inputVal) {
          msg = '아이디는 필수입니다.'
      } else if(!userIdRegex.test(inputVal)) {
          msg = '5글자 이상의 영어로 작성하세요!'
      } else {
          msg = '사용 가능한 아이디입니다.';
          flag = true;
      }

      saveInputState({
          key: 'userId',
          inputVal,
          msg,
          flag
      });
  };

  const passwordHandler = e => {
      document.getElementById('password-check').value = '';
      document.getElementById('check-span').textContent = '';

      setMessage({...message, passwordCheck: ''});
      setCorrect({...correct, passwordCheck: false});

      const inputVal = e.target.value;
      const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/;

      let msg, flag = false;
      if(!inputVal) {
          msg = '비밀번호는 필수입니다.';
      } else if(!pwRegex.test(inputVal)) {
          msg = '8글자 이상의 영문, 숫자, 특수문자를 포함해 주세요.';
      } else {
          msg = '사용가능한 비밀번호입니다.';
          flag = true;
      }

      saveInputState({
          key: 'password',
          inputVal,
          msg,
          flag
      });
  };

  const pwCheckHandler = e => {
      let msg, flag = false;
      if(!e.target.value) {
          msg = '비밀번호 확인란은 필수입니다.';
      } else if(userValue.password !== e.target.value) {
          msg = '패스워드가 일치하지 않습니다.';
      } else {
          msg = '패스워드가 일치합니다.';
          flag = true;
      }

      saveInputState({
          key: 'passwordCheck',
          inputVal: 'pass',
          msg,
          flag
      });
  };

  const isValid = () => {
      for(const key in correct) {
          const flag = correct[key];
          if(!flag) return false;
      }
      return true;
  };

  const fetchJoinPost = async() => {
      
      const $userId = document.getElementById('userId');
      const $password = document.getElementById('password');

      const res = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'content-type' : 'application/json' },
          body: JSON.stringify({
            userId: $userId.value,
            userPw: $password.value
          })
      });
      if(res.status === 200) {
          alert('회원가입에 성공했습니다!');
          redirection('/login');
      } else {
          alert('서버와의 통신이 원할하지 않습니다.');
      }
  }

  const joinButtonClickHandler = e => {
      e.preventDefault();

      if(isValid()) {
          fetchJoinPost();
      } else {
          alert('입력란을 다시 확인해 주세요!');
      }
  }

  return (
    <>
      {!isLoggedIn &&
        <Container component="main" maxWidth="xs" style={{ margin: "200px auto"}}>
          <form noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="h1" variant="h5">
                  계정 생성
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  autoComplete="fId"
                  name="userId"
                  variant="outlined"
                  required
                  fullWidth
                  id="userId"
                  label="유저 아이디"
                  autoFocus
                  onChange={userIdHandler}
                />
                <span style={
                  correct.userId
                  ? {color : 'green'}
                  : {color : 'red'}
                }>{message.userId}</span>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="패스워드"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={passwordHandler}
                />
                <span style={
                  correct.password
                  ? {color : 'green'}
                  : {color : 'red'}
                }>{message.password}</span>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password-check"
                  label="패스워드 확인"
                  type="password"
                  id="password-check"
                  autoComplete="check-password"
                  onChange={pwCheckHandler}
                />
                <span id='check-span' style={
                  correct.passwordCheck
                  ? {color : 'green' }
                  : {color : 'red'}
                }>{message.passwordCheck}</span>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  style={{background: '#38d9a9'}}
                  onClick={joinButtonClickHandler}
                >
                  계정 생성
                </Button>
              </Grid>
            </Grid>
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  이미 계정이 있습니까? 로그인 하세요.
                </Link>
              </Grid>
            </Grid>
          </form>
        </Container>
      }
      <CustomSnackBar
        open={open}
      />
    </>
  )
}

export default Join