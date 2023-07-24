import React, { useState } from 'react';
import ArticleList from './ArticleList';
import Wallet from './Wallet';
import Article from './Article';
import '../../resource/scss/shop/shop.scss';

const Shop = () => {
    const id = sessionStorage.getItem('id');
    
    const BASE = 'http://localhost:8181';
    const USER = '/api';
    const SHOP_URL =  BASE + USER + '/';

    // alert(cash);
    const purchase = async(itemId)=> {
        const fetchBuy = await fetch(SHOP_URL,{
            method: "POST",
            headers: {"content-type":"application/json"},
            body:JSON.stringify({
                userId : 'id'
            })
        })
    }
    
    return (
        <>
            <div class="shop">
                <div class="shop-left">
                    <ArticleList />
                    <Wallet />
                </div>
                <Article purchase={purchase} />
            </div>
        </>
    );
};

export default Shop;
