import React, { useEffect } from 'react';

const ChatItem = ({ id, chat }) => {
    useEffect(() => {
        console.log('id:{} chat:{}', id, chat);
    }, []);

    return (
        <>
            <li>
                <span>{id}: </span>
                {chat}
            </li>
        </>
    );
};

export default ChatItem;
