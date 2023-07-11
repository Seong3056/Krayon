import React, { useEffect, useState } from 'react';
import '../../resource/scss/main/Chatting.scss';
import { Link, useNavigate } from 'react-router-dom';
import ChatItem from './ChatItem';

const Chatting = () => {
    // const redirection = useNavigate();
    // var ws = new WebSocket('ws://localhost:8181/chat/aa?1');
    const web = new WebSocket('ws://localhost:8181/chat/aa?1');

    // let c = ws.onmessage();
    const [chatting, setChatting] = useState([]);
    // const fetchChat = async () => {
    //     const res = await fetch('http://localhost:8181/api/chat', {
    //         method: 'POST',
    //         headers: { 'content-type': 'application/json' },

    //         body: JSON.stringify({
    //             id: document.getElementById('id').value,
    //             chat: document.getElementById('chat').value,
    //         }),
    //     });
    //     const chat = await res.json();
    //     setChatting([...chatting, chat]);
    //     console.log(chatting);
    // };
    // let a = ws.onmessage();
    // console.log(a);
    const open = web.addEventListener('open', (e) => {
        console.log('접속');
        console.log(e.data);
        web.send('hello server');
    });
    let a = [];
    const message = web.addEventListener('message', (e) => {
        console.log('클릭');
        setChatting([...a, e.data]);
        console.log(chatting);
    });
    const li = chatting.map((a) => {
        <ChatItem chat={a} />;
    });
    useEffect(() => {
        // chatHandler();
    }, [li]);

    return (
        <>
            <div className="chat">
                <ul className="in-chat">
                    <li>{li}</li>
                </ul>
                <div class="enter-chat">
                    <input
                        type="text"
                        name=""
                        id="id"
                        placeholder="임시아이디"
                    />
                    <input type="text" id="chat" placeholder="채팅입력" />
                    <Link onClick={message}>입력</Link>
                    <Link onClick={open}>접속</Link>
                    <button>종료</button>
                </div>
            </div>
        </>
    );
};

export default Chatting;
