import React, { useCallback, useRef, useState } from 'react';
import '../../resource/scss/main/Rooms.scss';
import { Link, useNavigate } from 'react-router-dom';
const Rooms = () => {
    // const [chkLog, setChkLog] = useState(false); //웹소켓 접속 여부
    // const [name, setName] = useState('');
    // const [room, setRoom] = useState('');
    // const navi = useNavigate();
    // const ws = useRef(null);
    // ws.current = new WebSocket(
    //     'ws://118.217.203.40:8181/socket/chatt?id=' + name + '&room=1'
    // );
    // const send = useCallback(() => {
    //     //웹소켓으로 메세지 전송
    //     if (!chkLog) {
    //         //웹소켓 로그인안됬을경우 (!false)

    //         setChkLog(true);
    //     }
    //     const date =
    //         (new Date().getHours() < 10
    //             ? '0' + new Date().getHours()
    //             : new Date().getHours()) +
    //         ':' +
    //         (new Date().getMinutes() < 10
    //             ? '0' + new Date().getMinutes()
    //             : new Date().getMinutes());

    //     //메세지를 data에 담아 백엔드로 JSON 객체 전송
    //     const data = {
    //         name: '123123',
    //         room: '1',
    //         date: date,
    //     }; //전송 데이터(JSON)
    //     console.log(data);
    //     const temp = JSON.stringify(data);
    //     console.log(temp);

    //     ws.current.send(temp);
    //     // ws.current.close();
    //     navi('/game/wordmatch');
    // });
    // {/* <input type="text" id="id" />
    // <button onClick={send}>방만들기</button> */}
    const list = [1, 2, 3, 4, 5];
    return (
        <div class="rooms">
            <ul>
                <Link to="/game/can" class="room">
                    그림 맞추기방 1 4/5
                </Link>
                <Link to="/game/followword" class="room">
                    끝말잇기방 1 3/4
                </Link>
                <Link to="/game/wordmatch" class="room">
                    단어 맞추기방
                </Link>
                {list.map((e) => (
                    <Link to={'/game/' + e} className="room">
                        {e}
                    </Link>
                ))}
                <li class="room"></li>
                <li class="room"></li>
            </ul>
        </div>
    );
};

export default Rooms;
