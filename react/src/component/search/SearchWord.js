import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";

const MAX_DESCRIPTION_LENGTH = 25;

const SearchForm = () => {
  const [searchWord, setSearchWord] = useState("");
  const [wordList, setWordList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSearchPerformed, setIsSearchPerformed] = useState(false); //검색수행여부
  const [expandedIndex, setExpandedIndex] = useState(-1); //펼쳐진 단어 인덱스길이

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setIsSearchPerformed(true);

      if (searchWord === "") {
        setWordList([]);
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:8181/api/searchWord?searchWord=${encodeURIComponent(
          searchWord
        )}`
      );

      if (response.ok) {
        const data = await response.json();
        setWordList(data);

        if (data.length === 0) {
          setErrorMessage("에러");
        }
      } else {
        console.log("Request failed:", response.status);
        setErrorMessage(
          "저희 사전에 검색 결과가 존재하지 않습니다. 다시 입력해주세요!"
        );
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setWordList([]);
      setErrorMessage("오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (searchWord === "") {
      setErrorMessage("");
    } else {
      handleSearch();
    }
  }, [searchWord]);

  const toggleDescription = (index) => {
    setExpandedIndex(index === expandedIndex ? -1 : index);
  };

  const sortedWordList = wordList.sort((a, b) => a.word.localeCompare(b.word));

  return (
    <div className="search-form">
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="검색어를 입력하세요"
        />
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? "검색 중..." : "검색"}
        </button>
      </div>

      {errorMessage ? (
        <p className="error-message">{errorMessage}</p>
      ) : sortedWordList.length > 0 ? (
        <div className="search-here">
          <p className="search-results">검색 결과: {sortedWordList.length}개</p>
          <div className="search-results-list">
            {sortedWordList.map((word, index) => (
              <div key={index}>
                <strong>{word.word} : </strong>
                {word.definition.length > MAX_DESCRIPTION_LENGTH ? (
                  <div>
                    {expandedIndex === index ? (
                      <>
                        {word.definition}
                        <span
                          className="collapse-toggle"
                          onClick={() => toggleDescription(index)}
                        >
                          접기
                        </span>
                      </>
                    ) : (
                      <>
                        {word.definition.slice(0, MAX_DESCRIPTION_LENGTH)}...
                        <span
                          className="expand-toggle"
                          onClick={() => toggleDescription(index)}
                        >
                          더 보기
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <span>{word.definition}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        searchWord && <p className="no-results"></p>
      )}
    </div>
  );
};

const App = () => {
  return (
    <div className="search">
      <div className="border-tool">
        <div className="d-flex align-items-center justify-content-center vh-100">
          <div className="game mt-5">
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
  );
};
export default App;
