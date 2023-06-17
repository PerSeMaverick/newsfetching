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
