import React, {
    Component,
    useState,
    useEffect,
    useCallback,
    useRef,
} from 'react';

export function aa(ws) {
    ws = new WebSocket('ws://localhost:8181/socket/chatt');
    console.log('웹소켓 접속');

    ws.onmessage = (message) => {
        //웹소켓에서 전송한 데이터를 수신 및 객체 저장
        console.log('웹소켓 수신 데이터: ' + message.data);
        const dataSet = JSON.parse(message.data);
        return dataSet;
    };
}

export function send(ws, name, chkLog, msg) {
    ws = new WebSocket('ws://localhost:8181/socket/chatt');
    //웹소켓으로 메세지 전송
    if (!chkLog) {
        //웹소켓 로그인안됬을경우 (!false)
        if (name === '') {
            alert('이름을 입력하세요.');
            document.getElementById('name').focus();
            return;
        }
        // webSocketLogin();
        aa();
        chkLog = true;
    }
    const date =
        (new Date().getHours() < 10
            ? '0' + new Date().getHours()
            : new Date().getHours()) +
        ':' +
        (new Date().getMinutes() < 10
            ? '0' + new Date().getMinutes()
            : new Date().getMinutes());
    const temp = '';
    if (msg !== '') {
        //메세지를 data에 담아 백엔드로 JSON 객체 전송
        const data = {
            name,
            msg,
            date: date,
        }; //전송 데이터(JSON)

        temp = JSON.stringify(data);

        ws.send(temp);
    } else {
        // 입력창이 공란일경우 안내창
        alert('메세지를 입력하세요.');
        document.getElementById('chat').focus();
        return;
    }
    msg = '';
    return { chkLog, msg, temp };
}
