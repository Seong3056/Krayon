import React, { useEffect, useState } from 'react';
import '../../../resource/scss/gametest/followword/Info.scss';

const CanInfo = ({ gameStart, turn }) => {
    const [turnState, setTurnState] = useState(true);
    useEffect(() => {
      if(turn!==undefined)
      setTurnState(turn);
      console.log("아악"+turnState);
    }, [turn])
    
    return (
        <div className="info">
            <div className="score">점수</div>
            <div className="myInfo">채팅창</div>
            {!turn ?(<div className="ready" onClick={gameStart}>
                게임시작
            </div>):(<p>게임이 진행중</p>)}
            <div className="menu">나가기</div>
        </div>
    );
};

export default CanInfo;
