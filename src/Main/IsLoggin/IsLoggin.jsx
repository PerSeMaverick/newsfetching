import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { onShowLogin, onLogined } from "../../Store/store";

import LogginModal from "./LogginModal";

import style from "styled-components";
import classes from "./IsLoggin.module.css";

import Avatar from "@mui/material/Avatar";
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
      ) : (
        <>
          <Button
            className={classes.sign}
            variant="contained"
            onClick={() => {
              dispatch(onShowLogin());
            }}
          >
            로그인
          </Button>
          &nbsp;
          <Button className={classes.sign} variant="outlined">
            회원가입
          </Button>
        </>
      )}
    </div>
  );
};

export default IsLoggin;
