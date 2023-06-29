import React from 'react';
import '../resource/scss/Tab.scss';
const Tab = () => {
    return (
        <>
            <div className="title">Krayon</div>
            <div className="tab">
                <div class="tab-d">
                    <div className="d main">메인</div>
                    <div className="d info">내정보</div>
                    <div className="d shop">상점</div>

                </div>
            </div>
        </>
    );
};

export default Tab;
