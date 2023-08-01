import React, { useEffect, useState } from 'react';
import '../../../resource/scss/gametest/followword/Info.scss';
import Chat from '../../main/Chat';

const CanInfo = ({ gameStart, turn, textData }) => {
    const [turnState, setTurnState] = useState(true);
    useEffect(() => {
        if (turn !== undefined) setTurnState(turn);
        console.log('아악' + turnState);
    }, [turn]);

    return (
        <div className="info">
            <div className="score">점수</div>
            <div className="myInfo">
                <Chat textData={textData} />
            </div>
            {!turn ? (
                <div className="ready" onClick={gameStart}>
                    게임시작
                </div>
            ) : (
                <p>게임이 진행중</p>
            )}
            <div className="menu">나가기</div>
        </div>
    );
};

export default CanInfo;
