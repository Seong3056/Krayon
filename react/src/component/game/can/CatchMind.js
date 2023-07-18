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

const CatchMind = () => {
    //웹소켓 객체저장, 유저리스트
    const ws = useRef(null);
    const oldWs = useRef(null);
    const [socketData, setSocketData] = useState('');//수신한 데이터 저장
    const [list, setList] = useState([]);
    const [chkLog, setChkLog] = useState(false);

    const id = localStorage.getItem('id');
    const ip = '114.207.167.85';
    const URL = 'ws://' + ip + ':8181/api/game/catch?id=' + id;

    useEffect(() => {
        webSocketLogin();
    }, []);

    const webSocketLogin = useCallback(() => {
        ws.current = new WebSocket(URL);
        if (!!sessionStorage.getItem('socketURL')) {
            const socketURL = sessionStorage.getItem('socketURL');
            if (socketURL !== URL) {
                oldWs.current = new WebSocket(socketURL);
                oldWs.current.close();
            }
        }
        sessionStorage.setItem('socketURL', URL);
        console.log('웹소켓 접속');
        ws.current.onmessage = (message) => {
            //웹소켓에서 전송한 데이터를 수신 및 객체 저장
            console.log('웹소켓 수신 데이터: ' + message.data);
            const dataSet = JSON.parse(message.data);
            const data = {
                name: dataSet.name,
                img: dataSet.img,
                date: dataSet.date
            };

            if (dataSet.list !== undefined) {
                console.log('메인에서 캐치마인드진입');
                console.log(dataSet.list);
                setList(dataSet.list);
            }
            // console.log(dataSet.img);
            setSocketData(data);
        };
    });

    useEffect(() => {
        console.log(list); // list 업데이트
      }, [list]);

    // 사용자 중 그리미 뽑기
    const setDrawer = () =>{
        console.log(list[0]);
        if(list[0]===id){
            return true;
        }
        else return false;
    };

    const disconnectSocket = () => {
        ws.current.close();
    };
    const sendImg = useCallback((img) => {
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
            console.log("데이터 발신---"+img);
        } else {
            return;
        }
        // setMsg('');
    });

  return (
    <>
    <div className='view'>
        <div class="sectionMypage">
            <PaintZone data={socketData} sendImg={sendImg} setDrawer={setDrawer}/>
        </div>
        <div class="can-bottom">
            <Chatting className = "canChat"/>
            <GetQuiz className = "getQuiz"/>
        </div>
    </div>
        <div className="sectionUserList">
            <UserInfo className = "userInfo"/>
            <UserList className = "userList"/>
            <Link to="/" onClick={disconnectSocket}>
                나가기
            </Link>
        </div>
        
    </>
  )
}

export default CatchMind