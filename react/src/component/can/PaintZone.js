// react
import React, { useRef, useEffect, useState } from "react";
// style
import { CanvasStyle } from "./style/canvas";
import UserInfo from '../main/UserInfo';
import Chatting from '../main/Chatting';
import UserList from '../main/UserList';
import Send from "./Send";
import "../../resource/scss/game/can/can.scss"
const API = 'http://localhost:8181/catch'

export default function PaintZone() {
  // useRef
  const canvasRef = useRef(null);
  // getCtx
  const [getCtx, setGetCtx] = useState(null);
  // painting state
  const [painting, setPainting] = useState(false);
  // const a =  document.getElementById('c');
  const [imageData, setImageData] = useState();
  //스크롤을 이용해서 펜과 지우개의 굵기 조정
  const [lineWidth, setLineWidth] = useState(2.5);
  //펜의 색깔을 8가지색으로 표현, 기본값은 검정
  const [penColor, setPenColor] = useState("#000000");

  const [getPic, setgetPic] = useState();

  useEffect(() => {
    // canvas useRef
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 540;
    const ctx = canvas.getContext("2d");
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#000000";
    setGetCtx(ctx);
    
  
  }, []);

  //펜의 색상선택
  const handlePenColorChange = (newColor) => {
    setPenColor(newColor);
    if (!painting) {
      getCtx.strokeStyle = newColor;
    }
  };

  //스크롤 굵기조정
  const handleChangeLineWidth = (event) => {
    const newLineWidth = parseFloat(event.target.value);
    setLineWidth(newLineWidth);
    if (!painting) {
      getCtx.lineWidth = newLineWidth;
    }
  };

  //그림초기화
  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sendCanvasData();
  };

  //지우개
  const eraseMode = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#FFFFFF";
  };

  //펜모드
  const penMode = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#000000";
    ctx.strokeStyle = penColor;
  };

  const drawFn = e => {
    // mouse position
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    // drawing
    if (!painting) {
      getCtx.beginPath();
      getCtx.moveTo(mouseX, mouseY);
    } else {
      getCtx.lineTo(mouseX, mouseY);
      getCtx.stroke();
    }
  }
  const answerSend = answerText =>{

    fetch(API+"/chat", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: answerText}),
        })
          .then((response) => response.json())
          .catch((error) => {
            console.error('오류:', error);
          });
  }
 
  const sendCanvasData = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    // console.log(typeof(dataURL));

    fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ canvasData: dataURL }),
    })
      .then((response) => response.json())
      // .then((data) => {
      //   console.log('서버 응답:', data);
      //   console.log(dataURL);
      //   console.log(canvas);
      // })
      .then(data=>{
        console.log('받은그림:', data);
        setgetPic(data.canvasData);
        console.log(getPic);

      })
      .catch((error) => {
        console.error('오류:', error);
      });
      setImageData(dataURL);
  };


  
  useEffect(() => {
    console.log('이미지 src 바뀜');  
  
  }, [getPic])

  return (
    <>
    <CanvasStyle>
      <div className="view">
        
        <div className="sectionMyPage">
        <div className="paintZone"> 
          <div className="canvasWrap" onClick={sendCanvasData}>
              <canvas 
                className="canvas"
                ref={canvasRef}
                onMouseDown={() => setPainting(true)}
                onMouseUp={() => setPainting(false)}
                onMouseMove={e => drawFn(e)}
                onMouseLeave={() => setPainting(false)}
                id="canvasDraw"
              />
            
          </div>
          <div className = "canvasTools">
                  <button id="resetBtn" onClick={resetCanvas}>전체지우기</button>
                  <button id="eraserBtn" onClick={eraseMode}>지우개</button>
                  <button id="eraserBtn" onClick={penMode}>펜</button>
                  <input className="boldBar"
                    type="range"
                    min="1"
                    max="30"
                    step="0.5"
                    value={lineWidth}
                    onChange={handleChangeLineWidth}
                  />

                <button className="paint"
                  style={{ backgroundColor: "red" }}
                  onClick={() => handlePenColorChange("red")}
                ></button>
                <button className="paint"
                  style={{ backgroundColor: "orange" }}
                  onClick={() => handlePenColorChange("orange")}
                ></button>
                <button className="paint"
                  style={{ backgroundColor: "yellow" }}
                  onClick={() => handlePenColorChange("yellow")}
                ></button>
                <button className="paint"
                  style={{ backgroundColor: "green" }}
                  onClick={() => handlePenColorChange("green")}
                ></button>
                <button className="paint"
                  style={{ backgroundColor: "blue" }}
                  onClick={() => handlePenColorChange("blue")}
                ></button>
                <button className="paint"
                  style={{ backgroundColor: "indigo" }}
                  onClick={() => handlePenColorChange("indigo")}
                ></button>
                <button className="paint"
                  style={{ backgroundColor: "purple" }}
                  onClick={() => handlePenColorChange("purple")}
                ></button>
                <button className="paint"
                  style={{ backgroundColor: "brown" }}
                  onClick={() => handlePenColorChange("brown")}
                ></button>
                <button className="paint"
                  style={{ backgroundColor: "black" }}
                  onClick={() => handlePenColorChange("black")}
                ></button>
              </div>
            </div>
        
           
        </div>{/*sectionleft*/}
        

      
         
        </div>

      {/*그림 데이터 읽어서 이미지 src에 확인하기*/}
      <div style={{backGroundColor:'#ffff00', width: 300,height:300}} >
          {/* <img src={getPic} alt="" /> */}
      </div>
    </CanvasStyle>

     
    
    
    </>
  )
}
