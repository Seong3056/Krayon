import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../../resource/scss/main/Rooms.scss';
import { Link, useNavigate } from 'react-router-dom';

const Rooms = ({ dis }) => {
    return (
        <div class="rooms">
            <ul>
                <Link to="/game/can" onClick={dis} class="room">
                    그림 맞추기방 4/5
                </Link>
                <Link to="/game/followword" onClick={dis} class="room">
                    끝말잇기방 3/4
                </Link>
                <Link to="/game/wordmatch" onClick={dis} class="room">
                    단어 맞추기방
                </Link>
            </ul>
        </div>
    );
};

export default Rooms;
