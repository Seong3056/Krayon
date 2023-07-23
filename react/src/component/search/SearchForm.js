import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";

const MAX_DESCRIPTION_LENGTH = 25;
const MAX_FAVORITES_COUNT = 5;

const SelectedFavoriteDetails = ({ selectedFavorites }) => {
  if (!selectedFavorites || selectedFavorites.length === 0) return null;

  return (
    <div className="selected-favorites">
      {selectedFavorites.map((favorite) => (
        <div key={favorite.id}>
          <h4>{favorite.word}</h4>
          <p>{favorite.definition}</p>
        </div>
      ))}
    </div>
  );
};

const SearchForm = () => {
  const [searchWord, setSearchWord] = useState("");
  const [wordList, setWordList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [selectedFavorites, setSelectedFavorites] = useState([]);

  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  const handleFavoriteClick = (word) => {
    setWordList([]);
    setErrorMessage("");
    setSearchWord("");

    const isAlreadySelected = selectedFavorites.some(
      (favWord) => favWord.id === word.id
    );

    if (!isAlreadySelected) {
      setSelectedFavorites((prevSelected) => [...prevSelected, word]);
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

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
    const initialStarFillStatus = {};
    favorites.forEach((favWord, index) => {
      initialStarFillStatus[getWordId(favWord, index)] = true;
    });
    setStarFillStatus(initialStarFillStatus);
  }, [favorites]);

  const toggleDescription = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const clearSelectedFavorite = () => {
    setSelectedFavorite(null);
  };

  const getWordId = (word, index) => `${word.word}-${index}`;

  const [starFillStatus, setStarFillStatus] = useState({});

  useEffect(() => {
    setSelectedFavorite(null);
  }, [searchWord]);

  useEffect(() => {
    if (selectedFavorites.length > MAX_FAVORITES_COUNT) {
      setSelectedFavorites((prevSelected) =>
        prevSelected.slice(-MAX_FAVORITES_COUNT)
      );
    }
  }, [selectedFavorites]);

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

        setStarFillStatus((prevStatus) => ({
          ...prevStatus,
          [wordId]: true,
        }));

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

  const removeFromFavorites = (word, index) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((favWord) => {
        if (favWord.id === word.id) {
          if (selectedFavorite && selectedFavorite.id === word.id) {
            clearSelectedFavorite();
          }

          const wordId = getWordId(word, index);
          setStarFillStatus((prevStatus) => {
            const updatedStatus = { ...prevStatus };
            delete updatedStatus[wordId];
            return updatedStatus;
          });

          return false;
        }
        return true;
      })
    );

    setAlreadyAdded(false);
    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites.filter((favWord) => favWord.id !== word.id))
    );
  };

  const isWordInFavorites = (word, index) => {
    const wordId = getWordId(word, index);
    return starFillStatus[wordId];
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
            <div key={favWord.id} className="mb-1">
              <BsStarFill
                className="favorite-icon"
                onClick={() => removeFromFavorites(favWord)}
              />
              <a href="#" onClick={() => handleFavoriteClick(favWord)}>
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

      <SelectedFavoriteDetails selectedFavorites={selectedFavorites} />

      {errorMessage ? (
        <p className="error-message">{errorMessage}</p>
      ) : (
        <>
          {sortedWordList.length > 0 && !selectedFavorite && (
            <div className="search-here">
              <p className="search-results">
                검색 결과: {sortedWordList.length}개
              </p>
              <ul className="search-results-list">
                {sortedWordList.map((word, index) => {
                  const uniqueId = `${word.word}-${index}`;
                  const starFilled = starFillStatus[getWordId(word, index)];

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
                              {word.definition.slice(0, MAX_DESCRIPTION_LENGTH)}
                              ...
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
                              style={{ color: "red" }}
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
                              onClick={() => removeFromFavorites(word, index)}
                              style={{ color: "red" }}
                            />
                          ) : (
                            <BsStar
                              className="favorite-icon"
                              onClick={() => addToFavorites(word, index)}
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
          )}

          {!selectedFavorite && sortedWordList.length === 0 && searchWord && (
            <p className="no-results">검색 결과가 없습니다.</p>
          )}
        </>
      )}
    </div>
  );
};

export default SearchForm;
