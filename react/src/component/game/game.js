import React from 'react';
import { Route, Routes } from 'react-router';
import CatchMind from './can/CatchMind';
import FollowWord from './followword/FollowWord';


const game = () => {
    return (
        <Routes>
            <Route path="followword" Component={FollowWord} />
            <Route path="can" Component={CatchMind} />
        </Routes>
    );
};

export default game;
