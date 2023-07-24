import React, { useCallback, useEffect, useRef, useState } from 'react';
import CheckWord from './CheckWord';
import Copy from './Copy';
import '../../../resource/scss/game/followword/followword.scss';
import '../../../resource/scss/gametest/followword/Info.scss';
import '../../../resource/scss/gametest/followword/User.scss';
import { Link } from 'react-router-dom';
import ProgressBar from 'react-bootstrap/ProgressBar';
import User from '../User';
import Info from '../Info';

const FollowWord = ({ history }) => {
    const ws = useRef(null);

    const [socketData, setSocketData] = useState('');
    const [list, setList] = useState([]);
    const [chkLog, setChkLog] = useState(false);
    const [startWord, setStartWord] = useState('');
    const [start, setStart] = useState(false);
    const [turn, setTurn] = useState(true);
    const [timer, setTimer] = useState(120);
    const [userTimer, setUserTimer] = useState(10);

    // const [msg, setMsg] = useState('');
    const id = sessionStorage.getItem('id');
    const ip = '175.114.130.19';
    const URL = 'ws://' + ip + ':8181/api/game/followword?name=' + id;

    useEffect(() => {
        webSocketLogin();

        console.log('1111111111111111웹소켓로그인');
    }, []);

    useEffect(() => {
        // const leave = history.block('페이지를 나가실건가요?');
        return () => {
            console.log('웹소켓로그아웃한다아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ');
            ws.current.close();
        };
    }, [history]);

    const webSocketLogin = useCallback(() => {
        ws.current = new WebSocket(URL);

        console.log('웹소켓 접속11');
        ws.current.onmessage = (message) => {
            //웹소켓에서 전송한 데이터를 수신 및 객체 저장
            console.log('웹소켓 수신 데이터: ' + message.data);
            const dataSet = JSON.parse(message.data);
            const data = {
                name: dataSet.name,
                date: dataSet.date,
                msg: dataSet.msg,
                wordInfo: dataSet.wordInfo,
                char: dataSet.char,
                turn: dataSet.turn,
                result: dataSet.result,
            };
            console.log(dataSet);
            // console.log('11111111111 ' + dataSet.list);
            if (dataSet.list !== undefined) {
                console.log(dataSet.list);

                setList(dataSet.list);
            }

            setSocketData(data);
            setTurn(dataSet.turn);
            if (!dataSet.char) {
                if (dataSet.wordInfo !== undefined) {
                    setStartWord(dataSet.wordInfo);
                    console.log(dataSet.wordInfo);
                    setStart(true);
                } else {
                    setStart(false);
                }
            }
            console.log('!!!!!!!!!!!!' + dataSet.re);
            if (data.result !== undefined) {
                console.log(data.result[0]);
                console.log(data.result[0].name);
                console.log(
                    data.result.map((e) => {
                        console.log(e.count);
                    })
                );
            }
        };
    });

    const disconnectSocket = () => {
        ws.current.close();
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    ////////////////////////////////////////////////////////////////////////////////////
    const gameStart = useCallback(() => {
        //웹소켓으로 메세지 전송

        const date =
            (new Date().getHours() < 10
                ? '0' + new Date().getHours()
                : new Date().getHours()) +
            ':' +
            (new Date().getMinutes() < 10
                ? '0' + new Date().getMinutes()
                : new Date().getMinutes());

        //메세지를 data에 담아 백엔드로 JSON 객체 전송
        const data = {
            name: id,
            start: true,
            date: date,
        }; //전송 데이터(JSON)
        const temp = JSON.stringify(data);
        ws.current.send(temp);
        setStart(true);
    });
    const handleBeforeUnload = (e) => {
        e.preventDefault();
        console.log('페이지이동이 감지됨');
    };
    // window.addEventListener('beforeunload', handleBeforeUnload);

    return (
        <>
            <User data={socketData} list={list} />
            {/* <div>시간:{timer}</div> */}
            {/* <ProgressBar
                variant="danger"
                now={(timer / 120) * 100}
                label={`${timer}초`}
                className="progress"
            />
            <ProgressBar
                variant="warning"
                now={userTimer * 10}
                label={`${userTimer}초`}
                className="progress"
            /> */}

            <Copy
                list={list}
                data={socketData}
                sendChar={sendChar}
                send={send}
                startWord={startWord}
            />
            <Info gameStart={gameStart} />
            {/* <button className="ready" onClick={gameStart}>
                게임시작
            </button> */}

            {/* <Link to="/" onClick={disconnectSocket}>
                나가기
            </Link> */}

            {/* {list.map((e) => (
                <div>{e}</div>
            ))} */}
        </>
    );
};
export default FollowWord;
