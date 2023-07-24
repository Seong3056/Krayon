import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Wallet = ({ openPay }) => {
    const pay = () => {};
    return (
        <div className="wallet">
            <div class="user-id">유저아이디</div>
            <div class="point">
                보유포인트: <span>3815</span>
            </div>
            <div class="cash">
                보유 캐시: <span>2500</span>
            </div>
            <button onClick={openPay}>충전하기</button>
        </div>
    );
};

export default Wallet;
