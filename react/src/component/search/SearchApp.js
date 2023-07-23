import SearchForm from "./SearchForm";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import "../../resource/scss/search/search.scss";
const SearchApp = () => {
  return (
    <>
      <div className="search">
        <div className="border-tool">
          <div className="d-flex align-items-center justify-content-center ">
            <div className="game mt-4">
              <div className="game-header">
                <h2>단어를 검색하세요!</h2>
              </div>
              <div className="game-content d-flex justify-content-center">
                <SearchForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchApp;
