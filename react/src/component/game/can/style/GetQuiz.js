import React, { useEffect, useState } from 'react';

const GetQuiz = () => {
  const API = 'http://localhost:8181/api/catch';
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    const getQuizData = async () => {
      try {
        const response = await fetch(API, {
          method: 'GET',
          headers: {
            'Content-Type': 'text/plain'
          }
        });

        if (response.ok) {
          const data = await response.text();
          console.log('단어 생성:', data);
          setQuizData(data);
        } else {
          console.error('데이터를 가져오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다.', error);
      }
    };

    getQuizData();
  }, []);

  return (
    <div className="getQuiz">
      <p>문제</p>
      {quizData && <p>{quizData}</p>}
    </div>
  );
};

export default GetQuiz;
