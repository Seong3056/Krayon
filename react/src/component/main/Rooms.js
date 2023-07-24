import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../../resource/scss/main/Rooms.scss';
import { Link, useNavigate } from 'react-router-dom';

const Rooms = ({ dis }) => {
    return (
        <>
            <ul class="col col2">
                <Link to="/game/can" onClick={dis} class="room room1">
                    캐치마인드
                </Link>
                <Link to="/game/followword" onClick={dis} class="room room2">
                    끝말잇기
                </Link>
                <Link to="/game/wordmatch" onClick={dis} class="room">
                    단어 맞추기
                </Link>
            </ul>
        </>
    );
};

export default Rooms;
