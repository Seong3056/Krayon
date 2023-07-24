import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../resource/scss/login/Login.scss';

const Login = () => {
    const navi = useNavigate(null);
    return (
        <>
            <div className="login-container">
                <h2>Login</h2>
                <div class="form-group">
                    <label for="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="id"
                        required
                        onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                                sessionStorage.setItem(
                                    'id',
                                    document.getElementById('username').value
                                );
                                navi('/main');
                            }
                        }}
                    />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="password"
                        required
                    />
                </div>
                <div className="form-group">
                    <button type="submit">Login</button>
                </div>
            </div>
        </>
        // <>
        //     <input
        //         type="text"
        //         id="id"
        //         style={{ margin: '50px, auto', width: 100, height: 50 }}
        //         onKeyDown={(e) => {
        //             if (e.keyCode === 13) {
        //                 sessionStorage.setItem(
        //                     'id',
        //                     document.getElementById('id').value
        //                 );
        //                 navi('/main');
        //             }
        //         }}
        //     />
        // </>
    );
};

export default Login;
