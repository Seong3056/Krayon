import React from 'react';
import ArticleList from './ArticleList';
import Wallet from './Wallet';
import Article from './Article';

import '../../resource/scss/shop/shop.scss';
import PayModal from './PayModal';

const Shop = () => {
    const [modal, setModal] = useState(false);
    const openPay = () => {
        setModal(true);
    };
    const closePay = () => {
        setModal(false);
    };
    return (
        <>
            <div class="shop">
                {modal && <PayModal close={closePay} />}
                <div class="shop-left">
                    <ArticleList />
                    <Wallet openPay={openPay} />
                </div>
                <Article />
            </div>
        </>
    );
};

export default Shop;
