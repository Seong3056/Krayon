import React, { useState, useEffect } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";

const MAX_DESCRIPTION_LENGTH = 25; //최대 정의 길이
const MAX_FAVORITES_COUNT = 5; //최대 즐겨찾기 수

const SearchForm = () => {
  const [searchWord, setSearchWord] = useState(""); // 검색어 상태 변수
  const [wordList, setWordList] = useState([]); // 단어 목록 상태 변수
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 변수
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태 변수
  const [expandedIndex, setExpandedIndex] = useState(-1); // 확장된 단어 설명 인덱스 상태 변수
  const [alreadyAdded, setAlreadyAdded] = useState(false); // 이미 추가된 즐겨찾기인지 여부 상태 변수

  // favorites 라는 즐겨찾기 목록 상태 변수 (로컬 스토리지에서 불러옴)
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem("favorites"); //getItem메서드로 favorites라는 키로 저장된 데이터를 불러옴
    return storedFavorites ? JSON.parse(storedFavorites) : []; //데이터가 있으면 JSON 형식으로 파싱하여 즐찾 목록으로 설정하고, 데이터 없으면 빈 배열로 초기화.
  });

  // 즐겨찾기 클릭 핸들러
  //word는 클릭 된 단어를 뜻함
  const handleFavoriteClick = (word) => {
    setWordList([]); // 단어 목록 초기화 -> 즉, 빈 배열을 인자로 전달하여 단어 목록 초기화함. 이로 인해 검색 결과가 표시되는 부분이 비어있음
    setErrorMessage(""); // 오류 메시지 초기화
    setSearchWord(""); // 검색어 초기화 -> 즉, setSearchWord 함수를 사용하여 검색어 상태 변수인 searchWord를 초기화함. 이로 인해 검색어 입력 필드가 비워짐
    setSelectedFavorite(word); // 선택된 즐겨찾기 설정 -> 선택된 즐찾를 설정함. 즐찾 정보가 상태변수 selectedFavortie에 저장되고 즐찾 단어와 정의가 화면에 표시됨.
  };

  // 1검색 버튼 클릭 핸들러
  const handleSearch = async () => {
    //비동기 함수인 async를 사용하여 비동기적으로 API 호출과 데이터처리 수행함
    try {
      setIsLoading(true); // 로딩 상태 설정 -> 함수를 호출하여 로딩 상태를 ture로 설정함. 이렇게하면 화면에 로딩 중인 UI 표시가 가능해짐
      setErrorMessage(""); // 오류 메시지 초기화

      // 검색어가 비어있으면 단어 목록 초기화 후 종료 -> searchWord가 비어있으면 setWordList[]를 호출하여 단어 목록을 빈 배열로 초기화하고 setIsLoading(false)를 호출하여 로딩 상태를 해제한다. 이후 함수 실행을 종료함.
      if (searchWord === "") {
        setWordList([]);
        setIsLoading(false);
        return;
      }

      // API 호출하여 단어 목록 검색 -> fetch를 통해 API호출. URL에는 검색어 searchWord를 인코딩하여 포함시킴. API서버에서는 검색어와 관련된 단어 목록을 반환함
      const response = await fetch(
        `http://localhost:8181/api/searchWord?searchWord=${encodeURIComponent(
          searchWord
        )}`
      );
      //다시 프론트로와서
      // API 응답 데이터를 JSON 형태로 변환하여 저장
      if (response.ok) {
        //성공하면 레스폰스제이슨을 사용하여 응답 데이터를 JSON형태로 변환하여 저장
        const data = await response.json();
        setWordList(data); // 단어 목록 상태 업데이트

        if (data.length === 0) {
          setErrorMessage("에러"); // 단어 목록이 비어있으면 오류 메시지 설정
        }
      } else {
        // API 호출이 실패하면 오류 메시지 설정
        console.log("Request failed:", response.status);
        setErrorMessage(
          "저희 사전에 검색 결과가 존재하지 않습니다. 다시 입력해주세요!"
        );
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setWordList([]);
      setErrorMessage("오류가 발생했습니다."); // 오류 발생 시 오류 메시지 설정
    } finally {
      setIsLoading(false); // API 호출이 완료되면 로딩 상태 해제
    }
  };

  // 검색어 입력 시 Enter 키 입력 핸들러
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // 검색 버튼 클릭 핸들러 호출
    }
  };

  // 단어 설명 확장/축소 토글 핸들러
  const toggleDescription = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  // 선택된 즐겨찾기 초기화 핸들러
  const clearSelectedFavorite = () => {
    setSelectedFavorite(null);
  };

  // 고유한 단어 ID 생성
  const getWordId = (word, index) => `${word.word}-${index}`; //word는 검색 결과의 개별 단어 개체를 뜻함. index word는 sortedWordList배열에 있는 객체의 인덱스임
  //고유한 단어 ID 생성 사용법
  //word.word이 함수는 및 index하이픈을 사용하여
  //결합하여 단어의 고유 식별자를 반환합니다 -. 템플릿 문자열은 (실제 단어) ${word.word}-${index}를 와 연결하여 새 문자열을 만듭니다 .word.wordindex
  //예를 들어 the word.word가 "apple"이고 the index가 0이면 getWordId함수는 를 반환합니다 "apple-0". 가 1 이면 index을 반환합니다 "apple-1". 이렇게 하면 즐겨찾기 목록의 각 단어가 목록의 내용과 위치에 따라 고유한 식별자를 갖게 됩니다.

  // 즐겨찾기에 단어 추가 핸들러. 별누르면호출
  // word는 추가할 단어 개체와 index는 검색 결과 목록에서 단어의 인덱스를 뜻함
  const addToFavorites = (word, index) => {
    setFavorites((prevFavorites) => {
      //prevFavorites는 업데이트 전 즐겨찾기 목록의 이전 상태를 나타내는 변수임
      const wordId = getWordId(word, index); // wordId는 고유한 단어 ID 생성
      // 이미 즐겨찾기에 있는지 확인
      const isAlreadyInFavorites = prevFavorites.some(
        (favWord) => favWord.id === wordId
      );

      // 즐겨찾기에 없고 최대 즐겨찾기 수를 초과하지 않을 경우
      if (!isAlreadyInFavorites && prevFavorites.length < MAX_FAVORITES_COUNT) {
        const newFavorites = [...prevFavorites, { ...word, id: wordId }]; // 단어가 즐찾에 없고 제한이 도달하지 않았으니, newFavoriets라는 기존 즐찾 배열을 펼치고 prevFavorites라는 새 개체를 추가하여 새 배열만듬. 새 개체는 word 검색 결과에서 개체를 펼치고 id값이 있는 추가 속성을 추가하여 생성함.
        localStorage.setItem("favorites", JSON.stringify(newFavorites)); //배열을 JSON으로 변환하고 즐찾 키 아래에 저장하여 로컬 저장소의 즐찾 목록을 업데이트함
        setAlreadyAdded(false); // 경고 플래그 초기화 -> 플래그는 최대 즐찾 수 초과에 대한 이전 경고 메시지를 지우도록 alreadyAdded 변수 설정을 false로한다.
        return newFavorites; //newFavorites는 즐찾 목록의 새 상태를 나타내는 업데이트된 배열을 반환한다
      } else {
        // 이미 즐겨찾기에 있거나 최대 즐겨찾기 수를 초과한 경우
        setAlreadyAdded(true); // 경고 플래그 설정 -> 단어가 이미 즐찾에 있거나 최대 즐찾 수에 도달한 경우 플래그인 alreadyAdded를 true로 하여 경고 메시지를 표시함
        return prevFavorites;
      }
    });
  };

  // 즐겨찾기에서 단어 제거 핸들러
  const removeFromFavorites = (word, index) => {
    setFavorites(
      (
        prevFavorites //즐찾 목록의 현재 상태를 나타내는 prevFavorites를 사용한다.
      ) => prevFavorites.filter((favWord) => favWord.id !== word.id) //word.id. 이렇게 하면 즐겨찾기 목록에서 해당 단어가 효과적으로 제거됨
    );
    // 즐겨찾기에서 해당 단어를 제외한 목록으로 업데이트
    // 제거된 단어가 선택된 즐겨찾기인 경우 선택 초기화
    if (selectedFavorite && selectedFavorite.id === word.id) {
      // 즉, 제거된 단어가 현재 선택된 즐찾(selectedFavorite에 저장된)인 경우 함수를 호출하여 선택를 해제함
      clearSelectedFavorite();
    }

    // 제거된 즐겨찾기를 로컬 스토리지에 반영 -> 제거된 단어를 제외하도록 상태를 업뎃한 후, favorites함수는 변경 사항을 반영하도록 로컬 저장소를 업뎃함. favorites은 업뎃된 배열(제거된단어없음)을 JSON문자열로 변환하고 로컬 저장소의 즐찾 키 아래에 저장한다.
    // 그리고 사용자가 페이지를 새로 고치거나 브라우저 닫아도 변경 사항이 지속되게 함
    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites.filter((favWord) => favWord.id !== word.id))
    );
  };

  // 단어가 즐겨찾기에 있는지 확인하는 함수
  // 고유한 단어 ID 생성
  const isWordInFavorites = (word, index) => {
    const wordId = getWordId(word, index);
    // 단어 ID가 즐겨찾기에 있는지 확인하여 반환
    return favorites.some((favWord) => favWord.id === wordId);
  };

  const sortedWordList = wordList.sort((a, b) => a.word.localeCompare(b.word)); // 단어 목록을 알파벳 순으로 정렬

  const [selectedFavorite, setSelectedFavorite] = useState(null); // 선택된 즐겨찾기 상태 변수

  // 검색어가 변경되면 선택된 즐겨찾기 초기화
  useEffect(() => {
    setSelectedFavorite(null);
  }, [searchWord]);

  const cleanDefinition = (definition) => {
    // 정의에서 남아있는 HTML 태그(예: "<FL>") 제거 함수
    // return definition.replace(/<[^>]+>/g, "").trim();
    // HTML 태그와 "gt", "l", "&" 문자 제거
    return definition.replace(/<[^>]+>|[gtl&;/]/g, "").trim();
  };

  //검색 폼 랜더링
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
          {/* 즐겨찾기 목록 랜더링 */}
          {favorites.map((favWord, index) => (
            <div key={favWord.id}>
              <BsStarFill
                className="favorite-icon"
                onClick={() => removeFromFavorites(favWord, index)}
                style={{ color: "blue" }}
              />
              <a href="#" onClick={() => handleFavoriteClick(favWord)}>
                <span>{favWord.word}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
      {alreadyAdded && (
        // 즐겨찾기 추가 경고 메시지 랜더링
        <div className="alert alert-warning" role="alert">
          즐겨찾기로 등록할 수 있는 단어는 최대 5개입니다.
          <button
            type="button"
            className="close"
            onClick={() => setAlreadyAdded(false)}
          >
            <span>&times;</span>
          </button>
        </div>
      )}
      {selectedFavorite ? (
        // 선택된 즐겨찾기 랜더링
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
        // 검색 결과 랜더링
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
      ) : !selectedFavorite && sortedWordList.length === 0 && searchWord ? (
        // 검색 결과 없음 메시지 랜더링
        <p className="no-results">검색 결과가 없습니다.</p>
      ) : null}
    </div>
  );
};

export default SearchForm;
