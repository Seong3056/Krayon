import React from 'react';
import { Route, Routes } from 'react-router';
import FollowWord from './followword/FollowWord';
import CatchMind from './can/CatchMind';
import A from './followword/A';


const game = () => {
    return (
        <Routes>
            <Route path="followword" Component={A} />
            <Route path="can" Component={CatchMind} />
        </Routes>
    );
};

export default game;
