import React from 'react';

import './index.css';

import Main from './component/main/Main';
import Tab from './component/Tab';
import './resource/scss/Section.scss';
import { Routes, Route } from 'react-router-dom';
import User from './component/userinfo/User';
import Shop from './component/shop/Shop';

import FollowWord from './component/game/followword/FollowWord';
import game from './component/game/game';
import CatchMind from './component/game/can/CatchMind';
import WordMatch from './component/game/wordmatch/WordMatch';
import SearchApp from './component/search/SearchApp';

import Login from './component/user/Login';
import Join from './component/user/Join';

const App = () => {
    return (
        <div className="wrapper">
            <Tab />
            <Routes>
                <Route path="/main" Component={Main} />
                <Route path="/user" Component={User} />
                <Route path="/shop" Component={Shop} />
                <Route path="login" Component={Login} />
                <Route path="join" Component={Join} />

                <Route path="/search" Component={SearchApp} />

                <Route path="/game/*" Component={game}>
                    <Route path="followword" Component={FollowWord} />
                    <Route path="can" Component={CatchMind} />
                    <Route path="wordmatch" Component={WordMatch} />
                </Route>
            </Routes>
        </div>
    );
};

export default App;
