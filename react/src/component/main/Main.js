import React from 'react';

import Rooms from './Rooms';
import UserList from './UserList';
import Chatting from './Chatting';
import UserInfo from './UserInfo';

import '../../resource/scss/main/Main.scss';

const Main = () => {
    return (
        <>
            <div class="top">
                <Rooms />
                <UserList />
            </div>

            <div class="bottom">
                <UserInfo />
                {/* <Chatting /> */}
            </div>
        </>
    );
};

export default Main;
