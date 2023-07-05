import React from 'react';
import '../../resource/scss/main/UserInfo.scss';
const UserInfo = () => {
    return (
        <div className="box">
            <img src="src\resource\image\test\anonymous.jpg" alt="" />
            <div class="info">
                <p>아이디123</p>
                <p>
                    점수: <span>3852</span>
                </p>
            </div>
        </div>
    );
};

export default UserInfo;
