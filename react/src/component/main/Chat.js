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
        (item, idx) =>
            !!item.name && (
                <div
                    key={idx}
                    className={item.name === name ? 'me ' : 'other '}
                >
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

    const onText = (event) => {
        console.log(event.target.value);
        setMsg(event.target.value);
    };

  const onChat = (e) => {
    setChatIcon(!chatIcon);
  };

  return (
    <>
      <div className="chat" id={!chatIcon && "show"}>
        {/* <h1 id="title">WebSocket Chatting</h1> */}
        {/* <br /> */}
        <div className="in-chat">
          <div className="talk-shadow"></div>
          {msgBox}
        </div>
        <div class="enter-chat">
          <input
            id="chat"
            className="input"
            // value={msg}
            onChange={onText}
            onKeyDown={(ev) => {
              if (ev.keyCode === 13) {
                send(msg);
                document.getElementById("chat").value = "";
              }
            }}
          />
          <input
            type="button"
            value="전송"
            id="btnSend"
            className="btnSend"
            onClick={(e) => {
              e.preventDefault();
              send(msg);
            }}
          />
        </div>
      </div>
      <BsFillChatSquareFill
        className="chatIcon"
        onClick={(e) => {
          e.preventDefault();
          onChat();
        }}
      />
    </>
  );
};

export default Chat;
