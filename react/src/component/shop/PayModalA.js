import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import KakaoPay from './KakaoPay';
import { BASE_URL } from '../../config/host-config';
import axios from 'axios';

const PayModalA = ({ close }) => {
    const [amount, setAmount] = useState('');
    const [payState, setPayState] = useState(false);
    const [payLink, setPayLink] = useState('');
    const loc = useLocation(null);
    const id = sessionStorage.getItem('id');
    const url = 'http://' + BASE_URL + '/api/kakaoPay';
    const fetchPay = async () => {
        let fet = await fetch(url, {
            method: 'post',
            headers: { 'content-type': 'application/json' },

            body: JSON.stringify({
                id: id,
                amount: '2000',
                itemName: 'Krayon 구독권',
            }),
        });
        const data = await fet.text();
        console.log(payState);
        setPayLink(data);
        console.log(data);
        // setPayState(true);
        window.open(data, '_blank', 'width=800, height=600, left=500');
    };
    useEffect(() => {
        console.log(payLink);
    }, [payLink]);
    //
    const state = {
        // 응답에서 가져올 값들
        next_redirect_pc_url: '',
        tid: '',
        // 요청에 넘겨줄 매개변수들
        params: {
            cid: 'TC0ONETIME',
            partner_order_id: 'partner_order_id',
            partner_user_id: 'partner_user_id',
            item_name: '초코파이',
            quantity: 1,
            total_amount: 2200,
            vat_amount: 200,
            tax_free_amount: 0,
            approval_url: 'http://localhost:3000/shop',
            fail_url: 'http://localhost:3000/shop',
            cancel_url: 'http://localhost:3000/shop',
        },
    };
    const pay = async () => {
        const { params } = state;
        const url =
            'https://kapi.kakao.com/v1/payment/ready?' +
            'cid=TC0ONETIME' +
            '&partner_order_id=' +
            'partner_order_id' +
            '&partner_user_id=' +
            'partner_user_id' +
            '&item_name=초코파이' +
            '&quantity=' +
            1 +
            '&total_amount=' +
            2200 +
            '&vat_amount=' +
            200 +
            '&tax_free_amount=' +
            0 +
            '&approval_url=http://localhost:3000/shop' +
            '&fail_url=http://localhost:3000/shop' +
            '&cancel_url=http://localhost:3000/shop';
        let f = await fetch(url, {
            method: 'POST',
            headers: {
                // 카카오 developers에 등록한 admin키를 헤더에 줘야 한다.
                Authorization: 'KakaoAK e33be38d46f10dd1cbe59b3a5dbff461',
                'Content-type':
                    'application/x-www-form-urlencoded;charset=utf-8',
            },
            params: {
                cid: 'TC0ONETIME',
                partner_order_id: 'partner_order_id',
                partner_user_id: 'partner_user_id',
                item_name: '초코파이',
                quantity: 1,
                total_amount: 2200,
                vat_amount: 200,
                tax_free_amount: 0,
                approval_url: 'http://localhost:3000',
                fail_url: 'http://localhost:3000/shop',
                cancel_url: 'http://localhost:3000/shop',
            },
        });
        const result = await f.json();
        console.log(result.next_redirect_pc_url);
        setPayLink(result.next_redirect_pc_url);
        // setPayState(true);
        let pop = window.open(
            result.next_redirect_pc_url,
            '_blank',
            'width=800, height=600, left=500, top=200'
        );
        const approve_url =
            'https://kapi.kakao.com/v1/payment/approve?' +
            'cid=TC0ONETIME' +
            '&partner_order_id=' +
            'partner_order_id' +
            '&partner_user_id=' +
            'partner_user_id' +
            '&item_name=초코파이' +
            '&quantity=' +
            1 +
            '&total_amount=' +
            2200 +
            '&vat_amount=' +
            200 +
            '&tax_free_amount=' +
            0 +
            '&approval_url=http://localhost:3000/shop' +
            '&fail_url=http://localhost:3000/shop' +
            '&cancel_url=http://localhost:3000/shop';
    };

    function componentDidMount() {
        const { params } = state;
        axios({
            // 프록시에 카카오 도메인을 설정했으므로 결제 준비 url만 주자
            url: 'https://kapi.kakao.com/v1/payment/ready',
            // 결제 준비 API는 POST 메소드라고 한다.
            method: 'POST',
            headers: {
                // 카카오 developers에 등록한 admin키를 헤더에 줘야 한다.
                Authorization: 'KakaoAK 9fcf41e2fcfb2edafc7d4de2bc9dcf83',
                'Content-type':
                    'application/x-www-form-urlencoded;charset=utf-8',
            },
            // 설정한 매개변수들
            params,
        }).then((response) => {
            // 응답에서 필요한 data만 뽑는다.
            const {
                data: { next_redirect_pc_url, tid },
            } = response;

            console.log(next_redirect_pc_url);
            console.log(tid);
            // 응답 data로 state 갱신
            // this.setState({ next_redirect_pc_url, tid });
            setPayLink(next_redirect_pc_url);
        });
    }
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

export default PayModalA;
