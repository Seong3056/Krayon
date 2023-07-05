import React from 'react';
import ArticleList from './ArticleList';
import Wallet from './Wallet';
import Article from './Article';

import '../../resource/scss/shop/shop.scss';

const Shop = () => {
    return (
        <>
            <div class="shop">
                <div class="shop-left">
                    <ArticleList />
                    <Wallet />
                </div>
                <Article />
            </div>
        </>
    );
};

export default Shop;
