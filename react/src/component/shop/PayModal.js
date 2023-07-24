import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import KakaoPay from './KakaoPay';

const PayModal = ({ close }) => {
    const [amount, setAmount] = useState('');
    const [payState, setPayState] = useState(false);
    const [payLink, setPayLink] = useState('');
    const loc = useLocation(null);

    const url = 'http://localhost:8181/api/kakaoPay';
    const fetchPay = async () => {
        let fet = await fetch(url, {
            method: 'post',
            headers: { 'content-type': 'application/json' },

            body: JSON.stringify({
                id: '123',
                amount: '10000',
                itemName: '10,000',
            }),
        });
        const data = await fet.text();
        console.log(payState);
        setPayLink(data);
        console.log(data);
        setPayState(true);
        // window.open(data, '_blank', 'width=300, height=700');
    };
    useEffect(() => {
        console.log(payLink);
    }, [payLink]);
    //
    return (
        <>
            <div className="paymodal">
                <button onClick={close}>닫기</button>
                {payState ? (
                    <KakaoPay payLink={payLink} />
                ) : (
                    <>
                        <p>금액</p> <input type="text" />
                        <p>{amount}</p>
                        <button onClick={fetchPay}>결제하기</button>{' '}
                    </>
                )}
            </div>
        </>
    );
};

export default PayModal;
