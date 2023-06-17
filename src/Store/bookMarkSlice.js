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
