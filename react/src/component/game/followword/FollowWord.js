import React, { useEffect, useState } from 'react';

function FollowedWord() {
  const [currentWord, setCurrentWord] = useState('');
  const [previousWord, setPreviousWord] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      setPreviousWord(currentWord);
    }
  }, [currentWord, gameStarted]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    const koreanRegex = /^[ㄱ-ㅎㅏ-ㅣ가-힣\s]*$/;
    if (koreanRegex.test(value)) {
      setInputValue(value);
    } else {
      setInputValue('');
      if (value.trim() !== '') {
        alert('한글을 입력하세요!');
      }
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!gameStarted) {
      setGameStarted(true);
      setCurrentWord(inputValue);
    } else {
      if (inputValue && isCorrectInput(inputValue)) {
        setCurrentWord(inputValue);
      } else {
        alert('올바른 단어를 입력하세요!');
      }
    }
    setInputValue('');
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
          <button type="submit">시작</button>
        </form>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button type="submit">제출</button>
        </form>
      )}
    </div>
  );
}

export default FollowedWord;
