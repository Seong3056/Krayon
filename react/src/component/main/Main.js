import React, { useCallback, useEffect, useRef, useState } from 'react';

import Rooms from './Rooms';
import UserList from './UserList';
import Chatting from './Chatting';
import UserInfo from './UserInfo';

import '../../resource/scss/main/Main.scss';
import Chat from './Chat';
import TypeHangul from '../../../node_modules/type-hangul/src/index';
const Main = () => {
    const ws = useRef(null);
    const oldWs = useRef(null);
    const [socketData, setSocketData] = useState('');
    const [list, setList] = useState([]);
    const [chkLog, setChkLog] = useState(false);

    // const [msg, setMsg] = useState('');

    const id = localStorage.getItem('id');
    const ip = '114.207.167.85';

    const URL = 'ws://' + ip + ':8181/api/chatt?id=' + id + '&room=1';
    const socketClose = () => {
        if (ws.current.readyState === 1) ws.current.close();
    };
    const webSocketLogin = useCallback(() => {
        ws.current = new WebSocket(URL);

        if (ws.current.readyState === 1) ws.current.close();
        console.log('웹소켓 접속11');
        ws.current.onmessage = (message) => {
            //웹소켓에서 전송한 데이터를 수신 및 객체 저장
            console.log('웹소켓 수신 데이터: ' + message.data);
            const dataSet = JSON.parse(message.data);
            const data = {
                name: dataSet.name,
                date: dataSet.date,
                msg: dataSet.msg,
            };

            // console.log('11111111111 ' + dataSet.list);
            if (dataSet.list !== undefined) {
                console.log('메인에서 진입');
                console.log(dataSet.list);

                setList(dataSet.list);
            }
            setSocketData(data);
        };
    });

    const send = useCallback((msg) => {
        //웹소켓으로 메세지 전송
        if (!chkLog) {
            //웹소켓 로그인안됬을경우 (!false)
            if (id === '') {
                alert('이름을 입력하세요.');
                document.getElementById('id').focus();
                return;
            }
            // webSocketLogin();
            setChkLog(true);
        }
        const date =
            (new Date().getHours() < 10
                ? '0' + new Date().getHours()
                : new Date().getHours()) +
            ':' +
            (new Date().getMinutes() < 10
                ? '0' + new Date().getMinutes()
                : new Date().getMinutes());

        if (msg !== '') {
            //메세지를 data에 담아 백엔드로 JSON 객체 전송
            const data = {
                name: id,
                msg,
                date: date,
            }; //전송 데이터(JSON)

            const temp = JSON.stringify(data);

            // if (ws.current.readyState === 0) {
            //     //readyState는 웹 소켓 연결 상태를 나타냄
            //     ws.current.onopen = () => {
            //         //webSocket이 맺어지고 난 후, 실행
            //         console.log(ws.current.readyState);
            //         ws.current.send(temp);
            //     };
            // } else {
            ws.current.send(temp);
            // }
        } else {
            // 입력창이 공란일경우 안내창
            // alert('메세지를 입력하세요.');
            // document.getElementById('chat').focus();
            return;
        }
        // setMsg('');
    });

    // const textMsg = (e) => {
    //     setMsg(e);
    // };

    // const userList = (e) => {
    //     setList(e);

    //     if (e !== undefined) {
    //         console.log(e);
    //         return e;
    //     }
    // };

    // window.onload = () => {
    //     webSocketLogin();
    // };
    const disconnectSocket = () => {
        //     ws.current.close();
    };
    useEffect(() => {
        console.log(list);
    }, [list]);
    useEffect(() => {}, [window.location.pathname]);

    window.onload = () => {
        webSocketLogin();
    };
    function test() {
        const $test = document.getElementById('test');

        TypeHangul.type('#test');
    }

    return (
        <>
            <div class="top">
                {/* <div id="test">한글타이핑 테스트내용입니다.</div>
                <button onClick={test}>실행</button> */}
                <Rooms id={id} dis={disconnectSocket} />
                <UserList userList={list} />
                {/* <Socket wss={ws} id={id} /> */}
            </div>

            <div class="bottom">
                <UserInfo id={id} />
                <Chat send={send} ws={ws.current} textData={socketData} />
            </div>
        </>
    );
};

export default Main;
