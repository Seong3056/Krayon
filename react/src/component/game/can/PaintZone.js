import React, { useRef, useEffect, useState } from 'react';
import { CanvasStyle } from './style/canvas';
import '../../../resource/scss/gametest/followword/Play.scss';
import '../../../resource/scss/game/can/can.scss';

const API = 'http://localhost:8181/api/catch';

export default function PaintZone({
    data,
    sendImg,
    crtWord,
    list,
    sendAnswer,
}) {
    // useRef
    const canvasRef = useRef(null);
    const canvasRef2 = useRef(null);

    // useState
    const [getCtx, setGetCtx] = useState(null);
    const [painting, setPainting] = useState(false);
    const [lineWidth, setLineWidth] = useState(2.5);
    const [penColor, setPenColor] = useState('#000000');
    const [getPic, setGetPic] = useState();
    const [userTurn, setUserTurn] = useState(true);

    const [answer, setAnswer] = useState(''); //정답작성

    useEffect(() => {
        // canvas useRef
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = '100%';
            canvas.height = 540;
            const ctx = canvas.getContext('2d');
            ctx.lineJoin = 'round';
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#000000';
            setGetCtx(ctx);
            console.log('정상캔버스 등장');
        }
    }, [userTurn]);

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
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        sendCanvasData();
    };

    const eraseMode = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#FFFFFF';
    };

    const penMode = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#000000';
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
            const smallCtx = smallCanvas.getContext('2d');
            smallCtx.lineJoin = 'round';
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
            console.log('그림' + data.img);
            setGetPic(data.img);
        }
    }, [data]);

    useEffect(() => {
        console.log('이미지 src 바뀜');
    }, []);

    // window.onload = () => {
    //   console.log("페이지 새로고침");
    // };

    useEffect(() => {
        if (!!crtWord);
        if (data.wordInfo !== undefined) {
        }
        console.log('!!!!!!!!!!!!!!!' + data.turn);
        if (data.turn !== undefined) {
            setUserTurn(data.turn);
            console.log('턴에 접근');
        }
    }, [data]);

    return (
        <div className="play">
            <div className="game can">
                {!userTurn ? (
                    <div>
                        <img
                            src={getPic}
                            id="test"
                            alt=""
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'white',
                            }}
                        />
                    </div>
                ) : (
                    <div className="paintZone">
                        <div className="getQuiz" disabled={!userTurn}>
                            <p>문제 : {crtWord}</p>
                        </div>

                        <div
                            className="canvasWrap"
                            onClick={sendCanvasData}
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'white',
                            }}
                        >
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
                                style={{ backgroundColor: 'red' }}
                                onClick={() => handlePenColorChange('red')}
                            ></button>
                            <button
                                className="paint"
                                style={{ backgroundColor: 'orange' }}
                                onClick={() => handlePenColorChange('orange')}
                            ></button>
                            <button
                                className="paint"
                                style={{ backgroundColor: 'yellow' }}
                                onClick={() => handlePenColorChange('yellow')}
                            ></button>
                            <button
                                className="paint"
                                style={{ backgroundColor: 'green' }}
                                onClick={() => handlePenColorChange('green')}
                            ></button>
                            <button
                                className="paint"
                                style={{ backgroundColor: 'blue' }}
                                onClick={() => handlePenColorChange('blue')}
                            ></button>
                            <button
                                className="paint"
                                style={{ backgroundColor: 'indigo' }}
                                onClick={() => handlePenColorChange('indigo')}
                            ></button>
                            <button
                                className="paint"
                                style={{ backgroundColor: 'purple' }}
                                onClick={() => handlePenColorChange('purple')}
                            ></button>
                            <button
                                className="paint"
                                style={{ backgroundColor: 'brown' }}
                                onClick={() => handlePenColorChange('brown')}
                            ></button>
                            <button
                                className="paint"
                                style={{ backgroundColor: 'black' }}
                                onClick={() => handlePenColorChange('black')}
                            ></button>
                        </div>
                    </div>
                )}
            </div>
            <div className="play-chat">
                <input
                    className="input"
                    type="text"
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="정답 또는 채팅을 입력해주세요!"
                    // disabled={userTurn}
                    onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                            sendAnswer(answer);
                            document.querySelector('.input').value = '';
                        }
                    }}
                />
                <button className="button">입력</button>
            </div>
            <div
                style={{
                    backGroundColor: '#ffff00',
                    width: 400,
                    height: 270,
                    marginTop: 500,
                }}
                disabled={!userTurn}
            >
                <canvas
                    ref={canvasRef2}
                    alt=""
                    id="test1"
                    width="400"
                    height="270"
                />
            </div>
        </div>
    );
}
