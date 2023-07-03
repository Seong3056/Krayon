import React from 'react';
import '../resource/scss/Tab.scss';
import { Link } from 'react-router-dom';
const Tab = () => {
    return (
        <>
            <div className="title">Krayon</div>
            <div className="tab">
                <div class="tab-d">
                    <Link to="/" className="d main">
                        메인
                    </Link>
                    <Link to="/user" className="d info">
                        내정보
                    </Link>
                    <Link to="/shop" className="d shop">
                        상점
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Tab;
