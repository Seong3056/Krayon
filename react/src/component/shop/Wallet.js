import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Wallet = ({ openPay }) => {
  const pay = () => {};
  return (
    <div className="wallet">
      <div className="walletInfo">
        {/* <div className="user-id">유저아이디</div> */}
        <div className="point">
          보유포인트: <span>3815</span>
        </div>
        {/* <div class="cash">
          보유 캐시: <span>2500</span>
        </div> */}
      </div>
      <button id="payBtn" onClick={openPay}>
        충전하기
      </button>
    </div>
  );
};

export default Wallet;
