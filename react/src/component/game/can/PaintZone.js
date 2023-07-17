// react
import React, { useRef, useEffect, useState, useCallback } from "react";
// style
// import { CanvasStyle } from "./style/canvas";
// import UserInfo from '../main/UserInfo';
// import Chatting from '../main/Chatting';
// import UserList from '../main/UserList';
import Send from "./Send";
import { CanvasStyle } from "./style/canvas";

const API = "http://localhost:8181/api/catch";

export default function PaintZone() {
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

  //데이터 보내는 소켓
  const [img, setImg] = useState(""); //메세지
  const [name, setName] = useState(""); //전송자
  const [chatt, setChatt] = useState([]); //웹소켓 수신 데이터들 [] 배열
  const [chkLog, setChkLog] = useState(false); //웹소켓 접속 여부
  const [socketData, setSocketData] = useState(); //웹소켓 수신 메세지 {name, msg, date}
  const ws = useRef(null); //webSocket을 담는 변수,
  //컴포넌트가 변경될 때 객체가 유지되어야하므로 'ref'로 저장

  let picData = "";
  const webSocketLogin = useCallback(() => {
    ws.current = new WebSocket("ws://localhost:8181/socket/game");
    console.log("웹소켓 접속");

    ws.current.onmessage = (message) => {
      //웹소켓에서 전송한 데이터를 수신 및 객체 저장
      console.log("웹소켓 수신 데이터: " + message);      
      const dataSet = JSON.parse(message.data);
      const data = {
        name: dataSet.name,
        img: dataSet.img,
        date: dataSet.date
      }
      console.log("----------------"+data);
      setSocketData(data);
      
      
    };
  });

  //데이터 바뀔때마다 전송
  useEffect(() => {
    console.log(socketData);
    // const uurl = URL.createObjectURL(new Blob([socketData]));
    // console.log("------------------"+uurl);
    // document.getElementById('test').src = uurl;
    // setImg(socketData.img);
    if (socketData !== undefined) {
      // const tempData = chatt.concat(socketData);
      // console.log(tempData);
      // setChatt(tempData);
      // console.log("----------------------------------------------dataUrl"+dataURL.length);
    }
  }, [socketData]); //socketData가 바뀔때마다

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

  const drawFn = (e) => {
    // mouse position
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    // drawing
    if (!painting) {
      getCtx.beginPath();
      getCtx.moveTo(mouseX, mouseY);
    } else {
      getCtx.lineTo(mouseX, mouseY);
      getCtx.strike();
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
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    // setImg(dataURL);
    setgetPic(dataURL);
    // console.log(getPic);

    const smallCanvas = canvasRef2.current;
    const dataURLSmall = smallCanvas.toDataURL();
    console.log(dataURLSmall);
    
    const blob = await (await fetch(dataURLSmall)).blob();
    const file = new File([blob], "image.png", { type: "image/png" });
    // var formdata = new FormData(); // formData 생성
    // formdata.append("file", file); // file data 추가

    // console.log(typeof(dataURL));

    

    //소켓으로 데이터 보내기
    //웹소켓으로 메세지 전송
    if (!chkLog) {
      //웹소켓 로그인안됬을경우 (!false)

      webSocketLogin();
      setChkLog(true);
    }
    const date =
      (new Date().getHours() < 10
        ? "0" + new Date().getHours()
        : new Date().getHours()) +
      ":" +
      (new Date().getMinutes() < 10
        ? "0" + new Date().getMinutes()
        : new Date().getMinutes());

    if (img !== '') {
            //메세지를 data에 담아 백엔드로 JSON 객체 전송
            const data = {
                name,
                img: dataURLSmall,
                date: date,
            }; //전송 데이터(JSON)

            const temp = JSON.stringify(data);

            if (ws.current.readyState === 0) {
                //readyState는 웹 소켓 연결 상태를 나타냄
                ws.current.onopen = () => {
                    //webSocket이 맺어지고 난 후, 실행
                    console.log(ws.current.readyState);
                    ws.current.send(temp);
                };
            } else {
                ws.current.send(temp);
            }
        } else {
            // 입력창이 공란일경우 안내창
            // alert('메세지를 입력하세요.');
            // document.getElementById('chat').focus();
            // return;
        }
        
        
  };

  useEffect(() => {
    console.log("이미지 src 바뀜");
    // console.log(ws.current.readyState);
  }, [img]);
  // if (window.location.reload()) console.log("페이지새로고침");
  window.onload = () => {
    console.log("페이지새로고침");
  };

  // let i = document.getElementById('test').style.width
  // i.style.width = '160px';
  // i.style.height = '108px';
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
                  onMouseMove={(e) => drawFn(e)}
                  onMouseLeave={() => setPainting(false)}
                  id="canvasDraw"
                />
              </div>
              <div className="canvasTools">
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
          </div>
          {/*sectionleft*/}
        </div>

        {/*그림 데이터 읽어서 이미지 src에 확인하기*/}
        <div style={{ backGroundColor: "#ffff00", width: 400, height:270, marginTop: 500}}>
          <canvas ref={canvasRef2} alt="" id="test1" width='400' height='270' />
        </div>

        <div>
          <img src={img} id='test' alt="" style={{width: 800, height: 540,backgroundColor: "white"}}/>
        </div>
      </CanvasStyle>
    </>
  );
}
