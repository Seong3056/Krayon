import React, { useEffect, useState } from 'react';

function Copy({ send, sendChar, data }) {
    const [currentWord, setCurrentWord] = useState('');
    const [previousWord, setPreviousWord] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [gameStarted, setGameStarted] = useState(false);

    const API = 'http://localhost:8181/api/followWord';

    const handleInputChange = (event) => {
        const value = event.target.value;
        const koreanRegex = /^[ㄱ-ㅎㅏ-ㅣ가-힣\s]*$/;
        if (koreanRegex.test(value)) {
            setCurrentWord(value);
            setInputValue(value);
        } else {
            setInputValue('');
            if (value.trim() !== '') {
                alert('한글을 입력하세요!');
            }
        }
        return value;
    };
    useEffect(() => {
        console.log(data.msg);
        console.log(data.char);
        if (data.word !== undefined) setPreviousWord(data.word);
        else setCurrentWord(data.char);
    }, [data]);

    return (
        <div className="in-game">
            <h1>끝말잇기 게임</h1>
            <p className="prev">이전 단어: {previousWord}</p>
            <p className="current">현재 단어: {currentWord}</p>
            <input
                type="text"
                // value={inputValue}
                id="input"
                onChange={(e) => sendChar(handleInputChange(e))}
                onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                        send(inputValue);
                        document.getElementById('input').value = '';
                    }
                }}
            />
        </div>
    );
}

export default Copy;
