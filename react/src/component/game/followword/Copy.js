import React, { useEffect, useState } from 'react';
import { json } from 'react-router-dom';
import '../../../resource/scss/gametest/followword/Play.scss';
import '../../../resource/scss/game/followword/followword.scss';

function Copy({ send, sendChar, data, list, startWord, turn }) {
    const [currentWord, setCurrentWord] = useState('');
    const [previousWord, setPreviousWord] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const [definition, setDefinition] = useState('게임시작을 눌러주세요!');
    const [userTurn, setUserTurn] = useState(false);
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
    const CheckWord = () => {
        const prev = previousWord.split(''); //이전단어 배열화
        const prevChar = prev[prev.length - 1]; //마지막 글자
        const crtChar = currentWord.split('')[0]; //입력단어 첫글자

        if (currentWord.length <= 1) {
            console.log('2글자이상 입력');
            return;
        } //입력단어가 2글자 미만이라면 리턴
        if (prevChar === crtChar) {
            console.log('단어가 일치');
            send(inputValue);
        } else {
            console.log('일치하지 않음');
            setCurrentWord('');
            return;
        }
    };
    useEffect(() => {
        if (!!startWord) {
            setPreviousWord(startWord.word);
            setDefinition(startWord.definition);
        }
        console.log(data.wordInfo);
        if (data.wordInfo !== undefined) {
            // setPreviousWord(data.wordInfo.word);
            // setDefinition(data.wordInfo.definition);
            console.log('단어' + data.wordInfo);
            if (data.wordInfo.word !== undefined) {
                setPreviousWord(data.wordInfo.word);
                // alert('단어뜻: ' + data.wordInfo.definition);

                if (data.wordInfo.definition.length > 50)
                    setDefinition(
                        data.wordInfo.definition.substring(0, 50).concat('...')
                    );
                else setDefinition(data.wordInfo.definition);
                console.log(data.wordInfo.definition.length);
                console.log('접속유저 리스트' + list);
                setCurrentWord('');
            } else {
                // 단어가 없을때 없는 단어

                setCurrentWord('');
            }
        } else setCurrentWord(data.char);
        console.log('!!!!!!!!!!!!!!!' + data.turn);
        if (data.turn !== undefined) {
            setUserTurn(data.turn);
            console.log('turn에 접근' + data.turn);
        }
    }, [data]);

    return (
        <div className="play">
            <div className="game">
                <div className="preview">
                    <div className="prev">
                        {!!previousWord
                            ? previousWord.substring(0, previousWord.length - 1)
                            : ''}
                        <span className="last-char">
                            {!!previousWord
                                ? previousWord.substring(
                                      previousWord.length - 1
                                  )
                                : ''}
                        </span>
                    </div>

                    <div className="current">{currentWord}</div>
                    {/* {definition} */}
                </div>
                <div className="definition">{definition}</div>
            </div>
            <div className="play-chat">
                <input
                    // disabled={!userTurn}
                    type="text"
                    // value={inputValue}
                    // id="input"
                    className="input"
                    onChange={(e) => sendChar(handleInputChange(e))}
                    onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                            CheckWord();
                            document.querySelector('.input').value = '';
                        }
                    }}
                />
                <button className="button">입력</button>
            </div>
        </div>
    );
}

export default Copy;
