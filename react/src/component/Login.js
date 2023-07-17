import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navi = useNavigate(null);
    return (
        <>
            <input
                type="text"
                id="id"
                style={{ margin: '50px, auto', width: 100, height: 50 }}
                onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                        localStorage.setItem(
                            'id',
                            document.getElementById('id').value
                        );
                        navi('/main');
                    }
                }}
            />
        </>
    );
};

export default Login;
