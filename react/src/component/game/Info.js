import React from 'react';
import '../../resource/scss/gametest/followword/Info.scss';

const Info = ({ sendStart }) => {
    return (
        <div className="info">
            <div className="score">점수</div>
            <div className="myInfo">채팅창</div>
            <div className="ready" onClick={sendStart}>
                게임시작
            </div>
            <div className="menu">나가기</div>
        </div>
    );
};

export default Info;
