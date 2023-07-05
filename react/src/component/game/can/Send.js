import React, { useState } from 'react'

const Send = ({answerSend}) => {

    const [answerText, setAnswertext] = useState();

    const sendAnswer = e =>{
        e.preventDefault()
        console.log("채팅발송");
        
        answerSend(answerText);
        console.log(answerText);

        setAnswertext('');

      }
      const inputChangeHandler = e => {
        // console.log(e.target.value);
        setAnswertext(e.target.value);
      }
  return (
    <form onSubmit={sendAnswer}>
        <input type="text" id="answer" placeholder="정답 또는 채팅을 입력해주세요!" onChange={inputChangeHandler} value={answerText}/>
    </form>
  )
}

export default Send