import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onStore } from "../../Store/bookMarkSlice";
import { onShowLogin } from "../../Store/store";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faReply } from "@fortawesome/free-solid-svg-icons";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";

import style from "styled-components";

const StyledBox = style.div`
    color: #040528;
    background-color : #ffffff;
    border-radius: 20px;
    padding: 8px 10px;
    margin-bottom: 10px;
`;

const StyledLink = style.a`
    color:#a7a8b49c;
    text-decoration: none;
`;

const NewsItem = (props) => {
  const [open, setOpen] = useState(false);
  let state = useSelector((state) => state.bookMark);
  let loginState = useSelector((state) => state.loginHandler);

  let dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const onAddBookMarkHandler = () => {
    // store에 게시물 저장, 로그인 확인
    if (loginState.alreadyLogin === false) {
      dispatch(onShowLogin());
    } else {
      dispatch(
        onStore({
          id: props.id,
          title: props.title,
          description: props.description,
          originallink: props.originallink,
          pubDate: props.pubDate,
        })
      );
      setOpen(true);
    }
  };

  const onShareHandler = () => {
    // 아직 구현 안함
  };

  return (
    <StyledBox className="my-element">
      <h4>{props.title}</h4>
      <p>{props.description}</p>
      <div>
        원본기사보기:&nbsp;
        <StyledLink
          href={`${props.originallink}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {props.originallink}
        </StyledLink>
      </div>
      <h5>
        {props.pubDate}&nbsp;&nbsp;
        <Button color="success" size="small" onClick={onAddBookMarkHandler}>
          <FontAwesomeIcon
            className="icon"
            icon={faBookmark}
            style={{
              padding: "0px",
            }}
          />
          &nbsp;저장하기
        </Button>
        <Button size="small" onClick={onShareHandler}>
          <FontAwesomeIcon
            className="icon"
            icon={faReply}
            style={{
              padding: "0px",
            }}
          />
          &nbsp;공유하기
        </Button>
        {state.isExist === false ? (
          <Snackbar
            open={open}
            autoHideDuration={1000}
            onClose={handleClose}
            message="저장완료!"
          />
        ) : (
          <Snackbar
            open={open}
            autoHideDuration={1000}
            onClose={handleClose}
            message="이미 저장한 게시물 입니다!"
          />
        )}
      </h5>
    </StyledBox>
  );
};

export default NewsItem;
