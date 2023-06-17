import React from "react";
import style from "./Modal.module.css";

const BackDrop = (props) => {
  return <div className={style.backdrop} onClick={props.onHide}></div>;
};

export default BackDrop;
