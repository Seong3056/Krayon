import React, { useState, useEffect } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const MAX_DESCRIPTION_LENGTH = 25; //단어 설명 길이
const MAX_FAVORITES_COUNT = 10; //즐찾에 추가할 수 있는 단어 수
const ITEMS_PER_PAGE = 10; //한 페이지당 보여줄 단어 수

const SearchForm = () => {
  const [searchWord, setSearchWord] = useState(""); //검색어를 입력받을 상태
  const [wordList, setWordList] = useState([]); //검색 결과 단어 리스트 상태
  const [isLoading, setIsLoading] = useState(false); //로딩 중인지 여부를 나타내는 상태
  const [errorMessage, setErrorMessage] = useState(""); //오류 메시지 상태
  const [expandedIndex, setExpandedIndex] = useState(-1); //확장된 단어 설명의 인덱스 상태
  const [alreadyAdded, setAlreadyAdded] = useState(false); //즐찾에 이미 추가되었는지 여부
  const [currentPage, setCurrentPage] = useState(1); //현재 페이지 번호
  const [cachedResults, setCachedResults] = useState({}); //페이지별 검색 결과를 캐시로 저장하는 상태(페이징 버튼이 너무 느려서)

  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem("favorites"); //로컬 스토리지에서 즐겨찾기 목록을 가져옴
    return storedFavorites ? JSON.parse(storedFavorites) : []; //JSON으로 파싱하여 즐겨찾기 목록 상태를 설정
  });

  //즐찾 목록에서 단어를 클릭할 때 호출되는 함수 -> 해당 단어를 검색 결과에서 삭제하고 에러 메시지와 검색어 입력을 초기화하며 단어를 selectedFavorite 상태로 설정함.
  const handleFavoriteClick = (word) => {
    setWordList([]); //검색 결과 목록을 빈 배열로 설정. 이로 인해 검색 결과가 화면에 표시X
    setErrorMessage(""); //이전에 발생한 에러 메시지 초기화.
    setSearchWord(""); //검색어 입력 상자를 빈 문자열로 설정. 이로 인해 이전에 입력된 검색어가 사라짐.
    setSelectedFavorite(word); //클릭한 단어를 selectedFavorite 상태로 설정함. selectedFavorite상태는 현재 선택된 단어의 정보를 가지고 있음.
  };

  //이전페이지 -> handlePagechange함수를 통해 페이지 번호를 변경한 후, handleSearch함수를 호출하여 새로운 페이지에 대한 검색을 수행함.
  const handlePreviousPage = async () => {
    handlePageChange(currentPage - 1); //함수를 호출하여 현재 페이지 번호에서 1을 빼서 이전 페이지로 이동함. 현재 페이지 번호를 나타내는 currentPage상태를 변경함.
    await handleSearch(); //이전 페이지로 이동한 후, handleSearch 함수를 호출함. 이 함수는 새로운 페이지에 대한 검색을 수행하는 역할을 함.
  };

  //페이지 번호를 변경하는 함수.
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      //만약 입력된 페이지 번호가 1보다 작다면, 즉 유효하지 않은 페이지가 입력되었다면 현재 페이지를 1로 설정함. 페이지 번호는 1 이상이여야 하며 최소 페이지 번호를 1로 제한함.
      setCurrentPage(1);
      //입력된 페이지 번호가 검색 결과 페이지 수를 초과하는 것을 방지
    } else if (pageNumber > Math.ceil(wordList.length / ITEMS_PER_PAGE)) {
      setCurrentPage(Math.ceil(wordList.length / ITEMS_PER_PAGE));
      //else는 위 두 조건을 만족하지 않으면, 즉 유효한 페이지가 입력되면 유효한 페이지 번호 범위 내에서 페이지를 변경하도록 함
    } else {
      setCurrentPage(pageNumber);
    }
  };

  //다음페이지
  const handleNextPage = async () => {
    const nextPage = currentPage + 1; //현재 페이지 번호에 1을 더한 값을 nextPage 변수에 저장함. 이는 다음 페이지 번호를 의미함.
    //이전에 캐시된 결과(cachedResults)에 다음 페이지(nextPage)의 결과가 있다면 캐시된 결과를 사용하여 다음 페이지로 이동함
    if (cachedResults[nextPage]) {
      setCurrentPage(nextPage);
      setWordList(cachedResults[nextPage]);
    } else {
      setCurrentPage(nextPage);
      await handleSearch();
    }
  };

  useEffect(() => {
    //현재 페이지 번호가 변경 될 때마다 handleSearch함수를 호출함.
    handleSearch();
  }, [currentPage]);

  //검색어를 이용하여 API로부터 검색 결과를 받을 함수. 검색어가 비어있으면 에러 메시지 출력.
  const handleSearch = async () => {
    if (!searchWord.trim()) {
      setErrorMessage("검색어를 입력하세요.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setSelectedFavorite(null);

      const response = await fetch(
        `http://localhost:8181/api/searchWord?searchWord=${encodeURIComponent(
          searchWord
        )}&start=${currentPage}`
      );

      if (response.ok) {
        const data = await response.json();
        setWordList(data);
        setErrorMessage("");
      } else {
        console.log("Request failed:", response.status);
        setWordList([]);
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

  //Enter키 누르면 handleSearch 함수를 호출함.
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  //검색 결과의 단어 설명을 펼치거나 접는 함수. 인덱스를 통해 해당 단어의 설명을 펼칠지 접을지 결정함.
  const toggleDescription = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  //선택된 즐겨찾기를 해제하는 함수. selectedFavorite함수를 null로 설정함.
  const clearSelectedFavorite = () => {
    setSelectedFavorite(null);
  };

  //단어와 인덱스를 조합하여 단어의 고유한 ID를 생성하는 함수
  const getWordId = (word, index) => `${word.word}-${index}`;

  //단어를 즐겨찾기에 추가하는 함수. 기존 즐찾에 추가할 수 있는 최대 개수를 초과하거나
  //이미 즐찾에 있는 단어라면, 즐찾에 추가할 수 없음. 추가 가능한 경우에는 새로운 즐찾
  //목록을 만드록 로컬 스토리지에 저장함.
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

  //즐찾에서 단어를 제거하는 하뭇. 해당 단어를 즐찾에서 필터링하여 새로운 즐찾 목록을 생성하고
  //로컬 스토리지에 저장함. 선택된 즐찾 단어가 제거되면 clearSelectedFavorites 함수를 호출하여 선택된 즐찾을 초기화함.
  const removeFromFavorites = (word, index) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((favWord) => favWord.id !== word.id)
    );

    const willFavoritesBecomeEmpty = favorites.length === 1;

    if (willFavoritesBecomeEmpty) {
      setAlreadyAdded(false);
    }

    if (selectedFavorite && selectedFavorite.id === word.id) {
      clearSelectedFavorite();
    }

    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites.filter((favWord) => favWord.id !== word.id))
    );

    if (selectedFavorite && selectedFavorite.id === word.id) {
      clearSelectedFavorite();
    }
  };

  //해당 단어가 즐찾에 있는지 확인하는 함수. 단어의 고유한 ID를 이용하여 즐찾 목록에서 해당 단어를 찾음.
  const isWordInFavorites = (word, index) => {
    const wordId = getWordId(word, index);
    return favorites.some((favWord) => favWord.id === wordId);
  };

  //검색 결과 단어 리스트를 단어의 텍스트를 기준으로 알파벳 순으로 정렬한 새로운 리스트.
  const sortedWordList = wordList.sort((a, b) => a.word.localeCompare(b.word));

  //현재 선택된 즐찾 단어의 상태를 나타내는 중.
  const [selectedFavorite, setSelectedFavorite] = useState(null);

  //검새겅를 사용하여 API로부터 단어를 검색하는 함수.
  const fetchWords = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setSelectedFavorite(null);

      const response = await fetch(
        `http://localhost:8181/api/searchWord?searchWord=${encodeURIComponent(
          searchWord
        )}&page=${currentPage}`
      );

      if (response.ok) {
        const data = await response.json();
        setWordList(data);
        setErrorMessage("");
      } else {
        console.log("Request failed:", response.status);
        setWordList([]);
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

  //단어 설명을 정리하는 함수로, 특문과 불필요한 공백을 제거.
  const cleanDefinition = (definition) => {
    const specialCharsAndSpacesRegex = /[^a-zA-Z가-힣0-9]/g;
    const sanitizedDefinition = definition
      .replace(specialCharsAndSpacesRegex, " ")
      .replace(/<[^>]+>|[()FLgtl&;/]/g, "")
      .trim();

    return sanitizedDefinition;
  };

  //JSX를 통해 컴포넌트의 렌더링 결과 반환시작
  return (
    <div className="search-form">
      <div className="input-group mb-3">
        {/*검색어를 input에 입력하거나 변경하면 setSearch함수를 통해 searchWord 상태가 업데이트됨.*/}
        <input
          type="text"
          className="form-control"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="검색어를 입력하세요"
        />
        {/*검색어를 입력하거나 버튼 누르면 handleSearch함수가 호출됨*/}
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? "검색 중..." : "검색"}
        </button>

        <div className="search-form"></div>
      </div>

      {/*즐찾 목록을 나타냄. favorites 상태를 map 함수를 이용하여 반복적으로 보여줌*/}
      <div className="favorites-list">
        <h3>즐겨찾기 목록</h3>
        <div className="added-favorites ml-auto">
          {favorites.map((favWord, index) => (
            <div key={favWord.id} title={favWord.word}>
              <BsStarFill
                className="favorite-icon"
                onClick={() => removeFromFavorites(favWord, index)}
                style={{ color: "blue" }}
              />
              <a href="#" onClick={() => handleFavoriteClick(favWord)}>
                <span className="favorite-word">{favWord.word}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
      {alreadyAdded && (
        //즐찾에 10개 단어가 다 차면, 경고 메시지 표시. 메시지를 닫기 위해 setAlreadyAdded 함수가 호출됨
        <div className="alert alert-warning" role="alert">
          즐겨찾기로 등록할 수 있는 단어는 최대 10개입니다.
          <button
            type="button"
            className="close custom-button"
            onClick={() => setAlreadyAdded(false)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
      {selectedFavorite ? (
        //선택된 즐찾 단어를 나타내는 부분. selectedFavorite 상태가 있으면 해당 단어의 정보를 보여주며
        //cleanDefinition 함수를 통해 단어의 설명을 깔끔하게 표시함.
        <div className="search-ys">
          <div className="search-here text-center mt-4">
            <h3 style={{ fontSize: "2rem" }}>{selectedFavorite.word}</h3>
            <br></br>
            <p style={{ fontSize: "1.2rem" }}>
              {cleanDefinition(selectedFavorite.definition)}
            </p>
          </div>
        </div>
      ) : sortedWordList.length > 0 && !selectedFavorite ? (
        //검색 결과를 보여주는 부분. 결과가 있으면 보여주지만 sortedWordList 상태를 사용하여 알파벳으로 정렬.
        //단어의 설명이 긴 경우,toggleDescription 함수를 사용하여 더보기/접기가 가능하며
        //pagination-buttons는 이전 페이지와 다음 페이지로 가는 버튼이다.
        //handlePreviousPage와 handleNextPage 함수가 호출됨.
        <div className="search-here">
          <div className="search-overing">
            <p className="search-results">
              검색 결과: {sortedWordList.length}개
            </p>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
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
                            {cleanDefinition(word.definition)}
                            <span
                              className="collapse-toggle"
                              onClick={() => toggleDescription(index)}
                            >
                              접기
                            </span>
                          </>
                        ) : (
                          <>
                            {cleanDefinition(
                              word.definition.slice(0, MAX_DESCRIPTION_LENGTH)
                            )}
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
                            style={{ color: "blue" }}
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
                        {cleanDefinition(word.definition)}
                        {starFilled ? (
                          <BsStarFill
                            className="favorite-icon"
                            onClick={() => removeFromFavorites(word, index)}
                            style={{ color: "blue" }}
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
        </div>
      ) : searchWord ? (
        <div className="search-here">
          <p className="no-results">
            저희 사전에 검색 결과가 존재하지 않습니다. 다시 입력해주세요!
          </p>
        </div>
      ) : null}
      <div className="pagination-buttons mt-3">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          이전 페이지
        </button>
        <button
          type="button"
          className="btn btn-secondary mx-2"
          onClick={handleNextPage}
          disabled={wordList.length < ITEMS_PER_PAGE}
        >
          다음 페이지
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
