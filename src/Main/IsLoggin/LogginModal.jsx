import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

// import useDidMountEffect from "../../CustomHook/useDidMountEffect";

import style from "../../UI/Modal.module.css";
import classes from "./LogginModal.module.css";
import BackDrop from "../../UI/BackDrop";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const Login = () => {
  const [enteredId, setEnteredId] = useState("");
  const [enteredPassward, setEnteredPassward] = useState("");
  const [idIsValid, setIdIsVaild] = useState();
  const [passwardIsValid, setPasswardIsVaild] = useState();
  const [formIsVaild, setFormIsValid] = useState(true);
  const [userArr, setUserArr] = useState([]);
  let count = useRef(0);

  useEffect(() => {
    setFormIsValid(
      enteredId.includes("@") && enteredPassward.trim().length > 7
    );
  }, [enteredId, enteredPassward]);

  useEffect(() => {
    if (count.current !== 0) {
      console.log(count);
      const set = new Set(userArr);
      const setString = JSON.stringify([...set]);
      sessionStorage.setItem("userLoginInfo", setString);
    }
  }, [count.current]);

  const validateIdHandler = () => {
    setIdIsVaild(enteredId.includes("@"));
  };

  const validatePasswardHandler = () => {
    setPasswardIsVaild(enteredPassward.trim().length > 7);
  };

  return (
    <div className={style.modal}>
      <form
        onSubmit={(e) => {
          // e.preventDefault();
          count.current += 1;
          let copy = userArr;
          copy = [
            ...userArr,
            { id: e.target[0].value, pass: e.target[1].value },
          ];
          setUserArr(copy);
        }}
      >
        <div>
          <div className={`${idIsValid === false ? classes.invalid : ""}`}>
            <TextField
              fullWidth
              type="email"
              label="아이디 입력(이메일 형식)"
              variant="standard"
              value={enteredId}
              onChange={(e) => {
                setEnteredId(e.target.value);
              }}
              onBlur={validateIdHandler}
            />
          </div>
          &nbsp;
          <div
            className={`${passwardIsValid === false ? classes.invalid : ""}`}
          >
            <TextField
              fullWidth
              type="password"
              label="비밀번호 입력(8자리 이상)"
              variant="standard"
              value={enteredPassward}
              onChange={(e) => {
                setEnteredPassward(e.target.value);
              }}
              onBlur={validatePasswardHandler}
            />
          </div>
        </div>
        <div className={classes.save}>
          <Button type="submit" variant="contained" disabled={!formIsVaild}>
            로그인
          </Button>
        </div>
      </form>
    </div>
  );
};

const protalElement = document.getElementById("overlays");

const LogginModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(<BackDrop onHide={props.onHide} />, protalElement)}
      {ReactDOM.createPortal(<Login onHide={props.onHide} />, protalElement)}
    </>
  );
};

export default LogginModal;
