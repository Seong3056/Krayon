import React from 'react';
    
const Article = ({purchase}) => {
   
    const itemBuy = async() => {
        const itemId1 = document.getElementById('itemId1');
        const price = itemId1.value;
    }

    return (
        <ul class="item-list">
            <li class="item1" value="1500" id="itemId1">아이템1 <button onClick={purchase}>구매</button></li>
            <li class="item">아이템1</li>
            <li class="item">아이템1</li>
            <li class="item">아이템1</li>
            <li class="item">아이템1</li>
            <li class="item">아이템1</li>
            <li class="item">아이템1</li>
            <li class="item">아이템1</li>
            <li class="item">아이템1</li>
            <li class="item">아이템1</li>
            <li class="item">아이템1</li>
            <li class="item">아이템1</li>
            <li class="item">아이템1</li>
            <li class="item">아이템1</li>
            <li class="item">아이템1</li>
            <li class="item">아이템1</li>
            <li class="item">아이템1</li>
            <li class="item">아이템1</li>
            <li class="item">아이템1</li>
        </ul>
    );
};


export default Article;
