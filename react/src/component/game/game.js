import React from 'react';
import { Route, Routes } from 'react-router';
import FollowWord from './followword/FollowWord';
import CatchMind from './can/CatchMind';


const game = () => {
    return (
        <Routes>
            <Route path="followword" Component={FollowWord} />
            <Route path="can" Component={CatchMind} />
        </Routes>
    );
};

export default game;
