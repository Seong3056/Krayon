import React from 'react';
import '../scss/main.scss';
const Main = () => {
    return (
        <div class="section">
            <div class="title">Krayon</div>
            <div class="tab">
                <div class="tab-d">
                    <div class="d">메인</div>
                    <div class="d d1">내정보</div>
                    <div class="d d2">상점</div>
                </div>
            </div>
            <div class="top">
                <div class="rooms">
                    <ul>
                        <li class="room">끝말잇기방 1 3/4</li>
                        <li class="room">그림 맞추기방 1 4/5</li>
                        <li class="room"></li>
                    </ul>
                </div>
                <ul class="user-list">
                    <li>GUEST_1357</li>
                    <li>나다</li>
                    <li>GUEST_1358</li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
            <div class="bottom">
                <div class="box">유저정보</div>
                <div class="chat">
                    <div class="in-chat">채팅영역</div>
                    <input type="text" placeholder="채팅입력" />
                </div>
            </div>
        </div>
        
    );
};

export default Main;
