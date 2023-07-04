import React from 'react';
import '../../resource/scss/main/Rooms.scss';
import { Link } from 'react-router-dom';
const Rooms = () => {
    return (
        <div class="rooms">
            <ul>
                <Link to="/game/followword" class="room">
                    끝말잇기방 1 3/4
                </Link>
                <Link to="/game/catchmind" class="room">
                    그림 맞추기방 1 4/5
                </Link>
                <li class="room"></li>
                <li class="room"></li>
            </ul>
        </div>
    );
};

export default Rooms;
