import React from 'react';

import './index.css';

import Main from './component/main/Main';
import Tab from './component/Tab';
import './resource/scss/Section.scss';
import { Routes, Route } from 'react-router-dom';
const App = () => {
    return (
        <div className="section">
            <Tab />
            <Main />
            {/* <Routes>
                <Route path="/" Component={Main} />
            </Routes> */}
        </div>
    );
};

export default App;
