import React, { useEffect, useState } from 'react'

const AuthContext = React.createContext({
    isLoggedIn : false,
    userId: '',
    onLogout: () => {},
    onLogin: (userId, password) => {},
    setUserInfo: () => {}
});


export const AuthContextProvider = props => {
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        if(localStorage.getItem('isLoggedIn') === '1') {
            setIsLoggedIn(true);
            setUserId(localStorage.getItem('LOGIN_USERID'));
        }
    }, []);

    const logoutHandler = () => {
        localStorage.clear();
        setIsLoggedIn(false);
    };

    const loginHandler = (token, userId) => {
        localStorage.setItem('isLoggedIn', '1');
        localStorage.setItem('ACCESS_TOKEN', token);
        localStorage.setItem('LOGIN_UESRID', userId);
        setIsLoggedIn(true);
        setUserId(userId);
    };

    const setLoginUserInfo = ({ token,userId }) => {
        localStorage.setItem('ACCESS_TOKEN', token);
        localStorage.setItem('LOGIN_USERID', userId);
    }

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            userId,
            onLogout: logoutHandler,
            onLogin: loginHandler,
            setUserInfo: setLoginUserInfo
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext