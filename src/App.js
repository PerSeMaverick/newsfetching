import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import Input from "@mui/material/Input";
import Tooltip from "@mui/material/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faGear, faUser } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

import { useDispatch, useSelector } from "react-redux";
import {
  onShowLogin,
  onLogined,
  onShowProfile,
  onShowBookMark,
} from "./Store/store";

import ProfileModal from "./Nav/IconHeader/Profile/ProfileModal";
import SettingModal from "./Nav/IconHeader/Setting/SettingModal";
import BookMarkModal from "./Nav/IconHeader/BookMark/BookMarkModal";
import IsLoggin from "./Main/IsLoggin/IsLoggin";
import News from "./Main/News/News";
import RealEstate from "./Main/RealEstate/RealEstate";
import Stock from "./Main/Stock/Stock";

function App() {
  const [content, setContent] = useState("News");
  const [setting, setSetting] = useState(false);
  const [isLogined, setIsLogined] = useState(false);
  const dispatch = useDispatch();
  let [userSearchInput, setUserSearchInput] = useState("");

  useEffect(() => {
    let geted = sessionStorage.getItem("userLoginInfo");
    geted = JSON.parse(geted);
    if (geted) {
      setIsLogined(true);
      dispatch(onLogined());
    }
  }, []);

  const onHide = () => {
    setSetting(false);
  };
  const onHideLogin = () => {
    dispatch(onShowLogin());
  };
  const onHideProfile = () => {
    dispatch(onShowProfile());
  };
  const onHideBookMark = () => {
    dispatch(onShowBookMark());
  };
  let loginCheck = useSelector((state) => state.loginHandler);

  const getValue = (e) => {
    setUserSearchInput(e.target.value);
  };

  return (
    <div className="wrapper">
      {loginCheck.showProfileModal === true ? (
        <ProfileModal onHide={onHideProfile} />
      ) : null}
      {setting === true ? <SettingModal onHide={onHide} /> : null}
      {loginCheck.showBookMarkModal === true ? (
        <BookMarkModal onHide={onHideBookMark} />
      ) : null}
      <nav>
        <div className="icons">
          <Tooltip title="내 정보" placement="top" arrow>
            <FontAwesomeIcon
              className="icon"
              icon={faUser}
              onClick={() => {
                if (loginCheck.alreadyLogin === false) {
                  dispatch(onShowLogin());
                } else {
                  dispatch(onShowProfile());
                }
              }}
            />
          </Tooltip>
          <Tooltip title="설정" placement="top" arrow>
            <FontAwesomeIcon
              className="icon"
              icon={faGear}
              onClick={() => {
                setSetting(true);
              }}
            />
          </Tooltip>
          <Tooltip title="북마크" placement="top" arrow>
            <FontAwesomeIcon
              className="icon"
              icon={faBookmark}
              onClick={() => {
                if (loginCheck.alreadyLogin === false) {
                  dispatch(onShowLogin());
                } else {
                  dispatch(onShowBookMark());
                }
              }}
            />
          </Tooltip>
        </div>
        <div className="tabs">
          <Link
            to="/home"
            onClick={() => {
              setContent("News");
            }}
          >
            News
          </Link>
          <Link
            to="/realestate"
            onClick={() => {
              setContent("RealEstate");
            }}
          >
            Real Estate
          </Link>
          <Link
            to="stock"
            onClick={() => {
              setContent("Stock");
            }}
          >
            Stock
          </Link>
        </div>
      </nav>
      <main>
        <header>
          <h1 className="title">{content} tab</h1>
          <Input
            className="searchInput"
            placeholder="제목으로 기사 검색"
            type="search"
            onChange={getValue}
          />
          <IsLoggin
            className="login"
            onHide={onHideLogin}
            onHideProfile={onHideProfile}
            isLogined={isLogined}
          />
        </header>
        <Routes>
          <Route
            path="/home"
            element={<News userSearchInput={userSearchInput} />}
          />
          <Route path="/realestate" element={<RealEstate />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
