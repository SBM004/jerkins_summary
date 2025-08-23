import React from "react";
import broken from "../assets/broken.svg";
export default function Broken() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          width: "6vw",
          height: "3.5vh",
          left: "1vw",
          top: 0,
          position: "absolute",
          background: "rgba(246, 178, 6, 0.68)",
          borderRadius: 20,
        }}
      />
      <div
        style={{
          width: "6vw",
          height: "2vh",
          left: "1.5vw",
          top: "0vh",
          position: "absolute",
          color: "#ff8800ff",
          fontSize: "clamp(6px, 1vw, 18px)",
          fontFamily: "JejuGothic",
          fontWeight: "400",
          wordWrap: "break-word",
        }}
      >
        Broken
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          top: "0.9vh",
          left: "1.5vw",
          position: "relative",
        }}
      >
        <img src={broken} style={{ height: "2vh" }}></img>
      </div>
    </div>
  );
}
