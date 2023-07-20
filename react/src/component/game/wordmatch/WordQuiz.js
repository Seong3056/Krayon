import React, { useEffect, useState } from "react";

import "../../../resource/scss/game/wordmatch/WordQuiz.scss";

const WordQuiz = () => {
  const url = "http://localhost:8181/api/match";

  const [quizDefinition, setQuizDefinition] = useState("");
  const [quizWord, setQuizWord] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    console.log(quizWord);
  }, [quizWord]);

  const fetchQuiz = async () => {
    const res = await fetch(url, { method: "GET" });
    const data = await res.json();

    // console.log(data);
    // console.log(data.definition + ": " + data.word);
    setQuizDefinition(data.definition);
    setQuizWord(data.word);
    // console.log(quizWord + " " + quizDefinition);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e.target.value);
    }
    // console.log(e.target.value);
    setAnswer(e.target.value);
  };

  const handleSubmit = (e) => {
    // if (e === quizWord) alert("정답입니다!!");
    // else alert("틀렸습니다");

    setAnswer(e);
    document.getElementById("in").value = "";
  };

  const runWordQuiz = () => {
    console.log("버튼이 눌림");
    let count = 1;

    let quiz = setInterval(() => {
      console.log("인터벌 진입");

      count++;
      console.log("count: " + count);

      if (count > 4) {
        console.log("중지시켜~~~~~~~~~~~~~~~~~~");
        clearInterval(quiz);
      }

      fetchQuiz();

      console.log("정답: " + quizWord);
      console.log("answer: " + answer);

      if (answer !== "" && answer === quizWord) {
        console.log("정답: " + quizWord);
        console.log("answer: " + answer);
        clearInterval(quiz);
      }
    }, 3000);
  };

  return (
    <div className="quizBox">
      <div className="textBox">{quizDefinition}</div>
      <button onClick={runWordQuiz}>Quiz Start</button>
      <input type="text" id="in" onKeyDown={handleKeyDown} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default WordQuiz;
