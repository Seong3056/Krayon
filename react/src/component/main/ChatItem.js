import React, { useEffect } from 'react';

const ChatItem = ({ id, chat, time }) => {
    useEffect(() => {
        //console.log('id:{} chat:{}', id, chat);
    }, []);

    return (
        <>
            <li>
                <span>[{time}] </span>
                <span>{id}: </span>
                {chat}
            </li>
        </>
    );
};

export default ChatItem;
