import React, { useEffect, useState } from 'react';
import '../../resource/scss/userinfo/user.scss';
import { BASE_URL } from '../../config/host-config';

const MyInfo = () => {
    const API_URL = 'http://' + BASE_URL + '/api/point';
    const [point, setPoint] = useState('');
    const [userId, setUserId] = useState('');
    const [grade, setGrade] = useState('bronze');

    const fetchPoint = async () => {
        console.log(API_URL);
        setUserId(sessionStorage.getItem('id'));

        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                userId: userId,
            }),
        });

        // const json = await res.json();
        if (res.status === 200) {
            const data = await res.json();

            console.log(data);
            setPoint(data);
            const $grade = document.querySelector('.grade-box');
            if (point < 100) {
                setGrade('Bronze');
                $grade.style.color = '#CD7F32';
            } else if (point <= 200) {
                setGrade('Silver');
                $grade.style.color = '#A3A3A3';
            } else if (point <= 300) {
                setGrade('Gold');
                $grade.style.color = '#D5A11E';
            }
        }
    };
    useEffect(() => {
        fetchPoint();
    }, []);

    return (
        <>
            <div class="user-info">
                {/* <div class="user-search">
          <input type="text" placeholder="다른 유저 검색" class="search" />
        </div> */}
                <div>
                    <div className="grade">
                        <div className="userId">{userId}</div>
                        <div className="grade-box">{grade}</div>
                        <div className="point">{point}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyInfo;
