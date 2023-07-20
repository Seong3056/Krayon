import React from "react";

import Rooms from "./Rooms";
import UserList from "./UserList";
import Chatting from "./Chatting";
import UserInfo from "./UserInfo";

import "../../resource/scss/main/Main.scss";
import Chat from "./Chat";

const Main = () => {
  return (
    <>
      <div class="top">
        <Rooms />
        <UserList />
      </div>

      <div class="bottom">
        <UserInfo />
        <Chat />
      </div>
    </>
  );
};

export default Main;
