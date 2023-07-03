import React from 'react';

import './index.css';

import Main from './component/main/Main';
import Tab from './component/Tab';
import './resource/scss/Section.scss';
import { Routes, Route } from 'react-router-dom';
import User from './component/userinfo/User';
import Shop from './component/shop/Shop';
const App = () => {
    return (
        <div className="section">
            <Tab />
            <Routes>
                <Route path="/" Component={Main} />
                <Route path="/user" Component={User} />
                <Route path="/shop" Component={Shop} />
            </Routes>
        </div>
    );
};

export default App;
