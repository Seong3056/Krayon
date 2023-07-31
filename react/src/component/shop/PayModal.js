import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import KakaoPay from './KakaoPay';
import { BASE_URL } from '../../config/host-config';

const PayModal = ({ close }) => {
    const [amount, setAmount] = useState('');
    const [payState, setPayState] = useState(false);
    const [payLink, setPayLink] = useState('');
    const loc = useLocation(null);
    const id = sessionStorage.getItem('id');
    const url = BASE_URL + '/api/kakaoPay';
    const fetchPay = async () => {
        let fet = await fetch(url, {
            method: 'post',
            headers: { 'content-type': 'application/json' },

            body: JSON.stringify({
                id: id,
                amount: '2000',
                itemName: 'Krayon 구독',
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
                        <p>Krayon 아이템 정기구독</p>{' '}
                        <p>한달 2000원으로 모든 아이템을 써보세요 !</p>
                        <button onClick={fetchPay}>결제하기</button>{' '}
                    </>
                )}
            </div>
        </>
    );
};

export default PayModal;
