import React, { useCallback, useEffect, useRef, useState } from "react";
import "../../resource/scss/main/Rooms.scss";
import { Link, useNavigate } from "react-router-dom";

const Rooms = ({ dis, describe }) => {
  const handler = (e) => {
    let pickCardTitle = e.target.querySelector("i").textContent;

    console.log("자식: " + pickCardTitle);
    dis();
    describe(pickCardTitle);
  };

  return (
    <>
      <ul class="col col2">
        <Link to="" onClick={handler} className="room room1">
          <i className="lab" id="game1">
            캐치마인드
          </i>
        </Link>
        <Link to="" onClick={handler} className="room room2">
          <i className="lab" id="game2">
            끝말잇기
          </i>
        </Link>
        <Link to="" onClick={handler} className="room room3">
          <i className="lab" id="game3">
            단어맞추기
          </i>
        </Link>
        <Link to="" onClick={handler} className="room room4">
          <i className="lab" id="game4">
            단어맞추기
          </i>
        </Link>
      </ul>
    </>
  );
};

export default Rooms;
