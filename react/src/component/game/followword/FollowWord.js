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
      setCurrentWord(value);
      setInputValue(value);
    } else {
      setCurrentWord('');
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
  const $in = document.getElementById('in');
  useEffect(() => {
    if($in != null)
    setCurrentWord($in.value);
  }, [$in])
  
  return (
    <div>
      <h1>끝말잇기 게임</h1>
      <p>이전 단어: {previousWord}</p>
      <p>현재 단어: {currentWord}</p>
      {!gameStarted ? (
        <>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onClick={handleFormSubmit}
          />
          <button type="submit">시작</button>
        </>
      ) : (
        <>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onClick={handleFormSubmit}
            id="in"
          />
          <button type="submit">제출</button>
        </>
      )}
    </div>
  );
}

export default FollowedWord;
