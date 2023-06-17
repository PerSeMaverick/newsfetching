import React from "react";
import { useDispatch } from "react-redux";
import { onDeleteStore } from "../../../Store/bookMarkSlice";

import classes from "./BookMarkItems.module.css";
import style from "styled-components";

import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledBox = style.div`
    color: #000000;
    background-color : #ff851b;
    border-radius: 20px;
    padding: 8px 10px;
    margin-bottom: 10px;
`;

const StyledLink = style.a`
    color:#001f3f;
    text-decoration: none;
`;

const SmallPtag = style.p`
  font-size: 13px;
`;

const BookMarkItems = (props) => {
  let dispatch = useDispatch();

  return (
    <StyledBox key={props.originallink}>
      <div>
        <h5>{props.title}</h5>
        <SmallPtag>{props.description}</SmallPtag>
        <StyledLink href={`${props.originallink}`}>
          <SmallPtag>{props.originallink}</SmallPtag>
        </StyledLink>
        <div className={classes.bookMarkItemBottom}>
          <SmallPtag className={classes.bookMarkItemPubDate}>
            {props.pubDate}
          </SmallPtag>
          <Button
            className={classes.bookMarkDelete}
            color="error"
            style={{
              backgroundColor: "transparent",
              border: "none",
            }}
            onClick={() => {
              dispatch(onDeleteStore(props.id));
            }}
          >
            <DeleteIcon />
            저장취소
          </Button>
        </div>
      </div>
    </StyledBox>
  );
};

export default BookMarkItems;
