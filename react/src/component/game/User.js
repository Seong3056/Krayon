import React from 'react';
import '../../resource/scss/gametest/followword/User.scss';
import { useEffect } from 'react';

const User = ({ data, list }) => {
    useEffect(() => {
        if (data.wordInfo !== undefined) {
            console.log('이것은 유저에서 보이는거여' + data.name);
            const $user = document.getElementById(data.name);
            const $comment = $user.querySelector('.comment');
            $comment.classList.add('claim');
            $comment.textContent = data.wordInfo.word;
            setTimeout(() => {
                $comment.classList.remove('claim');
                $comment.textContent = '';
            }, 2000);
        }
    }, [data.wordInfo]);

    useEffect(() => {
        const $user = document.getElementById(data.name);
        if (data.name !== undefined && data.turn) {
            $user.classList.add('turn');
        } else if (data.name !== undefined && !data.turn) {
            $user.classList.remove('turn');
        }
    }, [data.turn]);

    return (
        <div className="users">
            {!!list &&
                list.map((e) => (
                    <div className="user" id={e}>
                        <div className="profile"></div>
                        <div className="score">{e}</div>
                        <div className="comment claim">sdf</div>
                    </div>
                ))}

            <div className="user turn">
                <div className="profile"></div>
                <div className="score">Guest_4781</div>
                <div className="comment "></div>
            </div>
            <div className="user">
                <div className="profile"></div>
                <div className="score">ICTResearch</div>
                <div className="comment"></div>
            </div>
            <div className="user">
                <div className="profile"></div>
                <div className="score">programmer</div>
                <div className="comment"></div>
            </div>
        </div>
    );
};

export default User;
