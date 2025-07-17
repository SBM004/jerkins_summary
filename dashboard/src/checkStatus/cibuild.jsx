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

import React, { useEffect, useState } from "react";
import Passeds from "../assets/passed.jsx";
import Failedr from "../assets/failedr.jsx";
import Empty from "../assets/empty.jsx";

export const Ci_check = ({ ciJob }) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!ciJob || ciJob.trim() === "") {
      setStatus("failed");
      return;
    }

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
        } else {
          setStatus("none");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setStatus("failed");
      }
    };

    fetchStatus();
  }, [ciJob]);

  if (status === "none") return <Empty />;
  if (status === "skipped") return <Empty/>;
  if (status === "passed") return <Passeds />;
  return <Failedr />;
};
