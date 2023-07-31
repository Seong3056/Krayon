import React, { useEffect, useState } from 'react';
import '../../resource/scss/gametest/followword/Info.scss';
import Chat from '../main/Chat';

const Info = ({ sendStart, textData, p }) => {
    const [point, setPoint] = useState([]);
    const [sortPoint, setSortPoint] = useState([]);
    useEffect(() => {
        console.log(p);
        // if (p !== undefined)
        // p.map(e=>{
        //     if(e.name === )
        // })
        //     point.map((e) => {
        //         if (e.name === p.name) {
        if (p !== undefined) setPoint(p);
        //     }
        // });
    }, [p]);
    useEffect(() => {
        console.log(point);
        for (var i = 0; i < point.length; i++) {
            for (var j = i + 1; j < point.length; j++) {
                if (point[i].point < point[j].point) {
                    var temp = point[i];
                    point[i] = point[j];
                    point[j] = temp;
                }
            }
        }
    }, [point]);

    return (
        <div className="info">
            <div className="score">
                <div className="title">점수판</div>

                {point.map((e) => (
                    <div className="user-score">
                        <div className="name">{e.name}:</div>
                        <div className="point"> {e.point}</div>
                    </div>
                ))}
            </div>
            <div className="myInfo">
                <Chat textData={textData} />
            </div>
            <div className="ready" onClick={sendStart}>
                게임시작
            </div>
            <div className="menu">나가기</div>
        </div>
    );
};

export default Info;