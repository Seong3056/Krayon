import React, { useRef, useEffect, useState } from "react";
import { CanvasStyle } from "./style/canvas";

const API = "http://localhost:8181/api/catch";

export default function PaintZone({ data, sendImg, startWord, list }) {
  // useRef
  const canvasRef = useRef(null);
  const canvasRef2 = useRef(null);

  // useState
  const [getCtx, setGetCtx] = useState(null);
  const [painting, setPainting] = useState(false);
  const [lineWidth, setLineWidth] = useState(2.5);
  const [penColor, setPenColor] = useState("#000000");
  const [getPic, setGetPic] = useState();
  const [userTurn, setUserTurn] = useState(true);

  useEffect(() => {
    // canvas useRef
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 540;
      const ctx = canvas.getContext("2d");
      ctx.lineJoin = "round";
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#000000";
      setGetCtx(ctx);
    }
  }, []);

  const handlePenColorChange = (newColor) => {
    setPenColor(newColor);
    if (!painting) {
      getCtx.strokeStyle = newColor;
    }
  };

  const handleChangeLineWidth = (event) => {
    const newLineWidth = parseFloat(event.target.value);
    setLineWidth(newLineWidth);
    if (!painting) {
      getCtx.lineWidth = newLineWidth;
    }
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sendCanvasData();
  };

  const eraseMode = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#FFFFFF";
  };

  const penMode = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#000000";
    ctx.strokeStyle = penColor;
  };

  const drawFn = (e) => {
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    if (!painting) {
      getCtx.moveTo(mouseX, mouseY);
      getCtx.beginPath();
    } else {
      getCtx.lineTo(mouseX, mouseY);
      getCtx.stroke();
    }

    const smallCanvas = canvasRef2.current;
    if (smallCanvas && getCtx) {
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
    }
  };

  const sendCanvasData = async () => {
    const smallCanvas = canvasRef2.current;
    const dataURLSmall = smallCanvas.toDataURL();
    sendImg(dataURLSmall);
  };

  useEffect(() => {
    if (data.img !== undefined) {
      console.log("그림" + data.img);
      setGetPic(data.img);
    }
  }, [data]);

  useEffect(() => {
    console.log("이미지 src 바뀜");
  }, []);

  // window.onload = () => {
  //   console.log("페이지 새로고침");
  // };

  useEffect(() => {
    if (!!startWord);
    if (data.wordInfo !== undefined) {
      console.log("단어" + data.wordInfo.pos);
      if (data.wordInfo.isVaild) {
        if (data.wordInfo.definition.length > 50) {
          console.log(data.wordInfo.definition.length);
        }
        console.log("접속 유저 리스트" + list);
      } else {
        // 단어가 없을 때
      }
    }
    console.log("!!!!!!!!!!!!!!!" + data.turn);
    if (data.turn !== undefined) {
      setUserTurn(data.turn);
      console.log("턴에 접근");
    }
  }, [data]);

  return (
    <>
      <CanvasStyle>
        <div className="view">
          <div className="sectionMyPage">
            {!userTurn ? (
              <div>
              <img
                src={getPic}
                id="test"
                alt=""
                style={{ width: 800, height: 540, backgroundColor: "white" }}
              />
            </div>
              
            ) : (
              
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
                  전체 지우기
                </button>
                <button id="eraserBtn" onClick={eraseMode}>
                  지우개
                </button>
                <button id="penBtn" onClick={penMode}>
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
            )}
          </div>
        </div>

        {/*그림 데이터 읽어서 이미지 src에 확인하기*/}
        <div style={{ backGroundColor: "#ffff00", width: 400, height: 270, marginTop: 500 }} disabled={!userTurn} >
          <canvas ref={canvasRef2} alt="" id="test1" width="400" height="270" />
        </div>
      </CanvasStyle>
    </>
  );
}
