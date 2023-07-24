import React, { useCallback, useEffect, useRef, useState } from 'react'
// import PaintZone from './PaintZone'
// import UserInfo from '../main/UserInfo'
// import Chatting from '../main/Chatting'
// import UserList from '../main/UserList'
import "../../../resource/scss/game/can/can.scss"



import PaintZone from './PaintZone'
import Chatting from '../../main/Chatting'
import UserInfo from '../../main/UserInfo'
import UserList from '../../main/UserList'
import GetQuiz from './style/GetQuiz'
import { Link } from 'react-router-dom'
import User from '../User'
import Info from '../Info'

const CatchMind = ({history}) => {
    //웹소켓 객체저장, 유저리스트
    const ws = useRef(null);
    const oldWs = useRef(null);
    const [socketData, setSocketData] = useState('');//수신한 데이터 저장
    const [list, setList] = useState([]);
    const [chkLog, setChkLog] = useState(false);
    const [crtWord, setCrtWord] = useState('');
    const [start, setStart] = useState(false);
    const [turn, setTurn] = useState(false);
    const [answer, setAnswer] = useState('');//정답작성

    const id = sessionStorage.getItem('id');
    const ip = 'localhost';
    const URL = 'ws://' + ip + ':8181/api/game/catch?name=' + id ;

    useEffect(() => {
        // const leave = history.block('페이지를 나가실건가요?');
        return () => {
            console.log('웹소켓로그아웃');
            // ws.current.close();
        };
    }, [history]);
    useEffect(() => {
      webSocketLogin();
    }, [])
    const webSocketLogin = useCallback(() => {
        ws.current = new WebSocket(URL);
        sessionStorage.setItem('socketURL', URL);
        console.log('웹소켓 접속');
        ws.current.onmessage = (message) => {
            //웹소켓에서 전송한 데이터를 수신 및 객체 저장
            console.log('웹소켓 수신 데이터: ' + message.data);
            const dataSet = JSON.parse(message.data);
            console.log(dataSet);
            const data = {
                name: dataSet.name,
                img: dataSet.img,
                date: dataSet.date,
                turn: dataSet.turn,
                
            };
            if(dataSet.wordInfo != undefined){
                if(!dataSet.wordInfo.isVaild){
                    setCrtWord(dataSet.wordInfo.word);
                console.log("dnjemdlsvh"+dataSet.wordInfo.word);
                }
            }
            
            if (dataSet.list !== undefined) {
                console.log('메인에서 캐치마인드진입');
                console.log(dataSet.list);
                setList(dataSet.list);
            }
            setSocketData(data);
            if(dataSet.turn !== undefined)setTurn(dataSet.turn);
            console.log("내턴값(단어표출!)"+dataSet.turn);

           
        };
    });


    const disconnectSocket = () => {
        ws.current.close();
    };
    const sendImg = useCallback((img) => {//이미지 데이터 보내기
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

        if (img !== '') {
            //메세지를 data에 담아 백엔드로 JSON 객체 전송
            const data = {
                name: id,
                img,
                date: date,
            }; //전송 데이터(JSON)

            const temp = JSON.stringify(data);

            ws.current.send(temp);
            // console.log("데이터 발신---"+img);
        } else {
            return;
        }
        // setMsg('');
    });

    const sendAnswer = useCallback((answer) => {//이미지 데이터 보내기
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

        if (answer !== '') {
            //메세지를 data에 담아 백엔드로 JSON 객체 전송
            const data = {
                name: id,
                answer: answer,
                date: date,
            }; //전송 데이터(JSON)

            const temp = JSON.stringify(data);

            ws.current.send(temp);
            console.log("데이터 발신---"+answer);
            setAnswer(''); // 전송 후 입력값 초기화
        } else {
            return;
        }
        // setMsg('');
    });

    const gameStart = useCallback(() => {//게임 시작 start true
        //웹소켓으로 메세지 전송
            console.log(URL);
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
    window.addEventListener('beforeunload', handleBeforeUnload);

  return (
    <>
    {/* <div>{id}</div> */}
    <User data={socketData} list={list} />
    
        {/* <div class="sectionMypage" > */}
            <PaintZone data={socketData} sendImg={sendImg} crtWord={crtWord} list={list} sendAnswer={sendAnswer}/>
            {/* <input 
            type="text" 
            className="input"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)} 
            placeholder="정답 또는 채팅을 입력해주세요!"
            onKeyDown={(e) => {
                if (e.keyCode === 13) {
                    sendAnswer();
                }
            }} 
            /> */}
        {/* </div> */}
            

    
    <Info gameStart={gameStart} />
        {/* <button onClick={gameStart}>게임시작</button> */}
        
        
      
        
    </>
  )
}

export default CatchMind
//   <div className="sectionUserList">
{/* <UserInfo className = "userInfo"/> */}
{/* <UserList className = "userList"/> */}
{/* <Link to="/" onClick={disconnectSocket}> */}
    // 나가기
// </Link>
// </div>

// {list.map((e) => (
    // <div>{e}</div>
// ))}