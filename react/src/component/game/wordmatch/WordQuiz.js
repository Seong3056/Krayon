import React, { useEffect, useState } from 'react';

import '../../../resource/scss/game/wordmatch/WordQuiz.scss';

const WordQuiz = () => {
    let quiz = 'Word Quiz';
    const url = 'http://localhost:8181/api/match';

    const [definition, setDefinition] = useState('');
    const [word, setWord] = useState('');
    const [hintTime, setHintTime] = useState(20000);
    const [answer, setAnswer] = useState('');

    useEffect(() => {
        console.log(word);
    }, [word]);

    const fetchQuiz = async () => {
        const res = await fetch(url, { method: 'GET' });
        const data = await res.json();

        console.log(data);

        setDefinition(data.definition);
        setWord(data.word);
    };

    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            handleSubmit(e.target.value);
        }
    };

    const handleSubmit = (a) => {
        // if (answer === word) alert('정답입니다!!');
        // else alert('틀렸습니다');
        // const a = document.getElementById('in').value;

        setAnswer(a);
        setInputValue('');
        document.getElementById('in').value = '';
        console.log(inputValue);
    };

    const runWordQuiz = () => {
        console.log('버튼이 눌림');
        let count = 1;

        let quiz = setInterval(() => {
            console.log('인터벌 진입');

            count++;
            console.log('count: ' + count);

            if (count > 4) {
                console.log('중지시켜~~~~~~~~~~~~~~~~~~');
                clearInterval(quiz);
            }

            fetchQuiz();

            if (answer === word) {
                console.log('정답: ' + word);
                console.log('answer: ' + answer);
                clearInterval(quiz);
            }
        }, 3000);
    };

    // <div className='quizBox'>
    //         <div className='textBox'>{ definition }</div>
    //         <button onClick={runWordQuiz}>Quiz Start</button>
    //         <input type='text' id='in' onKeyDown={handleKeyDown} />
    //     <button onClick={() => handleSubmit(inputValue)}>Submit</button>
    //     </div>

    return (
        <div className="play">
            <div className="game">
                <div className="textBox">{definition}</div>
            </div>
            <div className="chat">
                <input className="input" type="text" />
                <button className="button" onClick={runWordQuiz}></button>
            </div>
        </div>
    );
};

export default WordQuiz;
