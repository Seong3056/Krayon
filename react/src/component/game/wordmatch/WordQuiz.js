import React, { useEffect, useState } from 'react'

import '../../../resource/scss/game/wordmatch/WordQuiz.scss'





const WordQuiz = () => {
  

  let quiz = 'Word Quiz';
  const url = 'http://localhost:8181/api/match';

  const [definition, setDefinition] = useState('');
  const [word, setWord] = useState('');

  const fetchQuiz = async() => {
    const res = await fetch(url, { method: 'GET' });
    const data = await res.json();

    console.log(data);

    setDefinition(data.definition);
    setWord(data.word);
  }

  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {if (e.keyCode === 13) { handleSubmit(e.target.value); } };
  

  const handleSubmit = (value) => {
    if (value === word) alert('정답입니다!!');
    else alert('틀렸습니다');
    
    setInputValue('');
    document.getElementById('in').value = '';
    console.log(inputValue);
  };


  useEffect(() => { console.log(word); }, [word]);
  


  return (
    
      <div className='quizBox'>
          <div className='textBox'>{ definition }</div>
          <button onClick={fetchQuiz}>Quiz Start</button>
          <input type='text' id='in' onKeyDown={handleKeyDown} />
      <button onClick={() => handleSubmit(inputValue)}>Submit</button>
      </div>
    
  )
}

export default WordQuiz