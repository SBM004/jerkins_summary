import React from "react";
import empty from "../assets/empty.svg";
export default function Empty() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          width: "6vw",
          height: "3.5vh",
          left: "2vw",
          top: 0,
          position: "absolute",
          background: "rgba(15, 15, 255, 0.8)",
          borderRadius: 20,
        }}
      />
      <div
        style={{
          width: "6vw",
          height: "2vh",
          left: "2.5vw",
          top: "0vh",
          position: "absolute",
          color: "#baeeff",
          fontSize: "clamp(6px, 1vw, 18px)",
          fontFamily: "JejuGothic",
          fontWeight: "400",
          wordWrap: "break-word",
        }}
      >
        Empty
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          top: "0.9vh",
          left: "2.5vw",
          position: "relative",
        }}
      >
        <img src={empty} style={{ height: "2vh" }}></img>
      </div>
    </div>
  );
}

// lement.style {
//     width: 10vw;
//     height: 4.5vh;
//     left: 0px;
//     top: 0px;
//     position: relative;
//     background: rgba(0, 251, 8, 0.39);
//     border-radius: 20px;
