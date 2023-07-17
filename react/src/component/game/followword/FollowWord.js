import React, { useCallback, useEffect, useRef, useState } from 'react';
import CheckWord from './CheckWord';
import Copy from './Copy';
import '../../../resource/scss/game/followword/followword.scss';
import { Link } from 'react-router-dom';
const FollowWord = () => {
    const ws = useRef(null);
    const [socketData, setSocketData] = useState('');
    const [list, setList] = useState([]);
    const [chkLog, setChkLog] = useState(false);

    // const [msg, setMsg] = useState('');
    const id = localStorage.getItem('id');
    const ip = '175.114.130.19';
    const URL = 'ws://' + ip + ':8181/api/game/followword?id=' + id;

    useEffect(() => {
        webSocketLogin();
    }, []);

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
                word: dataSet.word,
                char: dataSet.char,
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

    const disconnectSocket = () => {
        ws.current.close();
    };

    const send = useCallback((word) => {
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

        if (word !== '') {
            //메세지를 data에 담아 백엔드로 JSON 객체 전송
            const data = {
                name: id,
                word,
                date: date,
            }; //전송 데이터(JSON)

            const temp = JSON.stringify(data);

            ws.current.send(temp);
        } else {
            return;
        }
        // setMsg('');
    });
    const sendChar = useCallback((char) => {
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

        if (char !== '') {
            //메세지를 data에 담아 백엔드로 JSON 객체 전송
            const data = {
                name: id,
                char,
                date: date,
            }; //전송 데이터(JSON)

            const temp = JSON.stringify(data);

            ws.current.send(temp);
        } else {
            return;
        }
    });
    return (
        <>
            <Copy data={socketData} sendChar={sendChar} send={send} />

            <Link to="/" onClick={disconnectSocket}>
                나가기
            </Link>
        </>
    );
};
export default FollowWord;
