import React from 'react';
import '../../resource/scss/main/UserInfo.scss';
const UserInfo = ({ id }) => {
    return (
        <div className="box">
            <img
                src={require('../../resource/image/test/anonymous.jpg')}
                alt=""
            />
            <div class="info">
                <p>{id}님</p>
                <p>
                    점수: <span>3852</span>
                </p>
            </div>
        </div>
    );
};

export default UserInfo;
