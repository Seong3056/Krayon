import React, { useEffect, useState } from 'react';

function CheckWord() {
  const [currentWord, setCurrentWord] = useState('');
  const [previousWord, setPreviousWord] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  const API = 'http://localhost:8181/api/followWord'

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
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!gameStarted) {
      setGameStarted(true);
      setCurrentWord(inputValue);
    } else {
      if (inputValue && isCorrectInput(inputValue)) {
        try {
          const response = await fetch(API, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputValue),
          });

          if (response.ok) {
            const data = await response.text();
            if (data === 'OK') {
              setCurrentWord(inputValue);
            } else {
              alert('사전에 정의되지 않은 단어!');
              setPreviousWord(previousWord);
              setInputValue('');
              setCurrentWord('');
              return;
            }
          } else {
            console.error('Error:', response.status);
            console.error('단어조회실패');
            setInputValue('');
            setCurrentWord('');
            return;
            
          }
        } catch (error) {
          console.error('Error:', error);
          console.error('단어조회실패2');
          setInputValue('');
          setCurrentWord('');
          return;
          
        }
      } else {
        alert('올바른 단어를 입력하세요!');
        setInputValue('');
        setCurrentWord('');
        return;
      }
    }
    setInputValue('');
    setPreviousWord(currentWord);
    setCurrentWord('');
  };

  const isCorrectInput = (input) => {
    return (
      input.charAt(0) ===
      previousWord.charAt(previousWord.length - 1).toLocaleLowerCase()
    );
  };

  return (
    <div>
      <h1>끝말잇기 게임</h1>
      <p>이전 단어: {previousWord}</p>
      <p>현재 단어: {currentWord}</p>
      {!gameStarted ? (
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
          />
          {/* <button type="submit">제출</button> */}
        </form>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
          />
          {/* <button type="submit">제출</button> */}
        </form>
      )}
    </div>
  );
}

export default CheckWord;
