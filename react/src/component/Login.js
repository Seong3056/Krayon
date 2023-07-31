import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../resource/scss/userinfo/login.scss';

const Login = () => {
  const navi = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);

  const handleSignInClick = (e) => {
    e.preventDefault();
    setIsSignIn(true);
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    setIsSignIn(false);
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      const id = document.getElementById('id').value;
      sessionStorage.setItem('id', id);
      navi('/main');
    }
  };

  return (
    <div className="ys-style">
      <div className={`container ${isSignIn ? '' : 'signinForm'}`}>
        <div className={`form ${isSignIn ? 'signup' : 'signin'}`}>
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
            <input type="submit" value="Create Account" />
          </div>
          <p>
            Already a member ?{' '}
            <a href="#" className="login" onClick={handleSignInClick}>
              Log in
            </a>
          </p>
        </div>

        <div className={`form ${isSignIn ? 'signin' : 'signup'}`}>
          <h2>Sign In</h2>
          <div className="inputBox">
            <input
              type="text"
              id="id"
              required="required"
              onKeyDown={handleKeyPress}
            />
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
            Not Registered ?{' '}
            <a href="#" className="create" onClick={handleSignUpClick}>
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
