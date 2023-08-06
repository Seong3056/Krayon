import React from 'react';

const KakaoPay = ({ payLink }) => {
    return <iframe src={payLink} />;
};

export default KakaoPay;
