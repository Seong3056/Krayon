import React, { useCallback, useEffect, useRef, useState } from "react";

import Rooms from "./Rooms";
import UserList from "./UserList";
import Chatting from "./Chatting";
import UserInfo from "./UserInfo";

// import '../../resource/scss/main/Main.scss';
import "../../resource/scss/maintest/Start.scss";
// src\resource\scss\maintest\Start.scss
import Chat from "./Chat";
import TypeHangul from "../../../node_modules/type-hangul/src/index";
import Tab from "../Tab";

import { BiSolidBook } from "react-icons/bi";
import { FaBook } from "react-icons/fa";
import { MdFace3 } from "react-icons/md";
import { HiHome } from "react-icons/hi";
import { BsBookmarksFill } from "react-icons/bs";
// import { FaFaceSmileWink } from "react-icons/fa";

const Main = ({ history }) => {
  const ws = useRef(null);
  const oldWs = useRef(null);
  const [socketData, setSocketData] = useState("");
  const [list, setList] = useState([]);
  const [chkLog, setChkLog] = useState(false);
  const [toggleIcon, setToggleIcon] = useState(false);
  const [selGame, setselGame] = useState("");
  const [selDes, setselDes] = useState("");

  // const [msg, setMsg] = useState('');
  const id = sessionStorage.getItem("id");
  const ip = "localhost";
  const URL = "ws://" + ip + ":8181/api/chatt?id=" + id;
  const socketClose = () => {
    if (ws.current.readyState === 1) ws.current.close();
  };
  const webSocketLogin = useCallback(() => {
    ws.current = new WebSocket(URL);

    if (ws.current.readyState === 1) ws.current.close();
    console.log("웹소켓 접속11");
    ws.current.onmessage = (message) => {
      //웹소켓에서 전송한 데이터를 수신 및 객체 저장
      console.log("웹소켓 수신 데이터: " + message.data);
      const dataSet = JSON.parse(message.data);
      const data = {
        name: dataSet.name,
        date: dataSet.date,
        msg: dataSet.msg,
      };

      // console.log('11111111111 ' + dataSet.list);
      if (dataSet.list !== undefined) {
        console.log("메인에서 진입");
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
      if (id === "") {
        alert("이름을 입력하세요.");
        document.getElementById("id").focus();
        return;
      }
      // webSocketLogin();
      setChkLog(true);
    }
    const date =
      (new Date().getHours() < 10
        ? "0" + new Date().getHours()
        : new Date().getHours()) +
      ":" +
      (new Date().getMinutes() < 10
        ? "0" + new Date().getMinutes()
        : new Date().getMinutes());

    if (msg !== "") {
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
  useEffect(() => {
    webSocketLogin();
  }, []);

  function test() {
    const $test = document.getElementById("test");

    TypeHangul.type("#test");
  }
  //  <div class="top">
  {
    /* <div id="test">한글타이핑 테스트내용입니다.</div>
                <button onClick={test}>실행</button> */
  }
  // <Rooms id={id} dis={disconnectSocket} />
  // <UserList userList={list} />
  // {/* <Socket wss={ws} id={id} /> */}
  // </div>

  // <div class="bottom">
  // <UserInfo id={id} />

  // </div>
  // <div class="col col1">
  {
    /* <UserInfo id={id} /> */
  }
  // <Chat send={send} ws={ws.current} textData={socketData} />
  // </div>
  const room = [
    { game: "캐치마인드", describe: "캐치마인드 설명" },
    {
      game: "끝말잇기",
      describe: "설명",
    },
    {
      game: "단어맞추기",
      describe: "설명",
    },
  ];
  const toggleMenu = () => {
    setToggleIcon(!toggleIcon);
  };

  let gameTitle = document.getElementById("gameTitle");
  // console.log("gameTitle: " + gameTitle.textContent);

  const describe = (pickCardTitle) => {
    console.log(room[0].game);
    let selectGame = "";
    let selectDes = "";
    room.map((r) => {
      if (r.game == pickCardTitle) {
        setselGame(r.game);
        setselDes(r.describe);
        return;
      }
    });
  };

  useEffect(() => {}, [describe]);

  return (
    <div className="select">
      <div className="navbar">
        {/* <div className="logo"></div> */}
        <div className="menu">
          <div
            className={`${toggleIcon && "active"} toggle menu-icon `}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={`${toggleIcon && "showMenu"} menubar`}>
            {toggleIcon && (
              <>
                <HiHome className="showIcon"></HiHome>
                {/* <FaFaceSmileWink></FaFaceSmileWink> */}
                <MdFace3 className="showIcon"></MdFace3>
                <BiSolidBook className="showIcon"></BiSolidBook>
                <BsBookmarksFill className="showIcon"></BsBookmarksFill>
                {/* <Tab></Tab> */}
              </>
            )}
          </div>
        </div>
      </div>
      <div class="row">
        {/* <div id="test">한글타이핑 테스트내용입니다.</div>
                <button onClick={test}>실행</button> */}

        {/* <UserList userList={list} /> */}
        {/* <Socket wss={ws} id={id} /> */}
        <div className="start-info"></div>
        <div className="col col1">
          <h1 id="gameTitle">{selGame}</h1>
          <p id="gameDescribe">
            {/* 보는 이상 그것을 품고 소금이라 눈에 같이 부패뿐이다.
                        군영과 그들의 얼마나 이상, 보이는 눈에 피에 사랑의
                        쓸쓸하랴? 돋고, 새가 같으며, 황금시대다. 밥을 풍부하게
                        이상의 작고 천지는 몸이 철환하였는가? 황금시대를 실현에
                        광야에서 귀는 약동하다. */}
            {selDes}
          </p>
          <button type="button">시작</button>
        </div>
        <Rooms id={id} dis={disconnectSocket} describe={describe} />
        <UserList userList={list} />
      </div>
      <Chat send={send} ws={ws.current} textData={socketData} />
    </div>
  );
};

export default Main;
