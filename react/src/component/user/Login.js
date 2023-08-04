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

const Login = () => {
    const redirection = useNavigate(null);

    const { onLogin, isLoggedIn } = useContext(AuthContext);

    const [open, setOpen] = useState(false);

    const BASE = 'http://localhost:8181';
    const USER = '/api';
    const REQUEST_URL = BASE + USER + '/login';
    const GUEST_URL = 'http://' + BASE + USER + '/guest';

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

        redirection('/main');
    };

    const loginHandler = (e) => {
        e.preventDefault();
        console.log('click');
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

    return (
        <>
            {!isLoggedIn && (
                <div className={`${sign && 'signinForm'} container `}>
                    <div className="form signup">
                        <h2>Sign Up</h2>
                        <div className="inputBox">
                            <input type="text" required="required" />
                            <i></i>
                            <span>username</span>
                        </div>
                        <div className="inputBox">
                            <input type="text" required="required" />
                            <i></i>
                            <span>email address</span>
                        </div>
                        <div className="inputBox">
                            <input type="password" required="required" />
                            <i></i>
                            <span>create password</span>
                        </div>
                        <div className="inputBox">
                            <input type="password" required="required" />
                            <i></i>
                            <span>confirm password</span>
                        </div>
                        <div className="inputBox">
                            <button
                                type="submit"
                                value="Create Account"
                                onClick={loginHandler}
                            />
                        </div>
                        <p>
                            Already a member ?{' '}
                            <a href="#" className="login" onClick={signToggle}>
                                Log in
                            </a>
                        </p>
                    </div>

                    <div className="form signin">
                        <h2>Sign In</h2>
                        <div className="inputBox">
                            <input type="text" required="required" />
                            <i></i>
                            <span>username</span>
                        </div>
                        <div className="inputBox">
                            <input type="password" required="required" />
                            <i></i>
                            <span>password</span>
                        </div>
                        <div className="inputBox">
                            <input type="submit" value="Login" />
                        </div>
                        <p>
                            Not Registrated ?{' '}
                            <a href="#" className="create" onClick={signToggle}>
                                Create an account
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
