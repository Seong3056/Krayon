import React, { useEffect } from 'react';
import '../../resource/scss/userinfo/user.scss';
import { BASE_URL } from '../../config/host-config';
const MyInfo = () => {
  const API_URL = 'http://' + BASE_URL + 'api/point';
  const fetchPoint = async () => {
    const d = await fetch(API_URL, {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        id: sessionStorage.getItem('id'),
      }),
    });
    const data = await d.text();
    console.log(data);
  };
  useEffect(() => {
    fetchPoint();
  }, []);

  return (
    <>
      <div class="user-info">
        <div class="user-search">
          <input type="text" placeholder="다른 유저 검색" class="search" />
        </div>
        userId
      </div>
    </>
  );
};

export default MyInfo;
