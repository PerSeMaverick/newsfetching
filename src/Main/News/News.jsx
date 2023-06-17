import React, { useEffect, useRef, useState } from "react";
import NewsItem from "./NewsItem";

import classes from "./News.module.css";

import LinearProgress from "@mui/material/LinearProgress";

import axios from "axios";

const News = ({ userSearchInput }) => {
  let [fetchedData, setFetchedData] = useState([]);
  let reqCount = useRef(1);
  let [progress, setProgress] = useState(false);

  useEffect(() => {
    fetchData(reqCount.current); // 초기값 반드시 필요, 없으면 첫 start파라미터가 없음
  }, []);

  useEffect(() => {
    let timer = setTimeout(() => {
      const observeLastItem = (observer, items) => {
        const lastItem = items[items.length - 1];
        observer.observe(lastItem);
        console.log(lastItem);
      };

      const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && userSearchInput === "") {
            observer.unobserve(entry.target);
            if (reqCount.current <= 1000) {
              reqCount.current += 10;
              console.log(reqCount.current);
              // 추가 요청 보내기
              fetchData(reqCount.current);
            } else {
              setProgress(false);
              console.log("No More Data");
              return;
            }

            timer = setTimeout(() => {
              setProgress(false);
              observeLastItem(observer, [
                ...document.querySelectorAll(".my-element"),
              ]);
            }, 1000);
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, {
        threshold: 1,
      });
      observeLastItem(observer, [...document.querySelectorAll(".my-element")]);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [userSearchInput]);

  const fetchData = async (startCount) => {
    setProgress(true);
    try {
      const response = await axios.get("http://localhost:8070/", {
        params: { display: 10, start: startCount, sort: "date" },
      });
      let newItems = [...response.data.items];
      setFetchedData((prevData) => {
        // 기존 데이터와 중복된 데이터를 제외한 새로운 데이터만 추가
        const newItemsFiltered = newItems.filter(
          (item) =>
            !prevData.some((prevItem) => prevItem.pubDate === item.pubDate)
        );
        return [...prevData, ...newItemsFiltered];
      });
    } catch (error) {
      console.error("Error fetching data from server:", error);
    } finally {
      setProgress(false);
    }
  };

  // const fetchData = async (reqCount) => {
  //   // console.dir(reqCount);
  //   try {
  //     setProgress(true);
  //     // https 아님!!!!!!!!
  //     const response = await axios.get("http://localhost:8070/", {
  //       params: { display: 20, start: reqCount, sort: "date" },
  //     });
  //     let copy = [...response.data.items];
  //     // 현재 상태 값을 업데이트할 때 이전 상태 값을 유지
  //     setFetchedData((prevData) => [...prevData, ...copy]);
  //     setProgress(false);
  //   } catch (error) {
  //     console.error("Error fetching data from server:", error);
  //   }
  // };

  let displayItems = fetchedData
    .filter((data) => {
      if (userSearchInput === "") {
        return data;
      } else if (data.title.includes(userSearchInput)) {
        return data;
      }
    })
    .map((data, i) => (
      <NewsItem
        key={i}
        id={data.pubDate}
        title={data.title}
        originallink={data.originallink}
        description={data.description}
        pubDate={data.pubDate}
      />
    ));

  return (
    <div className={classes.articles}>
      {fetchedData.length === 0 ? null : displayItems}
      {progress && (
        <LinearProgress style={{ padding: "10px", margin: "20px" }} />
      )}
    </div>
  );
};

export default News;
