import React, { useState } from "react";
import ReactDOM from "react-dom";
import BackDrop from "../../../UI/BackDrop";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Switch from "@mui/material/Switch";

import style from "../../../UI/Modal.module.css";
import { faBell, faMoon } from "@fortawesome/free-solid-svg-icons";

// const label = { inputProps: { "aria-label": "Switch demo" } };

const Setting = () => {
  let [onSwitch, setOnSwitch] = useState("on");
  let [alarm, setAlarm] = useState("on");

  return (
    <div className={style.modal}>
      <div>
        <h2>
          <FontAwesomeIcon icon={faMoon} size="lg" />
          &nbsp;&nbsp; 어두운 테마 &nbsp;
          <Switch
            onClick={() => {
              onSwitch === "off" ? setOnSwitch("on") : setOnSwitch("off");
              console.log(onSwitch);
            }}
          />
        </h2>
        <p>다크모드를 활성화하여 눈의 피로를 덜어주세요.</p>
      </div>
      <div>
        <h2>
          <FontAwesomeIcon icon={faBell} size="lg" />
          &nbsp;&nbsp; 알림 &nbsp;
          <Switch
            onClick={() => {
              alarm === "off" ? setAlarm("on") : setAlarm("off");
              console.log(alarm);
            }}
          />
        </h2>

        <p>
          관심 있는 정보에 대한 알림을 원하는 기기에서 확인하세요. <br />
          계정의 업데이트와 관련된 알림을 계속 받을 수 있습니다.
        </p>
      </div>
    </div>
  );
};

const protalElement = document.getElementById("overlays");

const SettingModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(<BackDrop onHide={props.onHide} />, protalElement)}
      {ReactDOM.createPortal(<Setting />, protalElement)}
    </>
  );
};

export default SettingModal;
