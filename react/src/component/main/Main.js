import React, { useState } from 'react';

import Rooms from './Rooms';
import UserList from './UserList';
import Chatting from './Chatting';
import UserInfo from './UserInfo';

import '../../resource/scss/main/Main.scss';
import Chat from './Chat';

const Main = () => {
    const [list, setList] = useState([]);
    const userList = (e) => {
        setList(e);

        if (e !== undefined) {
            console.log(e);
            return e;
        }
    };
    return (
        <>
            <div class="top">
                <Rooms />
                <UserList userList={list} />
            </div>

            <div class="bottom">
                <UserInfo />
                <Chat userList={userList} />
            </div>
        </>
    );
};

export default Main;
