import React from 'react';

const Wallet = () => {
    return (
        <div className="wallet">
            <div class="user-id">유저아이디</div>
            <div class="point">
                보유포인트: <span>3815</span>
            </div>
            <div class="cash">
                보유 캐시: <span>2500</span>
            </div>
        </div>
    );
};

export default Wallet;
