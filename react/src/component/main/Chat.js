import React, { useCallback, useRef, useState, useEffect } from 'react';

import '../../resource/scss/main/Chatting.scss';
const Chat = ({ ws, textData, send }) => {
    const [msg, setMsg] = useState(''); //메세지
    const [name, setName] = useState(''); //전송자
    const [chatt, setChatt] = useState([]); //웹소켓 수신 데이터들 [] 배열
    const [chkLog, setChkLog] = useState(false); //웹소켓 접속 여부
    // const [socketData, setSocketData] = useState(); //웹소켓 수신 메세지 {name, msg, date}
    const [list, setList] = useState([]);
    console.log(textData);
    let id = '';
    // const ws = useRef(null); //webSocket을 담는 변수,
    //컴포넌트가 변경될 때 객체가 유지되어야하므로 'ref'로 저장

    const msgBox = chatt.map(
        //웹소켓에서 받은 데이터를 채팅창에 전송
        (item, idx) => (
            <div key={idx} className={item.name === name ? 'me ' : 'other '}>
                [ {item.date} ]
                <span>
                    <b> {item.date === '시스템' ? '' : item.name + ':'} </b>
                </span>{' '}
                <span>{item.msg}</span>
            </div>
        )
    );

    useEffect(() => {
        if (textData !== undefined) {
            const tempData = chatt.concat(textData);
            console.log(tempData);
            setChatt(tempData);
        }

        const windowH = document.querySelector('.in-chat').scrollHeight;
        document.querySelector('.in-chat').scrollTop = windowH - 160;
    }, [textData, list]); //socketData가 바뀔때마다

    //webSocket
    //webSocket
    //webSocket
    //webSocket
    //webSocket
    //webSocket
    const onText = (event) => {
        console.log(event.target.value);
        setMsg(event.target.value);
    };

    // const webSocketLogin = useCallback(() => {
    //     id = '123';
    //     ws.current = new WebSocket(
    //         'ws://118.217.203.40:8181/socket/chatt?id=' + id + '&room=1'
    //     );
    //     console.log('웹소켓 접속11');

    //     ws.current.onmessage = (message) => {
    //         //웹소켓에서 전송한 데이터를 수신 및 객체 저장
    //         console.log('웹소켓 수신 데이터: ' + message.data);
    //         const dataSet = JSON.parse(message.data);
    //         const data = {
    //             name: dataSet.name,
    //             date: dataSet.date,
    //             msg: dataSet.msg,
    //         };
    //         console.log('11111111111 ' + dataSet.list);
    //         if (dataSet.list !== undefined) {
    //             console.log('진입');
    //             console.log(dataSet.list);

    //             setList(dataSet.list);
    //         }
    //         setSocketData(data);
    //     };
    // });

    // const send = useCallback(() => {

    //     //웹소켓으로 메세지 전송
    //     if (!chkLog) {
    //         //웹소켓 로그인안됬을경우 (!false)
    //         if (id === '') {
    //             alert('이름을 입력하세요.');
    //             document.getElementById('id').focus();
    //             return;
    //         }
    //         // webSocketLogin();
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

    //     if (msg !== '') {
    //         //메세지를 data에 담아 백엔드로 JSON 객체 전송
    //         const data = {
    //             name: id,
    //             msg: msg,
    //             date: date,
    //         }; //전송 데이터(JSON)

    //         const temp = JSON.stringify(data);

    //         // if (ws.current.readyState === 0) {
    //         //     //readyState는 웹 소켓 연결 상태를 나타냄
    //         //     ws.current.onopen = () => {
    //         //         //webSocket이 맺어지고 난 후, 실행
    //         //         console.log(ws.current.readyState);
    //         //         ws.current.send(temp);
    //         //     };
    //         // } else {
    //         ws.send(temp);
    //         // }
    //     } else {
    //         // 입력창이 공란일경우 안내창
    //         alert('메세지를 입력하세요.');
    //         document.getElementById('chat').focus();
    //         return;
    //     }
    //     setMsg('');
    // });

    //webSocket
    //webSocket
    //webSocket
    //webSocket
    //webSocket
    //webSocket

    return (
        <>
            <div className="chat">
                {/* <h1 id="title">WebSocket Chatting</h1> */}
                {/* <br /> */}
                <div className="in-chat">
                    <div className="talk-shadow"></div>
                    {msgBox}
                </div>
                <div class="enter-chat">
                    <input
                        disabled={true}
                        placeholder="이름을 입력하세요."
                        type="text"
                        id="id"
                        onChange={(event) => setName(event.target.value)}
                    />
                    <input
                        id="chat"
                        // value={msg}
                        onChange={onText}
                        onKeyDown={(ev) => {
                            if (ev.keyCode === 13) {
                                send(msg);
                            }
                        }}
                    />
                    {/* <input
                        type="button"
                        value="전송"
                        id="btnSend"
                        onClick={(e) => {
                            e.preventDefault();
                            send(msg);
                        }}
                    /> */}
                </div>
            </div>
        </>
    );
};

export default Chat;
