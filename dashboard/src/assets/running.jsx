import React from "react";
import clock from "../assets/clock.svg";
export default function Running() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          width: "6vw",
          height: "3.5vh",
          left: "1vw",
          top: 0,
          position: "absolute",
          background: "rgba(107, 171, 255, 0.8)",
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
          color: "#0000ffff",
          fontSize: "clamp(6px, 1vw, 18px)",
          fontFamily: "JejuGothic",
          fontWeight: "400",
          wordWrap: "break-word",
        }}
      >
        Running
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
        <img src={clock} style={{ height: "2vh" }}></img>
      </div>
    </div>
  );
}
