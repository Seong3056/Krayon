import React, { useCallback, useEffect, useRef, useState } from 'react';
import WordQuiz from './WordQuiz';
import WMPlayer from './WMPlayer';

import '../../../resource/scss/gametest/followword/Play.scss';
import '../../../resource/scss/game/wordmatch/WordMatch.scss';
import User from '../User';
import Info from '../Info';
import { BASE_URL } from '../../../config/host-config';
import WmInfo from './WmInfo';

const WordMatch = ({ history }) => {
    const ws = useRef(null);

    const [socketData, setSocketData] = useState('');
    const [list, setList] = useState([]);
    const [chkLog, setChkLog] = useState(false);
    const [start, setStart] = useState(false);
    const [definition, setDefinition] = useState('');
    const [word, setWord] = useState('');
    const [answer, setAnswer] = useState('');

    // const [msg, setMsg] = useState('');
    const id = sessionStorage.getItem('id');
    const ip = 'localhost';
    const URL = 'ws://' + BASE_URL + '/api/game/wm?name=' + id;

    useEffect(() => {
        webSocketLogin();
    }, []);

    const webSocketLogin = useCallback(() => {
        ws.current = new WebSocket(URL);
        // if (ws.current.readyState === 1) ws.current.close();
        console.log('워드매치 웹소켓 접속');
        ws.current.onmessage = (message) => {
            //웹소켓에서 전송한 데이터를 수신 및 객체 저장
            console.log('웹소켓 수신 데이터: ' + message.data);
            const dataSet = JSON.parse(message.data);
            const data = {
                name: dataSet.name,
                date: dataSet.date,
                msg: dataSet.msg,
                definition: dataSet.definition,
                word: dataSet.word,
                point: dataSet.point,
            };

            // console.log('11111111111 ' + dataSet.list);
            if (dataSet.answer !== undefined) setAnswer(dataSet.answer);
            if (dataSet.list !== undefined) {
                console.log('워드매치에서 진입');
                console.log(dataSet.list);

                setList(dataSet.list);
            }
            console.log(data);
            setSocketData(data);

            if (data.definition !== undefined) {
                console.log('defitnion' + data.definition);
                setDefinition(data.definition);
                setWord(data.word);
            }
        };
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const sendStart = () => {
        const def = sessionStorage.getItem('definition');

        if (start && def !== definition) return;
        console.log('시작버튼이 눌림');
        const data = {
            name: id,
            start: true,
        }; //전송 데이터(JSON)

        const temp = JSON.stringify(data);
        setStart(true);
        ws.current.send(temp);
    };

    //     ws.current.close();
    // }, [history]);
    return (
        <>
            <User data={socketData} list={list} />
            <WordQuiz
                word={socketData.word}
                answer={word}
                send={send}
                definitionData={definition}
            />
            <WmInfo
                // p={socketData}
                sendStart={sendStart}
                textData={socketData}
            />
            {/* <WMPlayer list={list} /> */}
        </>
    );
};

export default WordMatch;
