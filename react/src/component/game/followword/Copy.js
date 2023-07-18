import React, { useEffect, useState } from 'react';
import { json } from 'react-router-dom';

function Copy({ send, sendChar, data }) {
    const [currentWord, setCurrentWord] = useState('');
    const [previousWord, setPreviousWord] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const [definition, setDefinition] = useState('');

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
        if (data.wordInfo !== undefined) {
            console.log('단어' + data.wordInfo.pos);
            if (data.wordInfo.isVaild) {
                setPreviousWord(data.wordInfo.word);
                // alert('단어뜻: ' + data.wordInfo.definition);

                if (data.wordInfo.definition.length)
                    setDefinition(data.wordInfo.definition);
                console.log(data.wordInfo.definition.length);
                setCurrentWord('');
            } else alert('없는단어');
        } else setCurrentWord(data.char);
    }, [data]);

    return (
        <div className="in-game">
            <h1>끝말잇기 게임</h1>
            <p className="prev">
                {previousWord} : <br />
                {definition}
            </p>
            <p className="current">{currentWord}</p>
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
