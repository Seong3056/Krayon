import React, { useEffect, useState } from "react";

import "../../../resource/scss/game/wordmatch/WordQuiz.scss";
import TypeHangul from "../../../../node_modules/type-hangul/src/index";
const WordQuiz = ({ sendStart, data, send }) => {
  const url = "http://localhost:8181/api/match";

  const [quizDefinition, setQuizDefinition] = useState("");
  const [quizWord, setQuizWord] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (data.wordInfo !== undefined) {
      const definition = data.wordInfo.definition
        .replaceAll("(", "")
        .replaceAll(")", "");
      console.log(definition);
      setQuizDefinition(definition);
    }
  }, [data]);
  useEffect(() => {
    const $textBox = document.getElementById("textBox");
    console.log($textBox.textContent);
    if ($textBox.textContent !== "")
      TypeHangul.type("#textBox", {
        intervalType: 60,
      });
  }, [quizDefinition]);

  const fetchQuiz = async () => {
    const res = await fetch(url, { method: "GET" });
    const data = await res.json();

    setQuizDefinition(data.definition);
    setQuizWord(data.word);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e.target.value);
    }

    setAnswer(e.target.value);
  };

  const handleSubmit = (e) => {
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
    <div className="play">
      <div className="game">
        <div className="textBox">{quizDefinition}</div>
      </div>
      <div className="chat">
        <input className="input" type="text" />
        <button className="button" onClick={runWordQuiz}></button>
      </div>
    </div>
  );
};

export default WordQuiz;
