import React from 'react';
import '../../resource/scss/gametest/followword/User.scss';
import { useEffect } from 'react';

const User = ({ data, list, turn }) => {
    useEffect(() => {
        // 말풍선 출력
        if (data.wordInfo !== undefined) {
            console.log('이것은 유저에서 보이는거여' + data.name);
            const $user = document.getElementById(data.name);
            console.log('이것은 유저 지목이요' + $user);
            if ($user === null) return;
            const $comment = $user.querySelector('.comment');
            $comment.classList.add('claim');
            $comment.textContent = data.msg;
            setTimeout(() => {
                $comment.classList.remove('claim');
                $comment.textContent = '';
            }, 2000);
        }
    }, [data.msg]);

    useEffect(() => {
        // 턴 지정
        console.log('turn' + turn);
        if (turn !== '') {
            if (list.length !== 0) {
                const $user = document.querySelectorAll('.user');
                console.log('$user' + $user);
                if ($user !== null) {
                    [...$user].forEach((e) => {
                        e.classList.remove('turn');
                        if (e.getAttribute('id') === turn)
                            e.classList.add('turn');
                    });
                }
            }
        }
    }, [turn]);

    return (
        <div className="users">
            {!!list &&
                list.map((e) => (
                    <div className="user" id={e}>
                        <div className="profile"></div>
                        <div className="score">{e}</div>
                        <div className="comment">sdf</div>
                    </div>
                ))}

            {/* <div className="user">
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
            </div> */}
        </div>
    );
};

export default User;
