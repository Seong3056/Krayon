import React, { useRef, useEffect, useState } from 'react';
import { CanvasStyle } from './style/canvas';
import '../../../resource/scss/gametest/followword/Play.scss';
import '../../../resource/scss/game/can/can.scss';
import html2canvas from 'html2canvas';
import bgImage from '../can/style/bg2.jpg';
import { TbCapture } from 'react-icons/tb';
import { BsStars } from 'react-icons/bs';
import { BiSolidEraser } from 'react-icons/bi';
import { FaPaintBrush } from 'react-icons/fa';
import { HiPencil } from 'react-icons/hi';
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
    const canvasWrapRef = useRef(null);
    const gameRef = useRef(null);
    const id = sessionStorage.getItem('id');

    const [canvasWidth, setCanvasWidth] = useState(
        canvasWrapRef.current?.clientWidth || 972
    );

    // useState
    const [getCtx, setGetCtx] = useState(null);
    const [painting, setPainting] = useState(false);
    const [lineWidth, setLineWidth] = useState(2.5);
    const [penColor, setPenColor] = useState('#000000');
    const [getPic, setGetPic] = useState();
    const [userTurn, setUserTurn] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);

    const [answer, setAnswer] = useState(''); //정답작성
    const [drawer, setDrawer] = useState('');
    const [correct, setCorrect] = useState('');
    const [correctUser, setCorrectUser] = useState('');

    useEffect(() => {
        // canvas useRef
        const canvas = canvasRef.current;
        // console.log(userTurn);
        if (canvas) {
            canvas.width = canvasWidth;
            canvas.height = 540;
            const ctx = canvas.getContext('2d');
            ctx.lineJoin = 'round';
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#000000';
            setGetCtx(ctx);
            console.log('정상캔버스 등장');
        }
        if (data.correct !== undefined) {
            alert('정답자: ' + data.correctUser + ' 정답: ' + data.correct);
        }
    }, [userTurn, canvasWidth, gameStarted, data.correct, data.correctUser]);

    useEffect(() => {
        // 브라우저 창 크기가 변경될 때마다 이벤트 리스너 등록
        window.addEventListener('resize', handleWindowResize);

        return () => {
            // 컴포넌트가 언마운트될 때 이벤트 리스너 해제
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    const handleWindowResize = () => {
        // game 태그의 크기를 벗어나지 않도록 캔버스의 크기를 동적으로 조절
        const gameElement = gameRef.current;
        if (gameElement) {
            const availableWidth = gameElement.clientWidth;
            setCanvasWidth(Math.min(availableWidth, 1140));
        }
    };

    const handlePenColorChange = (newColor) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        // Set the composite operation back to default for normal drawing
        ctx.globalCompositeOperation = 'source-over';
        // Set the line width back to the original value
        ctx.lineWidth = lineWidth;
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
        // Set the composite operation to "destination-out" to erase
        ctx.globalCompositeOperation = 'destination-out';
        // Set a larger line width for better erasing effect
        ctx.lineWidth = 20;
    };

    const penMode = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        // Set the composite operation back to default for normal drawing
        ctx.globalCompositeOperation = 'source-over';
        // Set the line width back to the original value
        ctx.lineWidth = lineWidth;
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

    const saveAsImageHandler = () => {
        const target = document.querySelector('.play');
        if (!target) {
            return alert('결과 저장에 실패했습니다.');
        }
        html2canvas(target).then((canvas) => {
            const link = document.createElement('a');
            document.body.appendChild(link);
            link.href = canvas.toDataURL('image/png');
            link.download = crtWord + '.png';
            link.click();
            document.body.removeChild(link);
            console.log(crtWord);
        });
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
        if (data.drawer !== undefined) setDrawer(data.drawer);
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

            // if (data.turn === true) {
            setGameStarted(true);
            //   console.log("게임 진행중");
            // }
        }
    }, [data.turn]);

    if (!!document.querySelector('.canvasTools'))
        document
            .querySelector('.canvasTools')
            .addEventListener('click', (e) => {
                const cls = document
                    .getElementById('canvasDraw')
                    .getAttribute('class');
                const can = cls.substring(cls.indexOf(' ') + 1);
                document.getElementById('canvasDraw').classList.remove(can);

                const color = e.target.getAttribute('id');
                document.getElementById('canvasDraw').classList.add(color);

                console.log(can);
            });

    return (
        <div className="play">
            <div className="game" ref={gameRef}>
                {!userTurn ? (
                    <div className="getQuiz" disabled={!userTurn}>
                        <p>{drawer} 그림을 그리는중...</p>

                        <img
                            src={getPic}
                            id="getPicture"
                            alt=""
                            style={{
                                width: '100%',
                                height: 540,
                                backgroundImage: `url(${bgImage})`,
                            }}
                        />
                    </div>
                ) : gameStarted ? (
                    <div className="paintZone">
                        <div className="getQuiz" disabled={!userTurn}>
                            <p>문제 : {crtWord}</p>
                        </div>

                        <div
                            className="canvasWrap"
                            onClick={sendCanvasData}
                            style={{
                                width: '100%',
                                height: 540,
                                backgroundColor: 'white',
                            }}
                            ref={canvasWrapRef}
                        >
                            <canvas
                                className="canvas"
                                ref={canvasRef}
                                onMouseDown={() => setPainting(true)}
                                onMouseUp={() => setPainting(false)}
                                onMouseMove={(e) => drawFn(e)}
                                onMouseLeave={() => setPainting(false)}
                                // style={{ width: "100%", height: "100%" }}
                                id="canvasDraw"
                            />
                        </div>

                        <div className="canvasTools">
                            <TbCapture
                                id="resetBtn"
                                className="ctrlBtn"
                                onClick={saveAsImageHandler}
                            >
                                {' '}
                                화면 캡쳐
                            </TbCapture>
                            <BsStars
                                id="resetBtn"
                                className="ctrlBtn"
                                onClick={resetCanvas}
                            >
                                전체 지우기
                            </BsStars>
                            <BiSolidEraser
                                id="eraserBtn"
                                className="ctrlBtn"
                                onClick={eraseMode}
                            >
                                지우개
                            </BiSolidEraser>
                            {/* <HiPencil id="penBtn" className="ctrlBtn"onClick={penMode}>
                                펜
                            </HiPencil>
              {/* <button id="brushBtn" onClick={penMode}>
                붓
                            </button> */}
                            <input
                                className="boldBar"
                                type="range"
                                min="1"
                                max="30"
                                step="0.5"
                                value={lineWidth}
                                onChange={handleChangeLineWidth}
                            />
                            <div className="palette">
                                <button
                                    className="paint"
                                    id="red"
                                    style={{ backgroundColor: '#ff0000' }}
                                    onClick={() =>
                                        handlePenColorChange('#ff0000')
                                    }
                                ></button>
                                <button
                                    className="paint"
                                    id="orange"
                                    style={{ backgroundColor: 'orange' }}
                                    onClick={() =>
                                        handlePenColorChange('orange')
                                    }
                                ></button>
                                <button
                                    className="paint"
                                    id="yellow"
                                    style={{ backgroundColor: 'yellow' }}
                                    onClick={() =>
                                        handlePenColorChange('yellow')
                                    }
                                ></button>
                                <button
                                    className="paint"
                                    id="green"
                                    style={{ backgroundColor: 'green' }}
                                    onClick={() =>
                                        handlePenColorChange('green')
                                    }
                                ></button>
                                <button
                                    className="paint"
                                    id="blue"
                                    style={{ backgroundColor: 'blue' }}
                                    onClick={() => handlePenColorChange('blue')}
                                ></button>
                                <button
                                    className="paint"
                                    style={{ backgroundColor: 'indigo' }}
                                    onClick={() =>
                                        handlePenColorChange('indigo')
                                    }
                                ></button>
                                <button
                                    className="paint"
                                    id="purple"
                                    style={{ backgroundColor: 'purple' }}
                                    onClick={() =>
                                        handlePenColorChange('purple')
                                    }
                                ></button>
                                <button
                                    className="paint"
                                    id="brown"
                                    style={{ backgroundColor: 'brown' }}
                                    onClick={() =>
                                        handlePenColorChange('brown')
                                    }
                                ></button>
                                <button
                                    className="paint"
                                    id="black"
                                    style={{ backgroundColor: 'black' }}
                                    onClick={() =>
                                        handlePenColorChange('black')
                                    }
                                ></button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p>Waiting for the game to start...</p>
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
