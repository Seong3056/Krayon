import React, { useEffect } from 'react';
import WordQuiz from './WordQuiz';
import WMPlayer from './WMPlayer';

import '../../../resource/scss/game/wordmatch/WordMatch.scss';

const WordMatch = () => {
    const ws = useEffect(() => {}, []);

    return (
        <div className="wrapper">
            <WordQuiz />
            <WMPlayer />
        </div>
    );
};

export default WordMatch;
