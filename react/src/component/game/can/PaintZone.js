import React, { useRef, useEffect, useState, useCallback } from "react";
// style
// import { CanvasStyle } from "./style/canvas";
// import UserInfo from '../main/UserInfo';
// import Chatting from '../main/Chatting';
// import UserList from '../main/UserList';
import { CanvasStyle } from "./style/canvas";

const API = "http://localhost:8181/api/catch";

export default function PaintZone({data, sendImg, setDrawer}) {
  // useRef
  const canvasRef = useRef(null);
  const canvasRef2 = useRef(null);

  // getCtx
  const [getCtx, setGetCtx] = useState('');
  // painting state
  const [painting, setPainting] = useState(false);
  // const a =  document.getElementById('c');
  const [imageData, setImageData] = useState();
  //스크롤을 이용해서 펜과 지우개의 굵기 조정
  const [lineWidth, setLineWidth] = useState(2.5);
  //펜의 색깔을 8가지색으로 표현, 기본값은 검정
  const [penColor, setPenColor] = useState("#000000");

  const [getPic, setgetPic] = useState();

  // //데이터 보내는 소켓
  // const [img, setImg] = useState(""); //메세지
  // const [name, setName] = useState(""); //전송자
  // const [chatt, setChatt] = useState([]); //웹소켓 수신 데이터들 [] 배열
  // const [chkLog, setChkLog] = useState(false); //웹소켓 접속 여부
  // const [socketData, setSocketData] = useState(); //웹소켓 수신 메세지 {name, msg, date}
  // const [getImg, getGetImg] = useState(""); //받아서 그림 변경하기
  // const ws = useRef(null); //webSocket을 담는 변수,
  // //컴포넌트가 변경될 때 객체가 유지되어야하므로 'ref'로 저장

  // const webSocketLogin = useCallback(() => {
  //   ws.current = new WebSocket("ws://114.207.167.85:8181/socket/game");
  //   console.log("웹소켓 접속");

  //   ws.current.onmessage = (message) => {
  //     //웹소켓에서 전송한 데이터를 수신 및 객체 저장
  //     console.log("웹소켓 수신 데이터: " + message);      
  //     const dataSet = JSON.parse(message.data);
  //     const data = {
  //       name: dataSet.name,
  //       img: dataSet.img,
  //       date: dataSet.date
  //     }
  //     console.log("----------------"+data.img);
  //     setSocketData(dataSet);
  //     getGetImg(data.img);
      
      
  //   };
  // });

  //데이터 바뀔때마다 전송
  // useEffect(() => {
  //   // console.log(socketData);
  //   // const uurl = URL.createObjectURL(new Blob([socketData]));
  //   // console.log("------------------"+uurl);
  //   // document.getElementById('test').src = uurl;
  //   // setImg(socketData.img);
  //   if (socketData !== undefined) {
  //     // const tempData = chatt.concat(socketData);
  //     // console.log(tempData);
  //     // setChatt(tempData);
  //     // console.log("----------------------------------------------dataUrl"+dataURL.length);
  //   }
  // }, [socketData]); //socketData가 바뀔때마다

  //그리미 검증
  let check = setDrawer();
  // console.log(check);

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

  //getCtx 초기화를 위한 useEffect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#000000";
    setGetCtx(ctx);
  }, []);

  const drawFn = (e) => {
    // mouse position
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    // drawing
    if (!painting) {
      getCtx.moveTo(mouseX, mouseY);
      getCtx.beginPath();
    } else {
      getCtx.lineTo(mouseX, mouseY);
      getCtx.stroke();
    }

    const smallCanvas = canvasRef2.current;
    const smallCtx = smallCanvas.getContext("2d");
    smallCtx.lineJoin = "round";
    smallCtx.lineWidth = 2.5;
    smallCtx.strokeStyle = getCtx.strokeStyle;
    smallCtx.clearRect(0, 0, smallCanvas.width, smallCanvas.height);
    smallCtx.drawImage(
      canvasRef.current,
      0,
      0,
      smallCanvas.width,
      smallCanvas.height
    );
  };
  

  const sendCanvasData = async () => {
    // const canvas = canvasRef.current;
    // const dataURL = canvas.toDataURL();
    const smallCanvas = canvasRef2.current;
    const dataURLSmall = smallCanvas.toDataURL();

    //소켓으로 데이터 보내기
    //웹소켓으로 이미지 전송
    sendImg(dataURLSmall);

  };
  

  //그림받아오기
  useEffect(() => {
    if (data.img !== undefined) {
        console.log('그림' + data.img);
        setgetPic(data.img)
        
    };
}, [data]);

  useEffect(() => {
    console.log("이미지 src 바뀜");
  }, []);

  window.onload = () => {
    console.log("페이지새로고침");
  };
  
  return (
    <>
      <CanvasStyle>
        <div className="view">
          <div className="sectionMyPage">
            {!check ? (
            <div className="paintZone">
              <div className="canvasWrap" onClick={sendCanvasData}>
                <canvas
                  className="canvas"
                  ref={canvasRef}
                  onMouseDown={() => setPainting(true)}
                  onMouseUp={() => setPainting(false)}
                  onMouseMove={(e) => drawFn(e)}
                  onMouseLeave={() => setPainting(false)}
                  id="canvasDraw"
                />
              </div>

              
              
              <div className="canvasTools">
              {/* <button id="joinWebSocketBtn" onClick={joinWebSocket}>
                웹소켓 참가하기
              </button> */}
                <button id="resetBtn" onClick={resetCanvas}>
                  전체지우기
                </button>
                <button id="eraserBtn" onClick={eraseMode}>
                  지우개
                </button>
                <button id="eraserBtn" onClick={penMode}>
                  펜
                </button>
                <input
                  className="boldBar"
                  type="range"
                  min="1"
                  max="30"
                  step="0.5"
                  value={lineWidth}
                  onChange={handleChangeLineWidth}
                />

                <button
                  className="paint"
                  style={{ backgroundColor: "red" }}
                  onClick={() => handlePenColorChange("red")}
                ></button>
                <button
                  className="paint"
                  style={{ backgroundColor: "orange" }}
                  onClick={() => handlePenColorChange("orange")}
                ></button>
                <button
                  className="paint"
                  style={{ backgroundColor: "yellow" }}
                  onClick={() => handlePenColorChange("yellow")}
                ></button>
                <button
                  className="paint"
                  style={{ backgroundColor: "green" }}
                  onClick={() => handlePenColorChange("green")}
                ></button>
                <button
                  className="paint"
                  style={{ backgroundColor: "blue" }}
                  onClick={() => handlePenColorChange("blue")}
                ></button>
                <button
                  className="paint"
                  style={{ backgroundColor: "indigo" }}
                  onClick={() => handlePenColorChange("indigo")}
                ></button>
                <button
                  className="paint"
                  style={{ backgroundColor: "purple" }}
                  onClick={() => handlePenColorChange("purple")}
                ></button>
                <button
                  className="paint"
                  style={{ backgroundColor: "brown" }}
                  onClick={() => handlePenColorChange("brown")}
                ></button>
                <button
                  className="paint"
                  style={{ backgroundColor: "black" }}
                  onClick={() => handlePenColorChange("black")}
                ></button>
              </div>
            </div>
            
              ):(
            <div>
                <img src={getPic} id='test' alt="" style={{width: 800, height: 540,backgroundColor: "white"}}/>
            </div>
              )
            }
          </div>
          {/*sectionleft*/}
        </div>

        {/*그림 데이터 읽어서 이미지 src에 확인하기*/}
        <div style={{ backGroundColor: "#ffff00", width: 400, height:270, marginTop: 500}}>
          <canvas ref={canvasRef2} alt="" id="test1" width='400' height='270' />
        </div>

        
      </CanvasStyle>
    </>
  );
}
