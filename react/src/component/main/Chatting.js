import React, { useEffect, useState } from 'react';
import '../../resource/scss/main/Chatting.scss';
import { useNavigate } from 'react-router-dom';
import ChatItem from './ChatItem';
const Chatting = () => {
    const redirection = useNavigate();

    const [chatting, setChatting] = useState([]);
    const fetchChat = async () => {
        const res = await fetch('http://localhost:8181/api/chat', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },

            body: JSON.stringify({
                id: document.getElementById('id').value,
                chat: document.getElementById('chat').value,
            }),
        });
        const chat = await res.json();
        setChatting([...chatting, chat]);
        console.log(chatting);
    };
    const chatHandler = () => {
        fetchChat();
        redirection('/');
    };
    useEffect(() => {
        // chatHandler();
    }, [chatting]);

    return (
        <div className="chat">
            <ul className="in-chat">
                {chatting.map((a) => (
                    <ChatItem id={a.id} chat={a.chat} time={a.time} />
                ))}
            </ul>
            <div class="enter-chat">
                <input type="text" name="" id="id" placeholder="임시아이디" />
                <input type="text" id="chat" placeholder="채팅입력" />
                <button onClick={chatHandler}>입력</button>
            </div>
        </div>
    );
};

export default Chatting;
