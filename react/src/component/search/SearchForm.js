import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";

const MAX_DESCRIPTION_LENGTH = 25;
const MAX_FAVORITES_COUNT = 5;

const SearchForm = () => {
  const [searchWord, setSearchWord] = useState("");
  const [wordList, setWordList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

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
    setExpandedIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const getWordId = (word, index) => `${word.word}-${index}`;

  const addToFavorites = (word, index) => {
    setFavorites((prevFavorites) => {
      const wordId = getWordId(word, index);
      const isAlreadyInFavorites = prevFavorites.some(
        (favWord) => favWord.id === wordId
      );

      if (!isAlreadyInFavorites && prevFavorites.length < MAX_FAVORITES_COUNT) {
        const newFavorites = [...prevFavorites, { ...word, id: wordId }];
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
        setAlreadyAdded(false);
        return newFavorites;
      } else {
        setAlreadyAdded(true);
        return prevFavorites;
      }
    });
  };

  const closeAlert = () => {
    setAlreadyAdded(false);
  };

  const removeFromFavorites = (word) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((favWord) => favWord.id !== word.id)
    );
  };

  const isWordInFavorites = (word, index) => {
    const wordId = getWordId(word, index);
    return favorites.some((favWord) => favWord.id === wordId);
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

      <div className="favorites-list">
        <h3>즐겨찾기 목록</h3>
        <div className="added-favorites ml-auto">
          {favorites.map((favWord) => (
            <div key={favWord.id}>
              <BsStarFill
                className="favorite-icon"
                onClick={() => removeFromFavorites(favWord)}
              />
              <a
                href={`#${favWord.word}`}
                onClick={() => setSearchWord(favWord.word)}
              >
                <span>{favWord.word}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {alreadyAdded && (
        <div className="alert alert-warning" role="alert">
          등록한 단어는 재등록이 불가능합니다!
          <button type="button" className="close" onClick={closeAlert}>
            <span>&times;</span>
          </button>
        </div>
      )}

      {errorMessage ? (
        <p className="error-message">{errorMessage}</p>
      ) : sortedWordList.length > 0 ? (
        <div className="search-here">
          <p className="search-results">검색 결과: {sortedWordList.length}개</p>
          <ul className="search-results-list">
            {sortedWordList.map((word, index) => {
              const uniqueId = `${word.word}-${index}`;
              const starFilled = isWordInFavorites(word, index);

              return (
                <li key={index}>
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
                      {starFilled ? (
                        <BsStarFill
                          className="favorite-icon"
                          onClick={() => removeFromFavorites(word, index)}
                        />
                      ) : (
                        <BsStar
                          className="favorite-icon"
                          onClick={() => addToFavorites(word, index)}
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      {word.definition}
                      {starFilled ? (
                        <BsStarFill
                          className="favorite-icon"
                          onClick={() => removeFromFavorites(word)}
                        />
                      ) : (
                        <BsStar
                          className="favorite-icon"
                          onClick={() => addToFavorites(word)}
                        />
                      )}
                      <span
                        className="collapse-toggle"
                        style={{ display: "none" }}
                      >
                        접기
                      </span>
                      <span
                        className="expand-toggle"
                        style={{ display: "none" }}
                      >
                        더 보기
                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        searchWord && <p className="no-results">검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default SearchForm;
