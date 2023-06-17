import { configureStore, createSlice } from "@reduxjs/toolkit";
import bookMark from "./bookMarkSlice";

let user = createSlice({
  name: "user",
  initialState: {
    id: "",
    nickname: "",
    introduce: "",
  },
  reducers: {
    changeId(state, action) {
      return (state.id = action.payload);
    },
    changeNickName(state, action) {
      return (state.nickname = action.payload.nickname);
    },
    changeIntro(state, action) {
      return (state.introduce = action.payload.intro);
    },
  },
});

let loginHandler = createSlice({
  name: "login",
  initialState: {
    showLoginModal: false,
    alreadyLogin: false,
    showProfileModal: false,
    showBookMarkModal: false,
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
    onShowProfile(state) {
      if (state.showProfileModal === false) {
        state.showProfileModal = true;
      } else {
        state.showProfileModal = false;
      }
    },
    onShowBookMark(state) {
      if (state.showBookMarkModal === false) {
        state.showBookMarkModal = true;
      } else {
        state.showBookMarkModal = false;
      }
    },
  },
});

export let { changeId, changeNickName, changeIntro } = user.actions;
export let { onShowLogin, onLogined, onShowProfile, onShowBookMark } =
  loginHandler.actions;

export default configureStore({
  reducer: {
    user: user.reducer,
    loginHandler: loginHandler.reducer,
    bookMark: bookMark.reducer,
  },
});
