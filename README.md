# News fetching service

<p align="center">
  <br>
  <img width="1335" alt="스크린샷 2023-08-09 21 02 24" src="https://github.com/PerSeMaverick/newsfetching/assets/104728148/4de1d8b6-f915-45da-82ff-2eb25b80ac11">
  <br>
</p>
<br>
<p align="center">
GIF Images
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

### 기능 2 - 무한 스크롤

### 기능 3 - 게시물 저장

### 기능 4 - 게시물 검색

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
