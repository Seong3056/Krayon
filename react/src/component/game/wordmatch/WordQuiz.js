import React, { useEffect, useState } from 'react';

import '../../../resource/scss/game/wordmatch/WordQuiz.scss';
import TypeHangul from '../../util/TypeHangul';
import { d } from 'hangul-js';
// import TypeHangul from '../../../../node_modules/type-hangul/src/index';

const WordQuiz = ({ word, definitionData, send, answer }) => {
    let quiz = 'Word Quiz';
    const url = 'http://localhost:8181/api/match';

    const [definition, setDefinition] = useState(' ');

    const [hintTime, setHintTime] = useState(20000);
    // const [answer, setAnswer] = useState('');
    const [msg, setMsg] = useState('');
    const [dummy, setDummy] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [ans, setAns] = useState('');
    // setDummy(sessionStorage.getItem('definition'));

    const $ans = document.getElementById('answer');
    useEffect(() => {
        // //console.log(document.getElementById('definition').textContent);
        //console.log('42424' + definitionData);
        let $def = document.getElementById('definition');

        if (definitionData !== '') {
            console.log(definitionData);

            // clearTimeout(timeout);

            // setDefinition(definitionData);
            wait();
            $def.textContent = '';
            $ans.textContent = '';
            setAns('');
            const typing = sessionStorage.getItem('definition');
            if (typing !== definition) {
                $def.parentNode.removeChild(
                    document.getElementById('definition')
                );
                const $div = document.createElement('div');
                $div.setAttribute('id', 'definition');
                document.querySelector('.game').appendChild($div);
            }
            $def = document.getElementById('definition');
            $def.textContent = definitionData;

            // //console.log(cho_hangul(word));
            $ans.textContent = cho_hangul(word);
            TypeHangul.type('#definition');

            //console.log(dummy);
        }
    }, [definitionData]);

    useEffect(() => {
        //console.log('answer' + answer);
        if (answer !== undefined) {
            setAns(answer);
        }
    }, [answer]);

    const wait = () => {
        let length = sessionStorage.getItem('definition');
        console.log(length);
        if (definition === length) return;
        else if (definition !== length) {
        }
    };

    const sendMsg = (msg) => {
        send(msg);
        document.querySelector('.input').value = '';
    };
    function cho_hangul(str) {
        const cho = [
            'ㄱ',
            'ㄲ',
            'ㄴ',
            'ㄷ',
            'ㄸ',
            'ㄹ',
            'ㅁ',
            'ㅂ',
            'ㅃ',
            'ㅅ',
            'ㅆ',
            'ㅇ',
            'ㅈ',
            'ㅉ',
            'ㅊ',
            'ㅋ',
            'ㅌ',
            'ㅍ',
            'ㅎ',
        ];
        let result = '';
        //console.log('sssssssssssssssss' + str);
        if (str !== undefined)
            for (let i = 0; i < str.length; i++) {
                let code = str.charCodeAt(i) - 44032;
                if (code > -1 && code < 11172)
                    result += cho[Math.floor(code / 588)];
            }
        return result;
    }
    const a = {
        123: 5000,
    };
    const b = 123;
    //console.log(a.b);
    return (
        <div className="play">
            <div className="game wm">
                <div id="definition"></div>
                <div id="answer"></div>
            </div>
            <div className="play-chat">
                <input
                    className="input"
                    type="text"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') sendMsg(msg);
                        else setMsg(e.target.value);
                        //console.log(e.target.value);
                    }}
                />
                <button
                    className="button"
                    // onClick={compareLength($def.textContent.length)}
                >
                    전송
                </button>
            </div>
        </div>
    );
};

export default WordQuiz;
