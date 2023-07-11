import React from 'react';
import { Route, Routes } from 'react-router';
import CatchMind from './can/CatchMind';
import FollowWord from './followword/FollowWord';
import WordMatch from './wordmatch/WordMatch';



const game = () => {
    return (
        <Routes>
            <Route path="followword" Component={FollowWord} />
            <Route path="can" Component={CatchMind} />
            <Route path='wordmatch' Component={WordMatch} />
        </Routes>
    );
};

export default game;
