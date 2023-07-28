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

const Login = () => {
    const redirection = useNavigate(null);

    const { onLogin, isLoggedIn } = useContext(AuthContext);

    const [open, setOpen] = useState(false);

    const BASE = 'http://localhost/:8181';
    const USER = '/api';
    const REQUEST_URL = BASE + USER + '/login';
    const GUEST_URL = BASE + USER + '/guest';

    const fetchLogin = async () => {
        const $userId = document.getElementById('userId');
        const $password = document.getElementById('password');
        console.log(REQUEST_URL);
        const res = await fetch(REQUEST_URL, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                userId: $userId.value,
                userPw: $password.value,
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

        redirection('/');
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

        // const guest = $guestId + token;
        // alert(guest);
        // onLogin(guest);

        redirection('/');
    };

    return (
        <>
            {!isLoggedIn && (
                <Container
                    component="main"
                    maxWidth="xs"
                    style={{ margin: '200px auto' }}
                >
                    <form noValidate onSubmit={loginHandler}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="userId"
                                    label="아이디를 적으세요"
                                    name="userId"
                                    autoComplete="userId"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="비밀번호를 적으세요"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                >
                                    로그인
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    href="/join"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                >
                                    회원가입
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            id="guestId"
                            variant="contained"
                            color="primary"
                            onClick={guestLogin}
                        >
                            게스트로 로그인
                        </Button>
                    </Grid>
                </Container>
            )}
            <CustomSnackBar open={open} />
        </>
    );
};
export default Login;
