import React from 'react';

const KakaoPay = ({ payLink }) => {
    return <iframe src={payLink}></iframe>;
};

export default KakaoPay;
