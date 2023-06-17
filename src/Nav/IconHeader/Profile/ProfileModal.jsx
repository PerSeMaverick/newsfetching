import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import BackDrop from "../../../UI/BackDrop";
import { useDispatch } from "react-redux";
import { changeId, changeNickName, changeIntro } from "../../../Store/store";

import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import style from "../../../UI/Modal.module.css";
import classes from "./ProfileModal.module.css";

const ProfileItem = styled.div`
  padding: 20px;
  border: 1px solid gray;
  border-radius: 10px;
`;

const ProfileDetail = styled.div`
  display: flex;
  padding: 10px;
  font-weight: bolder;
`;

const Profile = (props) => {
  const fileInput = useRef(null);
  const [id, setId] = useState();
  const [nickName, setNickName] = useState();
  const [intro, setIntro] = useState();

  const handleChange = (e) => {
    console.log(fileInput.current);
    console.log(e.target.files[0]);
  };

  let dispatch = useDispatch();

  return (
    <div className={style.modal}>
      <h2>프로필 사진</h2>
      <ProfileItem>
        <div className={classes.photo}>
          <Avatar
            alt="Remy Sharp"
            src="/img/project5Profile.png"
            sx={{ width: 80, height: 80 }}
            style={{ border: "2px solid gray", marginRight: "20px" }}
          />
          <div>
            <Button
              variant="contained"
              component="label"
              style={{ marginTop: "10px" }}
            >
              프로필 사진 변경
              <input
                hidden
                accept=".jpeg, .png, .gif"
                type="file"
                ref={fileInput}
                onChange={handleChange}
              />
            </Button>
            <p>10MB 이내의 JPEG, PNG, GIF 형식이어야 합니다.</p>
          </div>
        </div>
      </ProfileItem>
      <h2>프로필 설정</h2>
      <p style={{ color: "gray" }}>계정의 세부 정보 변경</p>
      <ProfileItem>
        <ProfileDetail>
          <div className={classes.detail}>아이디</div>
          <TextField
            id="outlined-textarea"
            label="아이디 입력"
            multiline
            onChange={(e) => {
              setId(e.target.value);
            }}
          />
        </ProfileDetail>
        <ProfileDetail>
          <div className={classes.detail}>닉네임</div>
          <TextField
            id="outlined-textarea"
            label="닉네임 설정"
            multiline
            onChange={(e) => {
              setNickName(e.target.value);
            }}
          />
        </ProfileDetail>
        <ProfileDetail>
          <div className={classes.detail}>자기 소개</div>
          <TextField
            id="outlined-multiline-static"
            label="자기 소개"
            multiline
            rows={3}
            onChange={(e) => {
              setIntro(e.target.value);
            }}
          />
        </ProfileDetail>
      </ProfileItem>
      <div className={classes.save}>
        <Button
          variant="contained"
          onClick={() => {
            dispatch(
              changeId(id),
              changeNickName(nickName),
              changeIntro(intro)
            );
            props.onHide();
          }}
        >
          변경사항 저장
        </Button>
      </div>
    </div>
  );
};

const protalElement = document.getElementById("overlays");

const ProfileModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(<BackDrop onHide={props.onHide} />, protalElement)}
      {ReactDOM.createPortal(<Profile onHide={props.onHide} />, protalElement)}
    </>
  );
};

export default ProfileModal;
