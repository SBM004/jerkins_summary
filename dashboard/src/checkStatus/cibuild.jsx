/*import React from "react";
import Passeds from "../assets/passed.jsx";
import Failedr from "../assets/failedr.jsx";

export const Ci_check = (props) => {
  const ci_jobs = props.ciJob;
  if (!ci_jobs || ci_jobs.trim() === "") {
    // console.log(ci_jobs)
    return <Failedr />;
  } else {
    try {
      console.log(ci_jobs);
      fetch("http://localhost:3000/api/ci", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ciJob: ci_jobs }),
      })
        .then((response) => {
          response.json();
        })
        .then((data) => {
          console.log(data);
          if (!data) {
            return <Failedr />;
          } else {
            if (data.status === "failed") {
              return <Failedr />;
            }
          }
          return <Passeds />;
        });
    } catch (err) {
      return <Failedr />;
    }
  }
};*/
/*
import React, { useEffect, useState } from "react";
import Passeds from "../assets/passed.jsx";
import Failedr from "../assets/failedr.jsx";
import Empty from "../assets/empty.jsx";
import Running from "../assets/running.jsx";
import Skipped from "../assets/skipped.jsx";

export const Ci_check = ({ ciJob }) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!ciJob || ciJob.trim() === "") {
      setStatus("none");
      return;
    }

    setStatus("loading"); // Reset status when ciJob changes

    const fetchStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/ci", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ciJob }),
        });

        const data = await response.json();
        console.log("from frontend", data);

        if (!data || data.status === "failed") {
          setStatus("failed");
        } else if (data.status === "success") {
          setStatus("passed");
        } else if (data.status === "skipped") {
          setStatus("skipped");
        } else if (data.status === "cancelled") {
          setStatus("cancelled");
        } else if (data.status === "unknown") {
          setStatus("unknown");
        } else if (data.status === "running") {
          setStatus("running");
        } else {
          setStatus("notfound");
        }
        /*data.color && data.color.includes("anime") add later*\
      } catch (error) {
        console.error("Fetch error:", error);
        setStatus("failed");
      }
    };

    fetchStatus();
  }, [ciJob]);

  if (status === "none") return <Empty />;
  if (status === "running") return <Running />;
  if (status === "building") return <Running />;
  if (status === "cancelled") return "cancel";

  if (status === "skipped") return <Skipped />;
  if (status === "notfound") return <Failedr />;
  if (status === "unknown") return "unknown";
  if (status === "passed") return <Passeds />;
  if (status === "failed") return <Failedr />;
};*/

// cibuild.jsx
import React, { useEffect, useState } from "react";
import Passeds from "../assets/passed.jsx";
import Failedr from "../assets/failedr.jsx";
import Empty from "../assets/empty.jsx";
import Running from "../assets/running.jsx";
import Skipped from "../assets/skipped.jsx";
export const Ci_check = ({ ciJob, onStatus }) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!ciJob || ciJob.trim() === "") {
      setStatus("empty");
      onStatus && onStatus("empty");
      return;
    }

    // Only fetch if status is not already set
    if (status !== "loading") return;

    const fetchStatus = async () => {
      try {
        console.log("Trying in ci build");
        const response = await fetch("http://localhost:3000/api/ci", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ciJob }),
        });

        const data = await response.json();
        let newStatus = "notfound";

        if (!data || data.status === "failed") newStatus = "failed";
        else if (data.status === "success") newStatus = "passed";
        else if (data.status === "skipped") newStatus = "skipped";
        else if (data.status === "cancelled" || data.status === "cancel")
          newStatus = "cancel";
        else if (data.status === "unknown") newStatus = "unknown";
        else if (data.status === "running") newStatus = "running";

        setStatus(newStatus);
      } catch (error) {
        setStatus("failed");
      }
    };

    fetchStatus();
  }, [ciJob]);

  useEffect(() => {
    if (onStatus && status !== "loading") {
      onStatus(status);
    }
    // eslint-disable-next-line
  }, [status]);

  if (status === "empty") return <Empty />;
  if (status === "running" || status === "building") return <Running />;
  if (status === "cancelled" || status === "cancel") return "cancel";
  if (status === "skipped") return <Skipped />;
  if (status === "unknown") return "unknown";
  if (status === "passed") return <Passeds />;
  if (status === "failed" || status === "notfound") return <Failedr />;
};
