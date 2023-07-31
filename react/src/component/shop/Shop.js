import React, { useState } from 'react';
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
        <div class="shop-left">
          <Wallet openPay={openPay} />
        </div>
        <Article />
        {modal && <PayModal close={closePay} />}
      </div>
    </>
  );
};

export default Shop;
