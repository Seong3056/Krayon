import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import {TypeHangul} from 'type-hangul';

const Hangul = () => {
  

  return (
    <div>
     <script src="https://unpkg.com/hangul-js"></script>
<script src="https://unpkg.com/type-hangul@latest/dist/type-hangul.min.js"></script>
<script src="https://unpkg.com/type-hangul"></script>


      
      <div id='aaa'>한글 컴포넌트</div>
      {/* 이 컴포넌트의 나머지 내용 */}
    </div>
  );
};

export default Hangul;











// import React, { useEffect } from 'react';

// const MyComponent = () => {
//   useEffect(() => {
//     const hangulScript = document.createElement('script');
//     hangulScript.src = 'https://unpkg.com/hangul-js';
//     document.body.appendChild(hangulScript);

//     const typeHangulScript = document.createElement('script');
//     typeHangulScript.src = 'https://unpkg.com/type-hangul@latest/dist/type-hangul.min.js';
//     document.body.appendChild(typeHangulScript);

//     return () => {
//       // 컴포넌트가 언마운트되면 스크립트를 제거합니다.
//       document.body.removeChild(hangulScript);
//       document.body.removeChild(typeHangulScript);
//     };
//   }, []);

//   // JSX 반환
//   return <div>Your React component</div>;
// };

// export default MyComponent;