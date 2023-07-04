import React from 'react';
import { Route, Routes } from 'react-router';
import FollowWord from './followword/FollowWord';
import CatchMind from './catchmind/CatchMind';

const game = () => {
    return (
        <Routes>
            <Route path="followword" Component={FollowWord} />
            <Route path="catchmind" Component={CatchMind} />
        </Routes>
    );
};

export default game;
