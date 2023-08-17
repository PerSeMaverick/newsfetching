# News fetching service

<p align="center">
  <br>
  <img width="1335" alt="스크린샷 2023-08-09 21 02 24" src="https://github.com/PerSeMaverick/newsfetching/assets/104728148/4de1d8b6-f915-45da-82ff-2eb25b80ac11">
  <br>
</p>

<br>

<p align="center">
GIF Images
![실행테스트gif](https://github.com/PerSeMaverick/newsfetching/assets/104728148/e2320ec0-4ff0-43cc-aacb-97ac48c0d79c)
</p>

## 프로젝트 소개

<p align="justify">
프로젝트 개요/동기
  React와 Redux까지 학습한 후 배운 것은 많지만 한번도 사용해본적이 없어서 <br>
  이제 무언가 더 배우기 보다는 한번 만들어보자라는 생각으로 프로젝트를 진행했다.
</p>

<br>

## 사용 기술 스택

|   Html  |  CSS   | JavaScript |   React   |   Node  |
| :-----: | :----: | :--------: |  :------: | :-----: |
| ![html] | ![css] |   ![js]    |  ![react] | ![node] |

<br>


## 구현 기능

### 기능 1 - Session Storage와 Redux를 이용한 로그인
일단 데이터를 받아와서 가공하는 것은 뒤로 미루고, Modal을 띄워서 유저 개인 설정 기능을 먼저 만들기로 했다.<br>
twitch.com의 유저 설정 UI를 참고하여 만들었다.<br>
좌상단의 아이콘을 클릭하면 모달을 띄워 프로필 설정, 다크모드, 알림 UI가 뜨도록 만들었음.<br>
기존에 배웠던 createPotal()기능 사용.<br>
<img src='기록용 캡쳐/스크린샷 2023-04-03 17.57.41.png'>

<details>
<summary>코드 보기</summary>
<div markdown="1">
  
```javascript
(App.js)
  useEffect(() => {
    let geted = sessionStorage.getItem("userLoginInfo");
    geted = JSON.parse(geted);
    if (geted) {
      setIsLogined(true);
      dispatch(onLogined());
      console.log(geted);
    }
  }, []);
  
  <FontAwesomeIcon
    className="icon"
    icon={faUser}
    onClick={() => {
      if (loginCheck.alreadyLogin === false) {
        dispatch(onShowLogin());
      } else {
        setProfile(true);
      }
    }}
  />
```

```javascript
(IsLoggin.jsx)
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";

const MenuBtn = style.button`
  display: block;
  border:none;
  background-color: transparent;
  font-size:16px;
  padding:5px 18px;
  width: full-width;
  &:hover{
    cursor:pointer;
    background: cornflowerblue;
    color: white;
    transition: 0.3s;
  }
`;

const IsLoggin = (props) => {
  let loginHandler = useSelector((state) => state.loginHandler);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {loginHandler.showLoginModal && <LogginModal onHide={props.onHide} />}
      {props.isLogined === true ? (
        <div>
          <form
            id="logout"
            onSubmit={() => {
              setAnchorEl(null);
              dispatch(onLogined());
              sessionStorage.removeItem("userLoginInfo");
            }}
          >
            <Button id="basic-button" onClick={handleClick}>
              <Avatar
                className={classes.avatar}
                alt=""
                src="/img/project5Profile.png"
              />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={onClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuBtn
                className={classes.menuBtn}
                onClick={() => (props.onHideProfile(), setAnchorEl(null))}
              >
                &nbsp;내 계정&nbsp;
              </MenuBtn>
              <MenuBtn className={classes.menuBtn} type="submit" form="logout">
                로그아웃
              </MenuBtn>
            </Menu>
          </form>
        </div>

...생략
```
```javascript
(store.js)
initialState: {
    showLoginModal: false,
    alreadyLogin: false,
  },
reducers: {
	onShowLogin(state) {
	  if (state.showLoginModal === false) {
	    state.showLoginModal = true;
	  } else {
	    state.showLoginModal = false;
	  }
	},
	onLogined(state) {
		  state.alreadyLogin = true;
	},
</div>
```
</details>
<br>

### 기능 2 - 무한 스크롤
처음에는 div의 속성중 onScroll안에 event객체를 담고있어 scroll에 대한 정보로 쉽게 기능을 구현할 수 있겠다싶어 onScroll로 구현하려했으나<br>
스크롤을 진행하는 순간마다 이벤트가 호출되어 메인 스레드 성능에 좋지 않고, 쓰로틀(Throttle)과 같은 최적화 작업이 늘 동반되어야 한다.<br>
하지만 IntersectionObserver는 메인 스레드와 별개로 비동기적으로 실행되기 때문에,<br>
별도의 최적화가 없더라도 기본적으로 훨씬 빠른 퍼포먼스를 보여준다.<br>
⇒ 따라서 IntersectionObserver를 사용했다.<br>
<details>
<summary>코드 보기</summary>
<div markdown="1">
	
```javascript
(News.jsx)

import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";

import classes from "./News.module.css";

import axios from "axios";

const News = () => {
  let [fetchedData, setFetchedData] = useState([]);

	useEffect 내부에서 fetchData함수를 실행해서 데이터를 가져온 후에
	  useEffect(() => {
	    fetchData();
	    let timer = setTimeout(() => {
	      // 4. observeLastItem함수로 마지막 아이탬을 찾을 때까지 관찰한다.
	      const observeLastItem = (observer, items) => {
	        const lastItem = items[items.length - 1];
	        observer.observe(lastItem);
	      };
	      // 5. options.threshold로 정의한 Percent(%) 만큼 화면에 노출 혹은 제외 되면, entries 배열에 추가하고, Callback Function 을 호출한다.
	      const observerCallback = (entries, observer) => {
	        entries.forEach((entry) => {
	          console.log(entry);
	          if (entry.isIntersecting) {
		  // 6. 노출여부 확인하고 추가 요청 보내고, 이전의 마지막 아이템 관찰 중지
		    // 여기서 추가 요청 보내기
	            observer.unobserve(entry.target);
	            timer = setTimeout(() => {
	   	      // 7. 새로운 마지막 아이템 찾기
	              observeLastItem(observer, [
	                ...document.querySelectorAll(".my-element"),
	              ]);
	            }, 1000);
	          }
	        });
	      };
	
	      let items = [...document.querySelectorAll(".my-element")];
	      // 1. .map으로 랜더링 된 NewItem들을 모두 가져온다.
	      const observer = new IntersectionObserver(observerCallback, {
	        threshold: 0.9,
	      });
	      // 2. observer를 생성해주고
	      observeLastItem(observer, items);
	      // 3. observeLastItem에 생성된 items들과 observer를 넘겨 실행한다.
	    }, 2000);
	
	    return () => {
	      clearTimeout(timer);
	    };
	  }, []);

	  const fetchData = async () => {
	    try {
	      const response = await axios.get("http://localhost:8070/", {
	        params: { display: 10, sort: "sim" },
	      });
	      // console.log(response.data);
	      setFetchedData(response.data.items);
	    } catch (error) {
	      console.error("Error fetching data from server:", error);
	    }
	  };

  return (
    <div className={classes.articles}>
      {fetchedData.length === 0 ? (
        <h2>로딩중...!</h2>
      ) : (
        fetchedData.map((items, i) => (
          <NewsItem
            key={i}
            title={items.title}
            originallink={items.originallink}
            description={items.description}
            pubDate={items.pubDate}
          />
        ))
      )}
    </div>
  );
};

export default News;
```
</details>
<br>

### 기능 3 - 게시물 저장(bookmark)
처음 데이터를 받아왔을때, <br>
NewsItem에서 함수 하나를 만들어서 전달할 props값들을 객체로 만들어 놓고, <br>
어떤 작업(저장하기 버튼 누르기)으로 인해 해당 함수가 트리거 되면 그 정보를 가지고 bookMark에서 bookMarkItem으로 만든다.<br>
```
❗중요
Redux를 사용해서 state를 나눌 때는 store파일 자체를 하나 더 만드는게 아니라,
slice파일을 하나 더 만들어서 그 state를 store파일에서 import 해온 다음 등록해서 사용한다.
```
로그인하지 않으면 BookMarkModal이 뜨지 않고, LogginModal이 떠서 로그인을 해야해야만 저장기능을 이용할 수 있게 만들었다.<br>
```
1. 기존 state배열에 아무것도 없으면 payload된 객체를 배열에 추가하고, 
2. 같은 객체를 배열에 추가하려고 하면 find로 객체를 하나하나 꺼내서 기존 id와 payload된 id를 비교하고 id가 같은 객체가 존재한다면 아무런 동작을 취하지 않고, isExist의 값만 true로 변경한다.
3. 같은 id를 가진 객체가 없다면 기존 배열에 객체를 추가 한다.
4. 삭제할때는 filter를 사용해서 payload된 id와 같지 않은 item들만 다시 새로운 state에 반환한다.
```
<details>
<summary>코드 보기</summary>
<div markdown="1">
	
```javascript
(BookMarkModal.jsx)
import React from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";

import BackDrop from "../../../UI/BackDrop";

import classes from "./BookMarkModal.module.css";
import style from "../../../UI/Modal.module.css";
import BookMarkItems from "./BookMarkItems";

const BookMark = () => {
  let bookMark = useSelector((state) => state.bookMark);

  return (
    <div className={style.modal}>
      <h2>내가 저장한 기사</h2>
      {bookMark.storedArticle.length === 0 ? (
        <p>저장한 항목이 없습니다.</p>
      ) : (
        <div className={classes.bookMarks}>
          {bookMark.storedArticle.map((items) => {
            return (
              <div key={items.pubDate}>
                <BookMarkItems
                  id={items.pubDate}
                  title={items.title}
                  description={items.description}
                  originallink={items.originallink}
                  pubDate={items.pubDate}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const protalElement = document.getElementById("overlays");

const BookMarkModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(<BackDrop onHide={props.onHide} />, protalElement)}
      {ReactDOM.createPortal(<BookMark />, protalElement)}
    </>
  );
};

export default BookMarkModal;

```
```javascript
(bookMarkSlice.js)

import { createSlice } from "@reduxjs/toolkit";

let bookMark = createSlice({
  name: "bookMark",
  initialState: {
    storedArticle: [], // storedArticle 프로퍼티의 초기값을 빈 배열로 설정
    isExist: false,
  },
  reducers: {
    onStore(state, action) {
      // console.log(action.payload);
      let exist = state.storedArticle.find((origin) => {
        // console.log(origin.id);
        // console.log(action.payload.id);
        return origin.id === action.payload.id;
      });
      if (exist) {
        state.isExist = true;
        // console.log("이미 존재하는 게시물");
      } else {
        state.isExist = false;
        state.storedArticle = [...state.storedArticle, action.payload];
      }
    },
    onDeleteStore(state, action) {
      // console.log(action.payload);
      state.storedArticle = state.storedArticle.filter(
        (origin) => origin.id !== action.payload
        // filter를 사용해서 payload된 id와 같지 않은 item들만 다시 state에 담음
      );
    },
  },
});

export let { onStore, onDeleteStore } = bookMark.actions;

export default bookMark;
```
</details>
<br>

### 기능 4 - 게시물 검색
input으로 유저 입력을 받아서 변수에 저장한 다음 News.jsx로 넘겨주었다.<br>
News.jsx에서 .include()함수를 사용해서, 받아온 데이터의 기사 제목에 유저가 입력한 string이 포함되어있는지 검사한 다음 <br>
포함되어 있으면 해당 NewsItem을 렌더링 하게 코드를 작성했다.<br>

불러온 데이터를 조건에 따라 둘다 렌더링 하는 것이 아니라<br>
애초에 조건문으로 렌더링할 데이터를 필터링해서 한번만 그렸다.<br>

그리고 검색 완료 후 input에 있는 문자열을 지워서 <br>
다시 userSearchInput === ""가 되었을 때 <br>
observeLastItem함수가 실행되지 않는 문제가 있었다.<br>

이 문제는 <br>
userSearchInput을 의존성 배열에 추가하고, <br>
observerCallback 함수에 <br>
&& userSearchInput === "" 조건을 추가해서 <br>
input창에 유저의 입력이 없을 때 데이터를 추가 요청할 수 있게 했다.<br>
fetchData 함수도 기존 데이터와 중복된 데이터를 제외한 새로운 데이터만 추가해주기 위해 !prevData.some을 사용했다.<br>

<details>
<summary>코드 보기</summary>
<div markdown="1">
	
```javascript
(News.jsx line.79)

useEffect(() => {
    let timer = setTimeout(() => {
      const observeLastItem = (observer, items) => {
        const lastItem = items[items.length - 1];
        observer.observe(lastItem);
        console.log(lastItem);
      };

      const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && userSearchInput === "") {
            observer.unobserve(entry.target);
            if (reqCount.current <= 1000) {
              reqCount.current += 10;
              console.log(reqCount.current);
              // 추가 요청 보내기
              fetchData(reqCount.current);
            } else {
              setProgress(false);
              console.log("No More Data");
              return;
            }

            timer = setTimeout(() => {
              setProgress(false);
              observeLastItem(observer, [
                ...document.querySelectorAll(".my-element"),
              ]);
            }, 1000);
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, {
        threshold: 1,
      });
      observeLastItem(observer, [...document.querySelectorAll(".my-element")]);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [userSearchInput]);

let displayItems = fetchedData
    .filter((data) => {
      if (userSearchInput === "") {
        return data;
      } else if (data.title.includes(userSearchInput)) {
        return data;
      }
    })
    .map((data, i) => (
      <NewsItem
        key={i}
        id={data.pubDate}
        title={data.title}
        originallink={data.originallink}
        description={data.description}
        pubDate={data.pubDate}
      />
    ));

  return (
    <div className={classes.articles}>
      {fetchedData.length === 0 ? null : displayItems}
      {progress && (
        <LinearProgress style={{ padding: "10px", margin: "20px" }} />
      )}
    </div>
  );
```
```javascript
(News.jsx line63)
const fetchData = async (startCount) => {
    setProgress(true);
    try {
      const response = await axios.get("http://localhost:8070/", {
        params: { display: 10, start: startCount, sort: "date" },
      });
      let newItems = [...response.data.items];
      setFetchedData((prevData) => {
        // 기존 데이터와 중복된 데이터를 제외한 새로운 데이터만 추가
        const newItemsFiltered = newItems.filter(
          (item) =>
            !prevData.some((prevItem) => prevItem.pubDate === item.pubDate)
        );
        return [...prevData, ...newItemsFiltered];
      });
    } catch (error) {
      console.error("Error fetching data from server:", error);
    } finally {
      setProgress(false);
    }
  };이
```
</details>

<br>

## 배운 점 & 아쉬운 점

<p align="justify">
React와 Redux까지 배운 후 처음 만들어 본 프로젝트이다보니 기능 하나를 구현 할 때 마다 산을 넘는 기분이었다.<br>
api를 사용하거나 무한 스크롤, Redux를 이용해서 state를 바꾸는 것 등 마음대로 동작하는 것이 하나도 없었다.<br>
기본적인 자바스크립트 문법에서도 막히고, 이미 했던 실수를 다시 반복했다.<br>
부족한 점이 너무 많다고 느껴서 프로젝트 중간에 네트워크 강의까지 사서 수강했고, 클린코드는 커녕 동작이 가능하게 하는 것만으로도 버거웠다.

하지만 처음 시작했을 때는 엄두도 내지 못했던 것들을 하나씩 구현하는 재미가 있었다.<br>
모를 떄는 검색해보면 항상 답이 있었고, 헤맨만큼 내 땅이라는 말처럼 프로젝트 하기 전과 후에 내가 습득한 경험이 많이 차이나는 것 같다.<br>
모양만 만들어 놓고 동작하지 않는 컴포넌트도 많다.<br>
하지만 이번 프로젝트는 react와 redux를 활용해 state를 대충이라도 만져보고 익숙해지는 것이 목표었기 때문에 어느 정도는 만족한다.
</p>

<br>

## 외부 리소스, 라이브러리 정보
<p align="justify">
Reduxjs/toolkit<br>
axios<br>
styled-component<br>
mui
</p>

<!-- ## 라이센스

MIT &copy; [NoHack](mailto:lbjp114@gmail.com)
-->

<!-- Stack Icon Refernces -->

[html]: /icon/html.svg
[css]: /icon/css.svg
[js]: /icon/javascript.svg
[react]: /icon/react.svg
[node]: /icon/node.svg
